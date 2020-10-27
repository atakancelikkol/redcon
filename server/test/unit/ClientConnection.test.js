const ClientConnection = require('../../src/ClientConnection');

let isAuthenticated = false;
const ip = '::ffff:127.0.0.1';
const id = '730a44c5-4985-4017-a0c5-d668d6dbdcc1';
const connection = { WebSocket: {} };

describe('ClientConnection', () => {
  describe('Constructor', () => {
    it('isAuthenticated', () => {
      const clientConnection = new ClientConnection({ isAuthenticated });
      expect(clientConnection.authenticated).toEqual(false);
    });

    it('ip', () => {
      const clientConnection = new ClientConnection({ ip });
      expect(clientConnection.ip).toEqual(expect.stringContaining(ip));
    });

    it('id', () => {
      const clientConnection = new ClientConnection({ id });
      expect(clientConnection.id).toEqual(expect.stringContaining(id));
    });

    it('userObject', () => {
      const clientConnection = new ClientConnection({});
      expect(clientConnection.userObject).toEqual(undefined);
    });

    it('connection', () => {
      const clientConnection = new ClientConnection({ connection });
      expect(clientConnection.connection).toEqual(connection);
    });
  });

  describe('isAuthenticated', () => {
    it('Value returned by isAuthenticated = false', () => {
      const clientConnection = new ClientConnection({ isAuthenticated });
      expect(clientConnection.isAuthenticated()).toBe(false);
    });

    it('Value returned by isAuthenticated = true', () => {
      isAuthenticated = true;
      const clientConnection = new ClientConnection({ isAuthenticated });
      expect(clientConnection.isAuthenticated()).toBe(true);
    });
  });

  describe('setAuthenticated', () => {
    it('Parameter passing to setAuthenticated = false', () => {
      const authentication = false;
      const clientConnection = new ClientConnection({ isAuthenticated });
      clientConnection.setAuthentication(authentication);
      expect(clientConnection.authenticated).toBe(false);
    });

    it('Parameter passing to setAuthenticated = true', () => {
      const authentication = true;
      const clientConnection = new ClientConnection({ isAuthenticated });
      clientConnection.setAuthentication(authentication);
      expect(clientConnection.authenticated).toBe(true);
    });
  });

  describe('getIp', () => {
    it("Value returned by getIp = '::ffff:127.0.0.1'", () => {
      const clientConnection = new ClientConnection({ ip });
      expect(clientConnection.getIp()).toEqual(expect.stringContaining(ip));
    });
  });

  describe('getId', () => {
    it("Value returned by getId = '730a44c5-4985-4017-a0c5-d668d6dbdcc1'", () => {
      const clientConnection = new ClientConnection({ id });
      expect(clientConnection.getId()).toEqual(expect.stringContaining(id));
    });
  });

  describe('lastActivityTime', () => {
    it('tests getLastActivityTime fnc works properly or not', () => {
      const clientConnection = new ClientConnection({});
      expect(clientConnection.getLastActivityTime()).toEqual(undefined);
    });

    it('tests setLastActivityTime fnc works properly or not', () => {
      const clientConnection = new ClientConnection({});
      clientConnection.setLastActivityTime('myTime');
      expect(clientConnection.lastActivityTime).toEqual('myTime');
    });
  });

  describe('setUserObject', () => {
    it("Parameter passing to setUserObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }", () => {
      const userInf = {
        username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
      };
      const clientConnection = new ClientConnection({});
      clientConnection.setUserObject(userInf);
      expect(clientConnection.userObject).toStrictEqual(userInf);
    });

    it('Parameter passing to setUserObject = null', () => {
      const userInf = null;
      const clientConnection = new ClientConnection({});
      clientConnection.setUserObject(userInf);
      expect(clientConnection.userObject).toStrictEqual(userInf);
    });
  });

  describe('getUserObject', () => {
    it('Value returned by getUserObject = undefined', () => {
      const clientConnection = new ClientConnection({});
      expect(clientConnection.getUserObject()).toEqual(undefined);
    });

    it("Value returned by getUserObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }", () => {
      const clientConnection = new ClientConnection({});
      clientConnection.userObject = {
        username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
      };
      expect(clientConnection.getUserObject()).toStrictEqual({
        username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
      });
    });

    it('Value returned by getUserObject = null ', () => {
      const clientConnection = new ClientConnection({});
      clientConnection.userObject = null;
      expect(clientConnection.getUserObject()).toStrictEqual(null);
    });
  });

  describe('send', () => {
    it("Value returned by send = {auth:{ user:{ username:'user', id: 'id', ip: '::ffff:127.0.0.1'}}}", () => {
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const clientConnection = new ClientConnection({ connection: mockConnection });
      const obj = { auth: { users: {
        username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
      } } };
      clientConnection.send(obj);
      expect(sendObject).toStrictEqual(JSON.stringify(obj));
    });
  });
});
