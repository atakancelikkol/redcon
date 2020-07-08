const jwt = require('jsonwebtoken');
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
  }

  getCopyState() {
    return { history: [...this.history] };
  }

  handleMessage(obj, client, clients) {
    if (obj && client.getUserObject()) {
      this.logUserActivity(client, 'interaction');
    }

    if (obj.auth) {
      const { action } = obj.auth;
      if (action === 'loginUser') {
        this.loginUser(client, obj.auth.username, /* obj.auth.password, obj.auth.receivedToken, */ clients);
      } else if (action === 'logoutUser') {
        this.logoutByButton(client, 'logged-out', clients);
      } else if (action === 'checkStoredToken') {
        this.checkStoredToken(client, obj.auth.storedToken, clients);
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
          this.activeUsername = result.userObject.username;
          client.setRegisterForInactivityValue(true);
          this.registerInactivityCheck(client, clients);
        } else {
          // Error: a user exists and its username doesn't match with the stored one
          this.sendUserToClient(client, null, `Stored Token have been checked, but there is another user: ${this.activeUsername} has logged in`);
        }
      } else {
        logger.debug('Token ip is invalid');
      }
    }
  }

  logUserActivity(client, activityType) {
    const insertHistoryItem = (historyClient) => {
      const currentDate = new Date();
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
      } else {
        insertHistoryItem(client);
      }
    }

    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }

  loginUser(client, username/* , password */, clients) {
    const isAuthenticated = true;
    if (isAuthenticated) {
      if (this.checkLoginStatus(username)) {
        client.setAuthentication(true);
        client.setUserObject({
          username, id: 'id', ip: client.getIp(),
        });
        const token = jwt.sign({ userObject: client.getUserObject() }, ServerConfig.AuthenticatorTokenSecret, { expiresIn: '24h' });
        this.sendUserToClient(client, client.getUserObject(), 'success', token);
        this.logUserActivity(client, 'login');
        this.activeUsername = username;
        client.setRegisterForInactivityValue(true);
        this.registerInactivityCheck(client, clients);
      } else {
        // Error: a user exists and its username doesn't match with the entered one
        this.sendUserToClient(client, null, `Cant login with '${username}' username, since another user: ${this.activeUsername} has logged in`);
      }
    } else {
      this.logoutByButton(client, 'login-error'); // Never enters here for now due to authentication implementation
    }
  }

  registerInactivityCheck(client, clients) {
    const inactivityCheck = () => {
      logger.debug(client.getRegisterForInactivityValue());
      client.inactivityTime += 1; // eslint-disable-line
      if (client.getRegisterForInactivityValue()) {
        client.setRegisterForInactivityValue(client.inactivityTime < ServerConfig.AuthenticatorTimeoutDuration);
        if (client.getRegisterForInactivityValue()) {
          setTimeout(inactivityCheck, 1000);
          logger.debug(`${client.inactivityTime}sec`);
        } else {
          this.logoutByTimeout(client, 'timeout', clients);
        }
      } else {
        this.updateActiveUsername(clients);
      }
    };
    inactivityCheck();
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

  onConnectionClosed(clients) {
    this.updateActiveUsername(clients);
  }

  checkLoginStatus(username) {
    if (this.doesUserExists()) {
      if (this.doesEnteredUsernameMatchWithExistingOne(username)) {
        return true;
      }
      return false;
    }
    return true;
  }

  doesUserExists() {
    if (this.activeUsername) {
      return true;
    }
    return false;
  }

  doesEnteredUsernameMatchWithExistingOne(username) {
    if (this.activeUsername === username) {
      return true;
    }
    return false;
  }

  logoutByButton(client, status, clients) {
    client.setRegisterForInactivityValue(false);
    const loggedOutClientsUsername = client.getUserObject().username;
    for (let index = 0; index < clients.length; index += 1) {
      const clientUserObject = clients[index].getUserObject();
      if (clientUserObject && clientUserObject.username === loggedOutClientsUsername) {
        this.logUserActivity(clients[index], 'interaction');
        clients[index].setAuthentication(false);
        clients[index].setUserObject(null);
        this.sendUserToClient(clients[index], null, status);
      }
    }
    this.updateActiveUsername(clients);
  }

  logoutByTimeout(client, status, clients) {
    this.logUserActivity(client, 'interaction');
    client.setAuthentication(false);
    client.setUserObject(null);
    this.sendUserToClient(client, null, status);
    this.updateActiveUsername(clients);
  }


  sendUserToClient(client, user, authStatus, token) {
    client.send({ auth: {
      user, authStatus, token,
    } });
  }
}

module.exports = Authenticator;
