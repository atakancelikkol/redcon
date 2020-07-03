class ClientConnection {
  constructor({
    id, ip, connection, isAuthenticated, onUserAuthChanged,
  }) {
    this.id = id;
    this.ip = ip;
    this.connection = connection;
    this.authenticated = isAuthenticated;
    this.userObject = undefined;
    this.onUserAuthChanged = onUserAuthChanged;
  }

  setAuthentication(authentication) {
    if (authentication !== this.authenticated) {
      this.authenticated = authentication;
      if (this.onUserAuthChanged) {
        this.onUserAuthChanged();
      }
    }
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
