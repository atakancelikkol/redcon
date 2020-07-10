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
    this.lastActivityTime = undefined;
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

  getLastActivityTime() {
    return this.lastActivityTime;
  }

  setUserObject(userInf) {
    this.userObject = userInf;
  }

  setLastActivityTime(time) {
    this.lastActivityTime = time;
  }
}

module.exports = ClientConnection;
