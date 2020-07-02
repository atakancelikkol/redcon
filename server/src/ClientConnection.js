class ClientConnection {
  constructor({
    id, ip, connection, isAuthenticated, authChangedCalled,
  }) {
    this.id = id;
    this.ip = ip;
    this.connection = connection;
    this.authenticated = isAuthenticated;
    this.userObject = undefined;
    this.onUserAuthChanged = authChangedCalled;
  }

  setAuthentication(authentication) {
    if (authentication !== this.authenticated && this.onUserAuthChanged) {
      this.onUserAuthChanged();
    }
    this.authenticated = authentication;
  }

  send(obj) {
    this.connection.send(JSON.stringify(obj));
  }

  isAuthenticated() {
    return this.authenticated;
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
