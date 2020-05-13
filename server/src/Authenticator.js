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
    obj.authHistory = this.getCopyState(); // eslint-disable-line
  }

  getCopyState() {
    return {
      history: [...this.history],
    };
  }

  handleMessage(obj, client) {
    if (obj && client.userObject) {
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

        if (result && result.userObject && client.ip === result.userObject.ip) {
          // console.log("Token ip verified with client ip.")
          client.isAuthenticated = true; // eslint-disable-line
          client.userObject = result.userObject; // eslint-disable-line
          this.sendUserToClient(client, result.userObject, 'success', receivedToken);
        } else {
          // console.log("Token ip is invalid!")
        }
      });
    }
  }

  logUserActivity(client, activityType) {
    const insertHistoryItem = (cli) => {
      const currentDate = new Date();
      const historyObject = { username: cli.userObject.username, date: currentDate, activityDate: currentDate };
      this.history.unshift(historyObject);
      this.history = this.history.slice(0, 10);
    };

    if (activityType === 'login') {
      insertHistoryItem(client);
    } else if (activityType === 'interaction') {
      const historyItem = this.history.find((h) => h.username === client.userObject.username);
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
      client.isAuthenticated = true; // eslint-disable-line
      client.userObject = { username, id: 'id', ip: client.ip }; // eslint-disable-line
      const token = jwt.sign({ userObject: client.userObject }, ServerConfig.TokenSecret, { expiresIn: '24h' });
      this.sendUserToClient(client, client.userObject, 'success', token);
      this.logUserActivity(client, 'login');
    } else {
      this.logoutUser(client, 'login-error');
    }
  }

  logoutUser(client, status) {
    this.logUserActivity(client, 'interaction');
    client.isAuthenticated = false; // eslint-disable-line
    client.userObject = null; // eslint-disable-line
    this.sendUserToClient(client, null, status);
  }

  sendUserToClient(client, user, authStatus, token) {
    client.send({ auth: { user, authStatus, token } });
  }

  onExit() {

  }
}

module.exports = Authenticator;
