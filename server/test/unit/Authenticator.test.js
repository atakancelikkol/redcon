const jwt = require('jsonwebtoken');
const rp = require('request-promise');
const Authenticator = require('../../src/controllers/Authenticator');
const ServerConfig = require('../../src/ServerConfig');

jest.mock('request-promise');
let mockErr;
let mockAuth;
let mockReg;

jest.mock('request-promise', () => jest.fn(() => {
  const err = mockErr;
  const body = {
    isAuth: mockAuth,
    isRegistered: mockReg,
  };

  if (err) {
    return Promise.reject();
  }

  return Promise.resolve(body);
}));

describe('Authenticator', () => {
  describe('isAuthRequired', () => {
    it('should return false', () => {
      const authenticator = new Authenticator();
      expect(authenticator.isAuthRequired()).toBe(false);
    });
  });

  describe('handleMessage', () => {
    it('should test the callings of logClientActivity and loginUser', () => {
      const authenticator = new Authenticator();
      const mockObj = {
        auth: { action: 'loginUser', username: 'mockUser', password: 'mockPass' },
      };
      const mockClient = {
        getUserObject: () => 'mockObject',
      };
      const mockClients = [];
      // { auth: { action: 'loginUser', username, password } };
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.logClientActivity = jest.fn();
      const temploginUser = authenticator.loginUser;
      authenticator.loginUser = jest.fn();

      authenticator.handleMessage(mockObj, mockClient, mockClients);
      expect(authenticator.logClientActivity).toHaveBeenCalled();
      expect(authenticator.loginUser).toHaveBeenCalled();

      authenticator.logClientActivity = templogClientActivity;
      authenticator.loginUser = temploginUser;
    });

    it('should test the callings of logClientActivity and logoutByButton', () => {
      const authenticator = new Authenticator();
      const mockObj = {
        auth: { action: 'logoutUser' },
      };
      const mockClient = {
        getUserObject: () => undefined,
      };
      const mockClients = [];
      // { auth: { action: 'loginUser', username, password } };
      const templogoutByButton = authenticator.logoutByButton;
      authenticator.logoutByButton = jest.fn();

      authenticator.handleMessage(mockObj, mockClient, mockClients);
      expect(authenticator.logoutByButton).toHaveBeenCalled();

      authenticator.logoutByButton = templogoutByButton;
    });

    it('should test the callings of logClientActivity and checkStoredToken', () => {
      const authenticator = new Authenticator();
      const mockObj = {
        auth: { action: 'checkStoredToken', storedToken: 'mockToken' },
      };

      const mockClient = {
        getUserObject: () => undefined,
      };
      const mockClients = [];
      // { auth: { action: 'loginUser', username, password } };
      const tempcheckStoredToken = authenticator.checkStoredToken;
      authenticator.checkStoredToken = jest.fn();

      authenticator.handleMessage(mockObj, mockClient, mockClients);
      expect(authenticator.checkStoredToken).toHaveBeenCalled();

      authenticator.checkStoredToken = tempcheckStoredToken;
    });

    it('should test the callings of registerUser', () => {
      const authenticator = new Authenticator();
      const mockObj = {
        auth: { action: 'registerUser', username: 'mockUser', password: 'mockPass' },
      };
      const mockClient = {
        getUserObject: () => 'mockObject',
      };
      const mockClients = [];

      const templogClientActivity = authenticator.logClientActivity;
      authenticator.logClientActivity = jest.fn();
      const tempRegisterUser = authenticator.registerAuthenticationServer;
      authenticator.registerAuthenticationServer = jest.fn();

      authenticator.handleMessage(mockObj, mockClient, mockClients);
      expect(authenticator.logClientActivity).toHaveBeenCalled();
      expect(authenticator.registerAuthenticationServer).toHaveBeenCalled();

      authenticator.logClientActivity = templogClientActivity;
      authenticator.loginUser = tempRegisterUser;
    });
  });

  describe('checkStoredToken', () => {
    it('tests scenario 1', () => {
      const authenticator = new Authenticator();
      const tempsendUserToClient = authenticator.sendUserToClient;
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.sendUserToClient = jest.fn();
      authenticator.logClientActivity = jest.fn();

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
        send: () => {},
      };
      authenticator.result = {
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
        iat: 1590075984,
        exp: 1590079584,
      };
      const token = jwt.sign({ userObject: authenticator.result.userObject }, ServerConfig.AuthenticatorTokenSecret, { expiresIn: '1m' });
      authenticator.checkStoredToken(mockClient, token, []);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      expect(authenticator.logClientActivity).toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.logClientActivity = templogClientActivity;
    });

    it('tests scenario 2', () => {
      const authenticator = new Authenticator();
      authenticator.activeUsername = 'mockUsername';
      const tempsendUserToClient = authenticator.sendUserToClient;
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.sendUserToClient = jest.fn();
      authenticator.logClientActivity = jest.fn();

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
      const token = jwt.sign({ userObject: authenticator.result.userObject }, ServerConfig.AuthenticatorTokenSecret, { expiresIn: '1m' });
      authenticator.checkStoredToken(mockClient, token, []);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      expect(authenticator.logClientActivity).not.toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.logClientActivity = templogClientActivity;
    });

    it('tests scenario 3', () => {
      const authenticator = new Authenticator();
      authenticator.activeUsername = 'mockUsername';
      const tempsendUserToClient = authenticator.sendUserToClient;
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.sendUserToClient = jest.fn();
      authenticator.logClientActivity = jest.fn();

      const client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.2',
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
      const token = jwt.sign({ userObject: authenticator.result.userObject }, ServerConfig.AuthenticatorTokenSecret, { expiresIn: '1m' });
      authenticator.checkStoredToken(mockClient, token, []);
      expect(authenticator.sendUserToClient).not.toHaveBeenCalled();
      expect(authenticator.logClientActivity).not.toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.logClientActivity = templogClientActivity;
    });

    it('tests scenario 4', () => {
      const authenticator = new Authenticator();
      const tempsendUserToClient = authenticator.sendUserToClient;
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.sendUserToClient = jest.fn();
      authenticator.logClientActivity = jest.fn();

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
        send: () => {},
      };
      authenticator.result = {
        userObject: {
          username: 'user', id: 'id', ip: '::ffff:127.0.0.1',
        },
        iat: 1590075984,
        exp: 1590079584,
      };
      authenticator.checkStoredToken(mockClient, 'token', []);
      expect(authenticator.sendUserToClient).not.toHaveBeenCalled();
      expect(authenticator.logClientActivity).not.toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.logClientActivity = templogClientActivity;
    });
  });

  describe('logClientActivity', () => {
    it('tests when activityType = login', () => {
      const authenticator = new Authenticator();
      const tempmakeLastActivityTimesEqualOnSameUsers = authenticator.makeLastActivityTimesEqualOnSameUsers;
      authenticator.makeLastActivityTimesEqualOnSameUsers = jest.fn();

      const mockClient = {
        getUserObject() { return { username: 'mockUser' }; },
        setLastActivityTime: () => {},
      };
      const mockClients = [];
      authenticator.logClientActivity(mockClient, 'login', mockClients);
      expect(authenticator.history.length).toBe(1);
      authenticator.makeLastActivityTimesEqualOnSameUsers = tempmakeLastActivityTimesEqualOnSameUsers;
    });

    it('tests when activityType = interaction', () => {
      const authenticator = new Authenticator();
      const tempmakeLastActivityTimesEqualOnSameUsers = authenticator.makeLastActivityTimesEqualOnSameUsers;
      authenticator.makeLastActivityTimesEqualOnSameUsers = jest.fn();

      const mockClient = {
        getUserObject() { return { username: 'mockUser' }; },
        setLastActivityTime: () => {},
      };
      const mockClients = [];
      authenticator.logClientActivity(mockClient, 'interaction', mockClients);
      expect(authenticator.history.length).toBe(1);
      authenticator.makeLastActivityTimesEqualOnSameUsers = tempmakeLastActivityTimesEqualOnSameUsers;
    });

    it('tests when activityType = interaction and there exists historyItem with same username of that client', () => {
      const authenticator = new Authenticator();
      authenticator.history = [{
        username: 'mockUser',
        date: 'mockDate',
        activityDate: 'mockActivityDate',
      }];
      const tempmakeLastActivityTimesEqualOnSameUsers = authenticator.makeLastActivityTimesEqualOnSameUsers;
      authenticator.makeLastActivityTimesEqualOnSameUsers = jest.fn();

      const mockClient = {
        getUserObject() { return { username: 'mockUser' }; },
        setLastActivityTime: () => {},
      };
      const mockClients = [];
      authenticator.logClientActivity(mockClient, 'interaction', mockClients);
      expect(authenticator.history.length).toBe(1);
      expect(authenticator.history.activityDate).not.toBe('mockActivityDate');
      authenticator.makeLastActivityTimesEqualOnSameUsers = tempmakeLastActivityTimesEqualOnSameUsers;
    });
  });

  describe('checkAuthServer', () => {
    it('checkAuthServer Function Success Case', async () => {
      const authenticator = new Authenticator();

      const username = 'user';
      const pass = 'pass';
      const mockUserInfo = { email: username, password: pass, action: 'authentication' };
      const options = {
        url: `${ServerConfig.authServer}/authenticate`,
        method: 'POST',
        json: true,
        body: mockUserInfo,
        headers: { 'Content-Type': 'application/json' },
      };
      mockErr = undefined;
      mockAuth = true;
      expect(await authenticator.checkAuthenticationServer(username, pass))
        .toStrictEqual(true);
      await authenticator.checkAuthenticationServer(username, pass);
      expect(rp).toHaveBeenCalledWith(options);
    });

    it('checkAuthServer Function Fail Case', async () => {
      const authenticator = new Authenticator();

      const username = 'user';
      const pass = 'pass';

      mockErr = undefined;
      mockAuth = false;
      expect(await authenticator.checkAuthenticationServer(username, pass))
        .toStrictEqual(false);
    });

    it('checkAuthServer Function Error Case', async () => {
      const authenticator = new Authenticator();

      const username = 'user';
      const pass = 'pass';

      mockErr = true;
      mockAuth = undefined;
      expect(await authenticator.checkAuthenticationServer(username, pass))
        .toStrictEqual(false);
    });
  });

  describe('registerAuthServer', () => {
    it('registerAuthServer Function Success Case', async () => {
      const authenticator = new Authenticator();

      const username = 'user';
      const pass = 'pass';
      const mockUserInfo = { email: username, password: pass, action: 'register' };
      const options = {
        url: `${ServerConfig.authServer}/register`,
        method: 'POST',
        json: true,
        body: mockUserInfo,
        headers: { 'Content-Type': 'application/json' },
      };

      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();

      mockErr = undefined;
      mockReg = true;

      const mockClient = {
        setUserObject: () => {},
        setAuthentication: () => {},
        getUserObject: () => {},
        getIp: () => 'mockIp',
      };

      expect(await authenticator.registerAuthenticationServer(mockClient, username, pass))
        .toStrictEqual(true);
      await authenticator.registerAuthenticationServer(mockClient, username, pass);
      expect(rp).toHaveBeenCalledWith(options);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
    });

    it('registerAuthServer Function Fail Case', async () => {
      const authenticator = new Authenticator();

      const username = 'user';
      const pass = 'pass';

      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();

      const mockClient = {
        setUserObject: () => {},
        setAuthentication: () => {},
        getUserObject: () => {},
        getIp: () => 'mockIp',
      };

      mockErr = undefined;
      mockReg = false;

      expect(await authenticator.registerAuthenticationServer(mockClient, username, pass))
        .toStrictEqual(false);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
    });

    it('registerAuthServer Function Error Case', async () => {
      const authenticator = new Authenticator();

      const username = 'user';
      const pass = 'pass';
      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();
      const mockClient = {
        setUserObject: () => {},
        setAuthentication: () => {},
        getUserObject: () => {},
        getIp: () => 'mockIp',
      };

      mockErr = true;
      mockReg = undefined;
      expect(await authenticator.registerAuthenticationServer(mockClient, username, pass))
        .toStrictEqual(false);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
    });
  });

  describe('loginUser', () => {
    it('tests when isAuthenticated = true but else cond', async () => {
      const authenticator = new Authenticator();
      ServerConfig.useAuthentication = true;
      authenticator.activeUsername = 'mockUsername2';
      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();
      authenticator.checkAuthenticationServer = jest.fn();
      authenticator.checkAuthenticationServer.mockReturnValueOnce(true);

      await authenticator.loginUser({}, 'mockUsername', []);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
    });

    it('tests when isAuthenticated = true', async () => {
      const authenticator = new Authenticator();
      ServerConfig.useAuthentication = true;

      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.logClientActivity = jest.fn();
      const mockClient = {
        setUserObject: () => {},
        setAuthentication: () => {},
        getUserObject: () => {},
        getIp: () => 'mockIp',
      };
      authenticator.checkAuthenticationServer = jest.fn();
      authenticator.checkAuthenticationServer.mockReturnValueOnce(true);
      await authenticator.loginUser(mockClient, 'mockUsername', []);
      expect(authenticator.activeUsername).toBe('mockUsername');
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.logClientActivity = templogClientActivity;
    });

    it('tests when isAuthenticated = false', async () => {
      const authenticator = new Authenticator();
      ServerConfig.useAuthentication = true;

      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.logClientActivity = jest.fn();
      const mockClient = {
        setUserObject: () => {},
        setAuthentication: () => {},
        getUserObject: () => {},
        getIp: () => 'mockIp',
      };
      authenticator.checkAuthenticationServer = jest.fn();
      authenticator.checkAuthenticationServer.mockReturnValueOnce(false);
      await authenticator.loginUser(mockClient, 'mockUsername', []);
      expect(authenticator.sendUserToClient).toHaveBeenCalledWith(expect.anything(), null, 'Can\'t login \'mockUsername\', Wrong password Try again!');
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.logClientActivity = templogClientActivity;
    });

    it('tests when isAuthenticated = undefined', async () => {
      const authenticator = new Authenticator();
      ServerConfig.useAuthentication = true;
      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.logClientActivity = jest.fn();
      const mockClient = {
        setUserObject: () => {},
        setAuthentication: () => {},
        getUserObject: () => {},
        getIp: () => 'mockIp',
      };
      authenticator.checkAuthenticationServer = jest.fn();
      authenticator.checkAuthenticationServer.mockReturnValueOnce(undefined);
      await authenticator.loginUser(mockClient, 'mockUsername', []);
      expect(authenticator.sendUserToClient).toHaveBeenCalledWith(expect.anything(), null, 'Can\'t login, Check username!');
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.logClientActivity = templogClientActivity;
    });
  });

  describe('checkIdleConnections', () => {
    it('tests checkIdleConnections', () => {
      const authenticator = new Authenticator();
      const templogoutByTimeout = authenticator.logoutByTimeout;
      authenticator.logoutByTimeout = jest.fn();
      authenticator.makeLastActivityTimesEqualOnSameUsers = jest.fn();
      const mockClients = [{
        getLastActivityTime() { return { getTime: () => 1 }; },
        isAuthenticated: () => true,
      }];
      authenticator.checkIdleConnections(mockClients);
      expect(authenticator.logoutByTimeout).toHaveBeenCalled();
      authenticator.logoutByTimeout = templogoutByTimeout;
    });
  });

  describe('makeLastActivityTimesEqualOnSameUsers', () => {
    it('tests makeLastActivityTimesEqualOnSameUsers', () => {
      const authenticator = new Authenticator();
      const mockClients = [{
        setLastActivityTime: () => {},
      }];
      const mockClient = {
        getLastActivityTime: () => {},
      };
      const setLastActivityTimeSpy = jest.spyOn(mockClients[0], 'setLastActivityTime');
      const getLastActivityTimeSpy = jest.spyOn(mockClient, 'getLastActivityTime');
      authenticator.makeLastActivityTimesEqualOnSameUsers(mockClient, mockClients);
      expect(setLastActivityTimeSpy).toHaveBeenCalled();
      expect(getLastActivityTimeSpy).toHaveBeenCalled();
    });
  });

  describe('updateActiveUsername', () => {
    it('tests updateActiveUsername scenario 1', () => {
      const authenticator = new Authenticator();
      authenticator.activeUsername = 'mockActiveUsername';

      const mockClients = [{
        getUserObject() { return { username: 'mockActiveUsername' }; },
      }];
      authenticator.updateActiveUsername(mockClients);
      expect(authenticator.activeUsername).toBe(mockClients[0].getUserObject().username);
    });

    it('tests updateActiveUsername scenario 2', () => {
      const authenticator = new Authenticator();
      authenticator.activeUsername = 'mockActiveUsername';

      const mockClients = [{
        getUserObject() { return { username: 'mockActiveUsername2' }; },
      }];
      authenticator.updateActiveUsername(mockClients);
      expect(authenticator.activeUsername).toBe(undefined);
    });
  });

  describe('onConnectionClosed', () => {
    it('tests onConnectionClosed', () => {
      const authenticator = new Authenticator();
      const tempupdateActiveUsername = authenticator.updateActiveUsername;
      authenticator.updateActiveUsername = jest.fn();
      authenticator.onConnectionClosed({}, []);
      expect(authenticator.updateActiveUsername).toHaveBeenCalled();
      authenticator.updateActiveUsername = tempupdateActiveUsername;
    });
  });

  describe('checkLoginStatus scenario 1', () => {
    it('tests checkLoginStatus fnc', () => {
      const authenticator = new Authenticator();
      expect(authenticator.checkLoginStatus('mockUsername')).toBe(true);
    });

    it('tests checkLoginStatus fnc scenario 2', () => {
      const authenticator = new Authenticator();
      authenticator.activeUsername = 'mockUsername2';
      authenticator.checkLoginStatus('mockUsername');
      expect(authenticator.checkLoginStatus('mockUsername')).toBe(false);
    });

    it('tests checkLoginStatus fnc scenario 3', () => {
      const authenticator = new Authenticator();
      authenticator.activeUsername = 'mockUsername';
      authenticator.checkLoginStatus('mockUsername');
      expect(authenticator.checkLoginStatus('mockUsername')).toBe(true);
    });
  });

  describe('logoutByButton', () => {
    it('tests logoutByButton fnc', () => {
      const authenticator = new Authenticator();
      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();
      const templogClientActivity = authenticator.logClientActivity;
      authenticator.logClientActivity = jest.fn();
      const tempupdateActiveUsername = authenticator.updateActiveUsername;
      authenticator.updateActiveUsername = jest.fn();
      const mockClients = [{
        getUserObject() { return { username: 'mockUsername' }; },
        setAuthentication: () => {},
        setUserObject: () => {},
      }];
      const mockClient = {
        getUserObject() { return { username: 'mockUsername' }; },
      };
      authenticator.logoutByButton(mockClient, 'status', mockClients);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      authenticator.logClientActivity = templogClientActivity;
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.updateActiveUsername = tempupdateActiveUsername;
    });
  });

  describe('logoutByTimeout', () => {
    it('tests logoutByTimeout fnc', () => {
      const authenticator = new Authenticator();
      const tempsendUserToClient = authenticator.sendUserToClient;
      authenticator.sendUserToClient = jest.fn();
      const tempupdateActiveUsername = authenticator.updateActiveUsername;
      authenticator.updateActiveUsername = jest.fn();
      const mockClients = [];
      const mockClient = {
        setAuthentication: () => {},
        setUserObject: () => {},
        setLastActivityTime: () => {},
      };
      authenticator.logoutByTimeout(mockClient, 'status', mockClients);
      expect(authenticator.sendUserToClient).toHaveBeenCalled();
      authenticator.sendUserToClient = tempsendUserToClient;
      authenticator.updateActiveUsername = tempupdateActiveUsername;
    });
  });

  describe('sendUserToClient', () => {
    it('tests sendUserToClient fnc', () => {
      const authenticator = new Authenticator();
      const mockClient = {
        send: () => {},
      };
      const clientSendSpy = jest.spyOn(mockClient, 'send');
      authenticator.sendUserToClient(mockClient, 'user', 'status', 'token');
      expect(clientSendSpy).toHaveBeenCalled();
    });
  });
});
