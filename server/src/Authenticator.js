var jwt = require('jsonwebtoken');

class Authenticator {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
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
      } else if (action == "checkStoredToken") {
        this.checkStoredToken(client, obj["auth"].storedToken);
      }
    }
  }

  checkStoredToken(client, receivedToken) {
    if (receivedToken) {
      jwt.verify(receivedToken, "secret_key", (err, result) => {
        if (err) {
          return;
        }

        if (result && result.userObject && client.ip == result.userObject.ip) {
          //console.log("Token ip verified with client ip.")
          client.isAuthenticated = true
          this.sendUserToClient(client, result.userObject, 'success', receivedToken);
        } else {
          //console.log("Token ip is invalid!")
        }      
      })
    }
  }

  loginUser(client, username, password) {
    const isAuthenticated = true
    if (isAuthenticated) {
      const userObject = { username: username, id: 'id', ip: client.ip };
      client.isAuthenticated = true;
      if (userObject) {
        const token = jwt.sign({ userObject }, 'secret_key', { expiresIn: "1h" })
        this.sendUserToClient(client, userObject, 'success', token);
      }
    } else {
      this.logoutUser(client, 'login-error');
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