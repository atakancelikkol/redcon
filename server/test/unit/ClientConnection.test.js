const ClientConnection = require('../../src/ClientConnection');

let isAuthenticated = false;
let ip = '::ffff:127.0.0.1';
let id = '730a44c5-4985-4017-a0c5-d668d6dbdcc1';
let connection = { WebSocket: {} }

describe("ClientConnection", () => {
  describe("Constructor", () => {
    it("isAuthenticated", () => {
      let clientConnection = new ClientConnection({ isAuthenticated });
      expect(clientConnection.authenticated).toEqual(false);
    });

    it("ip", () => {
      let clientConnection = new ClientConnection({ ip });
      expect(clientConnection.ip).toEqual(expect.stringContaining(ip));
    });

    it("id", () => {
      let clientConnection = new ClientConnection({ id });
      expect(clientConnection.id).toEqual(expect.stringContaining(id));
    });

    it("userObject", () => {
      let clientConnection = new ClientConnection({});
      expect(clientConnection.userObject).toEqual(undefined);
    });

    it("connection", () => {
      let clientConnection = new ClientConnection({ connection });
      expect(clientConnection.connection).toEqual(connection);
    });
  });

  describe("isAuthenticated", () => {
    it("Value returned by isAuthenticated = false", () => {
      let clientConnection = new ClientConnection({ isAuthenticated });
      expect(clientConnection.isAuthenticated()).toBe(false);
    });

    it("Value returned by isAuthenticated = true", () => {
      isAuthenticated = true;
      let clientConnection = new ClientConnection({ isAuthenticated });
      expect(clientConnection.isAuthenticated()).toBe(true);
    });
  });

  describe("setAuthenticated", () => {
    it("Parameter passing to setAuthenticated = false", () => {
      let authentication = false;
      let clientConnection = new ClientConnection({ isAuthenticated });
      clientConnection.setAuthentication(authentication)
      expect(clientConnection.authenticated).toBe(false);
    });

    it("Parameter passing to setAuthenticated = true", () => {
      let authentication = true;
      let clientConnection = new ClientConnection({ isAuthenticated });
      clientConnection.setAuthentication(authentication)
      expect(clientConnection.authenticated).toBe(true);
    });
  });

  describe("getIp", () => {
    it("Value returned by getIp = '::ffff:127.0.0.1'", () => {
      let clientConnection = new ClientConnection({ ip });
      expect(clientConnection.getIp()).toEqual(expect.stringContaining(ip));
    });
  });

  describe("getId", () => {
    it("Value returned by getId = '730a44c5-4985-4017-a0c5-d668d6dbdcc1'", () => {
      let clientConnection = new ClientConnection({ id });
      expect(clientConnection.getId()).toEqual(expect.stringContaining(id));
    });
  });

  describe("setUserObject", () => {
    it("Parameter passing to setUserObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }", () => {
      userInf = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      let clientConnection = new ClientConnection({});
      clientConnection.setUserObject(userInf)
      expect(clientConnection.userObject).toStrictEqual(userInf);
    });

    it("Parameter passing to setUserObject = null", () => {
      userInf = null
      let clientConnection = new ClientConnection({});
      clientConnection.setUserObject(userInf)
      expect(clientConnection.userObject).toStrictEqual(userInf);
    });
  });

  describe("getUserObject", () => {
    it("Value returned by getUserObject = undefined", () => {
      let clientConnection = new ClientConnection({});
      expect(clientConnection.getUserObject()).toEqual(undefined);
    });

    it("Value returned by getUserObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }", () => {
      let clientConnection = new ClientConnection({});
      clientConnection.userObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' };
      expect(clientConnection.getUserObject()).toStrictEqual({ username: 'user', id: 'id', ip: '::ffff:127.0.0.1' });
    });

    it("Value returned by getUserObject = null ", () => {
      let clientConnection = new ClientConnection({});
      clientConnection.userObject = null;
      expect(clientConnection.getUserObject()).toStrictEqual(null);
    });
  });

  describe("send", () => {
    it("Value returned by send = {auth:{ user:{ username:'user', id: 'id', ip: '::ffff:127.0.0.1'}}}", () => {
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      let clientConnection = new ClientConnection({ connection: mockConnection });
      let obj = { auth: { users: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' } } }
      clientConnection.send(obj);
      expect(sendObject).toStrictEqual(JSON.stringify(obj));
    });
  });
});