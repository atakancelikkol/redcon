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
        this.loginUser(client, obj["auth"].username, obj["auth"].password);
      } else if(action == "logoutUser") {
        this.logoutUser(client, 'logged-out');
      } 
    }
  }

  loginUser(client, username, password) {
    //accept every user
    const isAuthenticated = true
    if(isAuthenticated) {
      const userObject = {username: username, id: "id", email: "email"};
      client.isAuthenticated = true;
      if(userObject){
        const token = jwt.sign({ userObject }, 'secret_key', { expiresIn :"2h" })
        console.log(token)
        const decodedToken = jwt.verify(token, 'secret_key');
        console.log(decodedToken)
        console.log(decodedToken['userObject'].username)
      }
      this.sendUserToClient(client, userObject, 'success');
    } else {
      this.logoutUser(client, 'login-error');
    }
  }

  logoutUser(client, status) {
    client.isAuthenticated = false;
    this.sendUserToClient(client, null, status);
  }

  sendUserToClient(client, user, authStatus) {
    client.send({"auth": {user, authStatus}});
  }

  onExit() {

  }

}

module.exports = Authenticator;