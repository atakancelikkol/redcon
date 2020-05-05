var jwt = require('jsonwebtoken');

class Authenticator {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.users = [];
  }

  init() {

  }

  isAuthRequired() {
    return false;
  }

  appendData(obj) {

  }

  handleMessage(obj, client) {
    if (obj["auth"]) {
      let action = obj["auth"].action;
      if (action == "loginUser") {
        this.loginUser(client, obj["auth"].username, obj["auth"].password, obj["auth"].receivedToken);
      } else if (action == "logoutUser") {
        this.logoutUser(client, 'logged-out');
      }
    }
  }

  loginUser(client, username, password, receivedToken) {
    if (receivedToken) {
      const decodedToken = jwt.verify(token, 'secret_key');
      console.log(decodedToken)
      const user = decodedToken.username;
      this.users.forEach(item => {
        if (this.users[item] == user) {
          client.isAuthenticated = true;
          this.sendUserToClient(client, user, 'success');
        } else {
          console.log("Invalid Username")
        }
      })
    } else {
      const isAuthenticated = true
      if (isAuthenticated) {
        const userObject = { username: username, id: 'id' };
        client.isAuthenticated = true;
        if (userObject) {
          this.users.push(username);
          const token = jwt.sign({ userObject }, 'secret_key', { expiresIn: "2h" })
          console.log(token)
          this.sendUserToClient(client, userObject, 'success', token);
      }
      } else {
        this.logoutUser(client, 'login-error');
      }
    }
  }

  logoutUser(client, status) {
    client.isAuthenticated = false;
    this.sendUserToClient(client, null, status);
  }

  sendUserToClient(client, user, authStatus, token) {
    client.send({ "auth": { user, authStatus, token } });
  }

  onExit() {

  }

}

module.exports = Authenticator;