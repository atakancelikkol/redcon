const Authenticator = require('../../src/Authenticator');
const jwt = require('jsonwebtoken');
const ServerConfig = require('../../src/ServerConfig');

describe("Authenticator", () => {
  describe("isAuthRequired", () => {
    it("should return false", () => {
      const authenticator = new Authenticator({});
      expect(authenticator.isAuthRequired()).toBe(false);
    });
  });

  describe("handleMessage", () => {
    it("logUserActivity Function when historyItem exist", () => {
      const authenticator = new Authenticator({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      let obj = { portconfig: { action: 'readConfigFile' } };
      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      }
      mockGetUserObject = { getUserObject: () => { return client.userObject; } };

      const currentDate = new Date();
      authenticator.history = [
        { username: 'user', date: currentDate, activityDate: 'Invalid Value' },
      ]

      authenticator.handleMessage(obj, mockGetUserObject)
      expect(authenticator.history[0].activityDate).not.toBe('Invalid Value')
      expect(obj.authHistory).toStrictEqual({ history: authenticator.history });
    });

    it("logUserActivity Function when historyItem does not exist", () => {
      const authenticator = new Authenticator({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      let obj = { portconfig: { action: 'readConfigFile' } };
      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      }
      mockGetUserObject = { getUserObject: () => { return client.userObject; } };

      const currentDate = new Date();
      authenticator.history = [
        { username: ' ', date: currentDate, activityDate: 'Invalid Value' },
      ]

      authenticator.handleMessage(obj, mockGetUserObject)
      expect(authenticator.history[0].username).toBe(client.userObject.username);
      expect(obj.authHistory).toStrictEqual({ history: authenticator.history });
    });

    it("loginUser Function", () => {
      const authenticator = new Authenticator({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });

      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: { username: '', id: '', ip: '' }
      }
      
      userInf = { username: 'user', id: 'id', ip: client.ip}
      mockClient = {
        getUserObject: () => { return client.userObject; },
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => { return client.ip; },
        setUserObject: (userInf) => {client.userObject = userInf; },
        send: () => {}
      };
      obj = { auth: { action: 'loginUser', username: 'user', password: 'pass' } };

      const currentDate = new Date();
      authenticator.history = [
        { username: ' ', date: currentDate, activityDate: currentDate },
      ]

      authenticator.handleMessage(obj, mockClient)
      expect(client.userObject).toStrictEqual(userInf);
      expect(authenticator.history[0].username).toBe(client.userObject.username);
      expect(obj.authHistory).toStrictEqual({ history: authenticator.history });
    });

    it("logoutUser Function", () => {
      const authenticator = new Authenticator({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });

      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: true,
        userObject: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      }
      mockClient = {
        getUserObject: () => { return client.userObject; },
        setAuthentication: () => { client.authenticated = false; },
        getIp: () => { return client.ip; },
        setUserObject: () => { client.userObject.username = null; client.id = null; client.ip = null },
        send: () => {}
      };

      const currentDate = new Date();
      authenticator.history = [
        { username: 'user', date: currentDate, activityDate: 'Invalid Value' },
      ]
      obj = { auth: { action: 'logoutUser', username: 'user', password: 'pass' } };

      authenticator.handleMessage(obj, mockClient)
      expect(authenticator.history[0].activityDate).not.toBe('Invalid Value')
    });

    it("checkStoredToken Function when receivedToken exist", () => {
      const authenticator = new Authenticator({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });

      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: { username: 'username', id: 'id', ip: '::ffff:127.0.0.1' }
      }
      mockClient = {
        getUserObject: () => { return client.userObject; },
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => { return client.ip; },
        setUserObject: (o) => { client.userObject.username = o.username; client.id = 'id'; client.ip = '::ffff:127.0.0.1' },
        send: () => {}
      };
      authenticator.result = {
        userObject: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' },
        iat: 1590075984,
        exp: 1590079584
      }
      const token = jwt.sign({ userObject: authenticator.result.userObject }, ServerConfig.TokenSecret, { expiresIn: '1m' });
      obj = {
        auth: {
          action: 'checkStoredToken',
          storedToken: token
        }
      }
      authenticator.handleMessage(obj, mockClient)
      expect(client.userObject).toStrictEqual(authenticator.result.userObject);
    });

    it("checkStoredToken Function when receivedToken is expired", () => {
      const authenticator = new Authenticator({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });

      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: { username: 'username', id: 'id', ip: '::ffff:127.0.0.1' }
      }
      mockClient = {
        getUserObject: () => { return client.userObject; },
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => { return client.ip; },
        setUserObject: (o) => { client.userObject.username = o.username; client.id = 'id'; client.ip = '::ffff:127.0.0.1' },
        send: () => {}
      };
      authenticator.result = {
        userObject: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' },
        iat: 1590075984,
        exp: 1590079584
      }
      const token = jwt.sign({ userObject: authenticator.result.userObject }, ServerConfig.TokenSecret, { expiresIn: '100' });
      obj = {
        auth: {
          action: 'checkStoredToken',
          storedToken: token
        }
      }
      authenticator.handleMessage(obj, mockClient)
      expect(client.userObject).not.toStrictEqual(authenticator.result.userObject);
    });

    it("checkStoredToken Function when receivedToken is malformed", () => {
      const authenticator = new Authenticator({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });

      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: { username: 'username', id: 'id', ip: '::ffff:127.0.0.1' }
      }
      mockClient = {
        getUserObject: () => { return client.userObject; },
        setAuthentication: () => { client.authenticated = true; },
        getIp: () => { return client.ip; },
        setUserObject: (o) => { client.username = o.username; client.id = 'id'; client.ip = '::ffff:127.0.0.1' },
        send: () => {}
      };
      obj = {
        auth: {
          action: 'checkStoredToken',
          storedToken: 'Invalid Token'
        }
      }
      authenticator.result = {
        userObject: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' },
        iat: 1590075984,
        exp: 1590079584
      }

      authenticator.handleMessage(obj, mockClient)
      expect(client.userObject).not.toStrictEqual(authenticator.result.userObject);
    });
  });
});