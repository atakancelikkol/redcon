class ClientConnection {
  constructor({
    id, ip, connect, isAuthenticated,
  }) {
    this.id = id;
    this.ip = ip;
    this.connection = connect;
    this.authenticated = isAuthenticated;
    this.userObject = undefined;
  }

  send(obj) {
    this.connection.send(JSON.stringify(obj));
  }

  isAuthenticated() {
    return this.authenticated;
  }

  setAuthentication(authentication) {
    this.authenticated = authentication;
  }

  getId() {
    return this.id;
  }

  getIp() {
    return this.ip;
  }

  getUserObject() {
    return this.userObject;
  }

  setUserObject(userInf) {
    this.userObject = userInf;
  }
}

module.exports = ClientConnection;
