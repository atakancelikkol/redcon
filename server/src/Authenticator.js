const jwt = require('jsonwebtoken');
const rp = require('request-promise');
const ServerConfig = require('./ServerConfig');
const ControllerBase = require('./ControllerBase');
const logger = require('./util/Logger');

class Authenticator extends ControllerBase {
  constructor() {
    super('Authenticator');
    this.history = [];
    this.activeUsername = undefined;
  }

  isAuthRequired() {
    return false;
  }

  appendData(obj) {
    obj.authHistory = this.getCopyState(); // eslint-disable-line
    obj.useAuthentication = ServerConfig.useAuthentication;
  }

  getCopyState() {
    return { history: [...this.history] };
  }

  handleMessage(obj, client, clients) {
    if (obj && client.getUserObject()) {
      this.logClientActivity(client, 'interaction', clients);
    }

    if (obj.auth) {
      const { action } = obj.auth;
      if (action === 'loginUser') {
        this.loginUser(client, obj.auth.username, obj.auth.password, clients);
      } else if (action === 'logoutUser') {
        this.logoutByButton(client, 'Logged-out', clients);
      } else if (action === 'checkStoredToken') {
        this.checkStoredToken(client, obj.auth.storedToken, clients);
      } else if (action === 'registerUser') {
        this.registerUser(client, obj.auth.username, obj.auth.password);
      }
    }
  }

  checkStoredToken(client, receivedToken, clients) {
    if (receivedToken) {
      let result;
      try {
        result = jwt.verify(receivedToken, ServerConfig.AuthenticatorTokenSecret);
      } catch (ex) {
        logger.debug(ex);
      }

      if (result && result.userObject && client.getIp() === result.userObject.ip) {
        if (this.checkLoginStatus(result.userObject.username)) {
          logger.info('Token ip verified with client ip.');
          client.setAuthentication(true);
          client.setUserObject(result.userObject);
          this.sendUserToClient(client, result.userObject, 'success', receivedToken);
          this.logClientActivity(client, 'login', clients);
          this.activeUsername = result.userObject.username;
        } else {
          // Error: a user exists and its username doesn't match with the stored one
          this.sendUserToClient(client, null, `Stored Token have been checked, but there is another user: ${this.activeUsername} has logged in`);
        }
      } else {
        logger.debug('Token ip is invalid');
      }
    }
  }

  logClientActivity(client, activityType, clients) {
    const insertHistoryItem = (historyClient) => {
      const currentDate = new Date();
      historyClient.setLastActivityTime(currentDate);
      this.makeLastActivityTimesEqualOnSameUsers(client, clients);
      const historyObject = {
        username: historyClient.getUserObject().username, date: currentDate, activityDate: currentDate,
      };
      this.history.unshift(historyObject);
      this.history = this.history.slice(0, 10);
    };

    if (activityType === 'login') {
      insertHistoryItem(client);
    } else if (activityType === 'interaction') {
      const historyItem = this.history.find((h) => h.username === client.getUserObject().username);
      if (historyItem) {
        historyItem.activityDate = new Date();
        client.setLastActivityTime(historyItem.activityDate);
        this.makeLastActivityTimesEqualOnSameUsers(client, clients);
      } else {
        insertHistoryItem(client);
      }
    }

    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }

  async checkAuthenticationServer(username, pass) {
    const userInfo = { email: username, password: pass, action: 'authentication' };
    let isAuth = false;
    const options = {
      url: `${ServerConfig.authServer}/authServer`,
      method: 'POST',
      json: true,
      body: userInfo,
      headers: { 'Content-Type': 'application/json' },
    };
    await rp(options).then((body) => {
      isAuth = body.isAuth;
    }).catch((error) => {
      logger.error(error);
    });
    return (isAuth);
  }

  async registerAuthenticationServer(username, pass) {
    const userInfo = { email: username, password: pass, action: 'register' };
    let isRegistered = false;
    const options = {
      url: `${ServerConfig.authServer}/authServer`,
      method: 'POST',
      json: true,
      body: userInfo,
      headers: { 'Content-Type': 'application/json' },
    };
    await rp(options).then((body) => {
      isRegistered = body.isRegistered;
    }).catch((error) => {
      logger.error(error);
    });
    return (isRegistered);
  }

  async registerUser(client, username, password) {
    let isRegistered = false;
    isRegistered = await this.registerAuthenticationServer(username, password);
  }

  async loginUser(client, username, password, clients) {
    let isAuthenticated = false;
    if (ServerConfig.useAuthentication) {
      isAuthenticated = await this.checkAuthenticationServer(username, password);
      // isAuthenticated = await this.registerAuthenticationServer(username, password);
    } else {
      isAuthenticated = true;
    }
    if (isAuthenticated === true) {
      if (this.checkLoginStatus(username)) {
        client.setAuthentication(true);
        client.setUserObject({
          username, id: 'id', ip: client.getIp(),
        });
        const token = jwt.sign({ userObject: client.getUserObject() }, ServerConfig.AuthenticatorTokenSecret, { expiresIn: '24h' });
        this.sendUserToClient(client, client.getUserObject(), 'success', token);
        this.logClientActivity(client, 'login', clients);
        this.activeUsername = username;
      } else {
        // Error: a user exists and its username doesn't match with the entered one
        this.sendUserToClient(client, null, `Can't login with '${username}' username, since another user: ${this.activeUsername} has logged in`);
      }
    } else if (isAuthenticated === false) {
      // this.logoutByButton(client, 'login-error', clients);
      this.sendUserToClient(client, null, `Can't login '${username}', Wrong password Try again!`);
    } else {
      // this.logoutByButton(client, 'login-error', clients);
      this.sendUserToClient(client, null, 'Can\'t login, Check username!');
    }
  }

  checkIdleConnections(clients) {
    const currentDate = new Date();
    // logger.debug('clients.length: ',clients.length);
    clients.forEach((client) => {
      if (client && client.isAuthenticated() && client.getLastActivityTime()) {
        const idleTime = (currentDate.getTime() - client.getLastActivityTime().getTime()) / 1000;
        // logger.debug('idleTime: ', idleTime);
        if ((idleTime > ServerConfig.AuthenticatorTimeoutDuration) /* && this.checkInactivityOfOtherClientsWithSameUsername(currentDate, index ,clients) */) { // TODO: Check if that username is active on another tab
          this.logoutByTimeout(client, 'timeout', clients);
        }
      }
    });
  }

  makeLastActivityTimesEqualOnSameUsers(client, clients) {
    for (let index = 0; index < clients.length; index += 1) {
      clients[index].setLastActivityTime(client.getLastActivityTime());
    }
  }

  updateActiveUsername(clients) {
    let allConnectionsClosedSameWithCurrentActiveUsername = true;
    for (let index = 0; index < clients.length; index += 1) {
      const clientUserObject = clients[index].getUserObject();
      if (clientUserObject && clientUserObject.username === this.activeUsername) {
        allConnectionsClosedSameWithCurrentActiveUsername = false;
        break;
      }
    }
    if (allConnectionsClosedSameWithCurrentActiveUsername) {
      this.activeUsername = undefined;
    }
  }

  onConnectionClosed(client, clients) {
    this.updateActiveUsername(clients);
  }

  checkLoginStatus(username) {
    if (this.activeUsername) {
      if (this.activeUsername === username) {
        return true;
      }
      return false;
    }
    return true;
  }

  logoutByButton(client, status, clients) {
    const loggedOutClientsUsername = client.getUserObject().username;
    clients.forEach((clientIndex) => {
      const clientUserObject = clientIndex.getUserObject();
      if (clientUserObject && clientUserObject.username === loggedOutClientsUsername) {
        this.logClientActivity(clientIndex, 'interaction', clients);
        clientIndex.setAuthentication(false);
        clientIndex.setUserObject(null);
        this.sendUserToClient(clientIndex, null, status);
      }
    });
    this.updateActiveUsername(clients);
  }

  logoutByTimeout(client, status, clients) {
    // this.logClientActivity(client, 'logout by timeout', clients);
    client.setAuthentication(false);
    client.setUserObject(null);
    this.sendUserToClient(client, null, status);
    client.setLastActivityTime(undefined);
    this.updateActiveUsername(clients);
  }

  sendUserToClient(client, user, authStatus, token) {
    client.send({
      auth: {
        user, authStatus, token,
      },
    });
  }
}

module.exports = Authenticator;
