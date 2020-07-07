const jwt = require('jsonwebtoken');
const ServerConfig = require('./ServerConfig');
const ControllerBase = require('./ControllerBase');
const logger = require('./util/Logger');

class Authenticator extends ControllerBase {
  constructor() {
    super('Authenticator');
    this.history = [];
    this.activeUser = undefined;
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

  handleMessage(obj, client) {
    if (obj && client.getUserObject()) {
      this.logUserActivity(client, 'interaction');
    }

    if (obj.auth) {
      const { action } = obj.auth;
      if (action === 'loginUser') {
        this.loginUser(client, obj.auth.username, obj.auth.password, obj.auth.receivedToken);
      } else if (action === 'logoutUser') {
        this.logoutUser(client, 'logged-out');
      } else if (action === 'checkStoredToken') {
        this.checkStoredToken(client, obj.auth.storedToken);
      }
    }
  }

  checkStoredToken(client, receivedToken) {
    if (receivedToken) {
      let result;
      try {
        result = jwt.verify(receivedToken, ServerConfig.TokenSecret);
      } catch (ex) {
        logger.debug(ex);
      }

      if (result && result.userObject && client.getIp() === result.userObject.ip) {
        logger.info('Token ip verified with client ip.');
        client.setAuthentication(true);
        client.setUserObject(result.userObject);
        this.sendUserToClient(client, result.userObject, 'success', receivedToken);
        // this.activeUser = result.userObject.username;
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

  loginUser(client, username/* , password */) {
    const isAuthenticated = true;
    if (isAuthenticated) {
      if (this.checkLoginStatus(username)) {
        client.setAuthentication(true);
        client.setUserObject({
          username, id: 'id', ip: client.getIp(),
        });
        const token = jwt.sign({ userObject: client.getUserObject() }, ServerConfig.TokenSecret, { expiresIn: '24h' });
        this.sendUserToClient(client, client.getUserObject(), 'success', token);
        this.logUserActivity(client, 'login');
        this.activeUser = username;
      } else { // Error: a user exists and its username doesn't match with the entered one
      }
    } else {
      this.logoutUser(client, 'login-error');
    }
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
    if (this.activeUser) {
      return true;
    }
    return false;
  }

  doesEnteredUsernameMatchWithExistingOne(username) {
    if (this.activeUser === username) {
      return true;
    }
    return false;
  }

  logoutUser(client, status) {
    this.logUserActivity(client, 'interaction');
    client.setAuthentication(false);
    client.setUserObject(null);
    this.sendUserToClient(client, null, status);
    this.activeUser = undefined;
  }

  sendUserToClient(client, user, authStatus, token) {
    client.send({ auth: {
      user, authStatus, token,
    } });
  }
}

module.exports = Authenticator;
