const jwt = require('jsonwebtoken');
const ServerConfig = require('./ServerConfig');

class Authenticator {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.history = [];
  }

  init() {

  }

  isAuthRequired() {
    return false;
  }

  appendData(obj) {
    obj.authHistory = this.getCopyState();
  }

  getCopyState() {
    return {
      history: [...this.history],
    };
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
      jwt.verify(receivedToken, ServerConfig.TokenSecret, (err, result) => {
        if (err) {
          return;
        }

        if (result && result.userObject && client.getIp() === result.userObject.ip) {
          // console.log("Token ip verified with client ip.")
          client.setAuthenticated(true);
          client.setUserObject(result.userObject);
          this.sendUserToClient(client, result.userObject, 'success', receivedToken);
        } else {
          // console.log("Token ip is invalid!")
        }
      });
    }
  }

  logUserActivity(client, activityType) {
    const insertHistoryItem = (client) => {
      const currentDate = new Date();
      const historyObject = { username: client.getUserObject().username, date: currentDate, activityDate: currentDate };
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

  loginUser(client, username, password) {
    const isAuthenticated = true;
    if (isAuthenticated) {
      client.setAuthenticated(true);
      client.setUserObject({ username: username, id: 'id', ip: client.getIp() });
      const token = jwt.sign({ userObject: client.getUserObject() }, ServerConfig.TokenSecret, { expiresIn: '24h' });
      this.sendUserToClient(client, client.getUserObject(), 'success', token);
      this.logUserActivity(client, 'login');
    } else {
      this.logoutUser(client, 'login-error');
    }
  }

  logoutUser(client, status) {
    this.logUserActivity(client, 'interaction');
    client.setAuthenticated(false);
    client.setUserObject(null);
    this.sendUserToClient(client, null, status);
  }

  sendUserToClient(client, user, authStatus, token) {
    client.send({ auth: { user, authStatus, token } });
  }

  onExit() {

  }
}

module.exports = Authenticator;
