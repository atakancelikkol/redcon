var jwt = require('jsonwebtoken');

class Authenticator {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.startTime = 0;
    this.user = '';
    this.history = [];
  }

  init() {

  }

  isAuthRequired() {
    return false;
  }

  appendData(obj) {
    obj["member"] = this.getCopyState();
    console.log(obj["member"])
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
    console.log("received token:", receivedToken)
    if (receivedToken) {
      jwt.verify(receivedToken, "secret_key", (err, result) => {
        if (err) {
          if (err.name == "TokenExpiredError") {
            console.log("Expired") //This case is when token expired
          }
          else {
            console.log(err.name) //Any other case
          }
        }
        else {
          if (result && result.userObject && client.ip == result.userObject.ip) {
            console.log("Token ip verified with client ip.")
            client.isAuthenticated = true
            this.sendUserToClient(client, result.userObject, 'success', receivedToken);
          } else {
            console.log("Token ip is invalid!")
          }
        }
      })
    }
  }

  getCopyState() {
    return {
      startTime: this.startTime,
      username: this.user,
      history: [...this.history],
    }
  }

  setMember(){
    this.startTime = new Date().toTimeString();
    this.history.unshift({ username: this.user, date: new Date() });
    this.history = this.history.slice(0, 10);
   
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }

  loginUser(client, username, password) {
    const isAuthenticated = true
    if (isAuthenticated) {
      this.user=username;
      this.setMember();
      const userObject = { username: username, id: 'id', ip: client.ip };
      client.isAuthenticated = true;
      if (userObject) {
        const token = jwt.sign({ userObject }, 'secret_key', { expiresIn: "120" })
        console.log("token generated", token)
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