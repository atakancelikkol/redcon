const jwt = require('jsonwebtoken');
const Authenticator = require('../../src/Authenticator');
const ServerConfig = require('../../src/ServerConfig');

describe('Authenticator', () => {
  describe('isAuthRequired', () => {
    it('should return false', () => {
      const authenticator = new Authenticator();
      expect(authenticator.isAuthRequired()).toBe(false);
    });
  });

  describe('handleMessage', () => {
    it('logUserActivity Function when historyItem exist', () => {
      const authenticator = new Authenticator();
      let sentObject;
      authenticator.registerSendMessageCallback((h, o) => {
        sentObject = o;
      });
      const obj = { serial: { action: 'openDevice' } };
      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
      };
      const mockGetUserObject = { getUserObject: () => client.userObject };

      const currentDate = new Date();
      authenticator.history = [
        {
          username: 'user', date: currentDate, activityDate: 'Invalid Value',
        },
      ];

      authenticator.handleMessage(obj, mockGetUserObject);
      expect(authenticator.history[0].activityDate).not.toBe('Invalid Value');
      expect(sentObject.authHistory).toStrictEqual({ history: authenticator.history });
    });

    it('logUserActivity Function when historyItem does not exist', () => {
      const authenticator = new Authenticator();
      let sentObject;
      authenticator.registerSendMessageCallback((h, o) => {
        sentObject = o;
      });
      const obj = { serial: { action: 'openDevice' } };
      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
      };
      const mockGetUserObject = { getUserObject: () => client.userObject };

      const currentDate = new Date();
      authenticator.history = [
        {
          username: ' ', date: currentDate, activityDate: 'Invalid Value',
        },
      ];

      authenticator.handleMessage(obj, mockGetUserObject);
      expect(authenticator.history[0].username).toBe(client.userObject.username);
      expect(sentObject.authHistory).toStrictEqual({ history: authenticator.history });
    });

    it('loginUser Function', async () => {
      const authenticator = new Authenticator();
      let sentObject;
      authenticator.registerSendMessageCallback((h, o) => {
        sentObject = o;
      });
      authenticator.checkAuthenticationServer = jest.fn();
      authenticator.checkAuthenticationServer.mockReturnValueOnce(true);

      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: {
          username: '', id: '', ip: '',
        },
      };

      const userInf = {
        username: 'user', id: 'id', ip: client.ip,
      };

      const mockClient = {
        getUserObject: () => client.userObject,
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => client.ip,
        setUserObject: (userInfoPar) => { client.userObject = userInfoPar; },
        send: () => { },
      };

      const obj = {
        auth: {
          action: 'loginUser', username: 'user', password: 'pass',
        },
      };

      const currentDate = new Date();
      authenticator.history = [
        {
          username: ' ', date: currentDate, activityDate: currentDate,
        },
      ];

      await authenticator.loginUser(mockClient, 'user', 'pass');
      expect(client.userObject).toStrictEqual(userInf);
      expect(authenticator.history[0].username).toBe(client.userObject.username);
      expect(sentObject.authHistory).toStrictEqual({ history: authenticator.history });
    });

    it('logoutUser Function', () => {
      const authenticator = new Authenticator();
      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: true,
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
      };
      const mockClient = {
        getUserObject: () => client.userObject,
        setAuthentication: () => { client.authenticated = false; },
        getIp: () => client.ip,
        setUserObject: () => { client.userObject.username = null; client.id = null; client.ip = null; },
        send: () => { },
      };

      const currentDate = new Date();
      authenticator.history = [
        {
          username: 'user', date: currentDate, activityDate: 'Invalid Value',
        },
      ];
      const obj = {
        auth: {
          action: 'logoutUser', username: 'user', password: 'pass',
        },
      };

      authenticator.handleMessage(obj, mockClient);
      expect(authenticator.history[0].activityDate).not.toBe('Invalid Value');
    });

    it('checkStoredToken Function when receivedToken exist', () => {
      const authenticator = new Authenticator();
      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: {
          username: 'username', id: 'id', ip: '::ffff:127.0.0.1',
        },
      };
      const mockClient = {
        getUserObject: () => client.userObject,
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => client.ip,
        setUserObject: (o) => { client.userObject.username = o.username; client.id = 'id'; client.ip = '::ffff:127.0.0.1'; },
        send: () => { },
      };
      authenticator.result = {
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
        iat: 1590075984,
        exp: 1590079584,
      };
      const token = jwt.sign({ userObject: authenticator.result.userObject }, ServerConfig.TokenSecret, { expiresIn: '1m' });
      const obj = {
        auth: {
          action: 'checkStoredToken',
          storedToken: token,
        },
      };
      authenticator.handleMessage(obj, mockClient);
      expect(client.userObject).toStrictEqual(authenticator.result.userObject);
    });

    it('checkStoredToken Function when receivedToken is expired', () => {
      const authenticator = new Authenticator();
      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: {
          username: 'username', id: 'id', ip: '::ffff:127.0.0.1',
        },
      };
      const mockClient = {
        getUserObject: () => client.userObject,
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => client.ip,
        setUserObject: (o) => { client.userObject.username = o.username; client.id = 'id'; client.ip = '::ffff:127.0.0.1'; },
        send: () => { },
      };
      authenticator.result = {
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
        iat: 1590075984,
        exp: 1590079584,
      };
      const token = jwt.sign({ userObject: authenticator.result.userObject }, ServerConfig.TokenSecret, { expiresIn: '100' });
      const obj = {
        auth: {
          action: 'checkStoredToken',
          storedToken: token,
        },
      };
      authenticator.handleMessage(obj, mockClient);
      expect(client.userObject).not.toStrictEqual(authenticator.result.userObject);
    });

    it('checkStoredToken Function when receivedToken is malformed', () => {
      const authenticator = new Authenticator();
      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: {
          username: 'username', id: 'id', ip: '::ffff:127.0.0.1',
        },
      };
      const mockClient = {
        getUserObject: () => client.userObject,
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => client.ip,
        setUserObject: (o) => { client.username = o.username; client.id = 'id'; client.ip = '::ffff:127.0.0.1'; },
        send: () => { },
      };
      const obj = {
        auth: {
          action: 'checkStoredToken',
          storedToken: 'Invalid Token',
        },
      };
      authenticator.result = {
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
        iat: 1590075984,
        exp: 1590079584,
      };

      authenticator.handleMessage(obj, mockClient);
      expect(client.userObject).not.toStrictEqual(authenticator.result.userObject);
    });
  });
});
