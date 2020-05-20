const Authenticator = require('../../src/Authenticator');
const ServerConfig = require('../../src/ServerConfig');
const jwt = require('jsonwebtoken');

describe("Authenticator", () => {
  describe("isAuthRequired", () => {
    it("should return false", () => {
      const authenticator = new Authenticator({});
      expect(authenticator.isAuthRequired()).toBe(false);
    });
  });

  describe("appendData", () => {
    it("obj.authHistory should contain history of user information", () => {
      const currentDate = new Date();
      const authenticator = new Authenticator({});
      authenticator.history = [
        { username: 'user', date: currentDate, activityDate: currentDate },
      ]
      const obj = {}
      authenticator.appendData(obj);
      expect(obj.authHistory).toStrictEqual({history: authenticator.history});
    });
  });

  describe("getCopyState", () => {
    it("should return history of user informations", () => {
      const currentDate = new Date();
      const authenticator = new Authenticator({});
      authenticator.history = [
        { username: 'user', date: currentDate, activityDate: currentDate },
      ]
      authenticator.getCopyState();
      expect(authenticator.getCopyState()).toStrictEqual({history: authenticator.history});
    });
  });

  describe("handleMessage", () => {
    it("logUserActivity Function", () => {
      const authenticator = new Authenticator({});
      const userObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      mockUserObject = { getUserObject: () => { return userObject; } };
      const mockLogUserActivity = jest.fn();
      authenticator.logUserActivity = mockLogUserActivity;
      const obj = { portconfig: { action: 'readConfigFile' } };

      authenticator.handleMessage(obj, mockUserObject)
      expect(mockLogUserActivity).toHaveBeenCalled();
    });

    it("loginUser Function", () => {
      const authenticator = new Authenticator({});
      const userObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      mockUserObject = { getUserObject: () => { return userObject; } };
      const mockLogUserActivity = jest.fn();
      authenticator.logUserActivity = mockLogUserActivity;
      const obj = { auth : { action: 'loginUser', username: 'user', password: 'pass' } };

      const mockLoginUser = jest.fn();
      authenticator.loginUser = mockLoginUser;
    
      authenticator.handleMessage(obj, mockUserObject)
      expect(mockLoginUser).toHaveBeenCalled();
    });

    it("logoutUser Function", () => {
      const authenticator = new Authenticator({});
      const userObject = { username: 'mert', id: 'id', ip: '::ffff:127.0.0.1' }
      mockUserObject = { getUserObject: () => { return userObject; } };
      const mockLogUserActivity = jest.fn();
      authenticator.logUserActivity = mockLogUserActivity;
      const obj = { auth : { action: 'logoutUser', username: 'user', password: 'pass' } };

      const mockLogoutUser = jest.fn();
      authenticator.logoutUser = mockLogoutUser;
    
      authenticator.handleMessage(obj, mockUserObject)
      expect(mockLogoutUser).toHaveBeenCalled();
    });

    it("checkStoredToken Function", () => {
      const authenticator = new Authenticator({});
      const userObject = { username: 'mert', id: 'id', ip: '::ffff:127.0.0.1' }
      mockUserObject = { getUserObject: () => { return userObject; } };
      const mockLogUserActivity = jest.fn();
      authenticator.logUserActivity = mockLogUserActivity;
      const obj = { auth : { action: 'checkStoredToken', username: 'user', password: 'pass' } };

      const mockCheckStoredToken = jest.fn();
      authenticator.checkStoredToken = mockCheckStoredToken;
    
      authenticator.handleMessage(obj, mockUserObject)
      expect(mockCheckStoredToken).toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("loginUser when isAuthenticated is true", () => {

      const authenticator = new Authenticator({});
      let username = 'user';
      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: undefined
      }
      const mockSetAuthentication = jest.fn();
      client.setAuthentication = mockSetAuthentication;
      const mockgetIp = jest.fn();
      client.getIp = mockgetIp;
      const mockSetUserObject = jest.fn();
      client.setUserObject = mockSetUserObject;
      const mockGetUserObject = jest.fn();
      client.getUserObject=mockGetUserObject;
      const mockSend = jest.fn();
      client.send=mockSend;
      const mockSendUserToClient = jest.fn();
      authenticator.sendUserToClient = mockSendUserToClient;
      const mockLogUserActivity = jest.fn();
      authenticator.logUserActivity = mockLogUserActivity;
      const mockJWT = jest.fn();
      jwt.sign = mockJWT;

      authenticator.loginUser(client, username)
      expect(mockSetAuthentication).toHaveBeenCalled();
      expect(mockSetUserObject).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockSendUserToClient).toHaveBeenCalled();
      expect(mockLogUserActivity).toHaveBeenCalled();
    });
  });
  
  describe("logoutUser", () => {
    it("logoutUser", () => {

      const authenticator = new Authenticator({});
      const status = 'logoutUser';
      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: undefined,
      }
      const mockLogUserActivity = jest.fn();
      authenticator.logUserActivity = mockLogUserActivity;
      const mockSetAuthentication = jest.fn();
      client.setAuthentication = mockSetAuthentication;
      const mockSetUserObject = jest.fn();
      client.setUserObject = mockSetUserObject;
      const mockSendUserToClient = jest.fn();
      authenticator.sendUserToClient = mockSendUserToClient;
      
      authenticator.logoutUser(client, status)
      expect(mockLogUserActivity).toHaveBeenCalled();
      expect(mockSetAuthentication).toHaveBeenCalled();
      expect(mockSetUserObject).toHaveBeenCalled();
      expect(mockSendUserToClient).toHaveBeenCalled();    
    });
  });

  describe("sendUserToClient", () => {
    it("sendUserToClient", () => {

      const authenticator = new Authenticator({});
      client = {
        id: '0d1ad828-5a6f-45cb-ba3e-f3cbec980125',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: false,
        userObject: undefined,
      }
      const authStatus='success'
      const user = { username: 'mert', id: 'id', ip: '::ffff:127.0.0.1' }
      const token = '';

      const mockSend = jest.fn();
      client.send = mockSend;
      
      authenticator.sendUserToClient(client, user, authStatus, token)
      expect(mockSend).toHaveBeenCalled();    
    });
  });
  
  describe("checkStoredToken", () => {
    it("checkStoredToken with expired token", () => {

      const authenticator = new Authenticator({});
 
      const receivedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyT2JqZWN0Ijp7InVzZXJuYW1lIjoidXNlciIsImlkIjoiaWQiLCJpcCI6Ijo6ZmZmZjoxMjcuMC4wLjEifSwiaWF0IjoxNTg5ODEyMzIxLCJleHAiOjE1ODk4OTg3MjF9.tL6LyyzWLWnfdDx_Ncgh-xa0udga2phTWRP6UGL5feU';
      ServerConfig.TokenSecret = '3970B5079E5B3CB468355D16E4E8648EA1BEA982109B813F7B183F42E416E6C5',

      ip = '::ffff:127.0.0.1';
      mockIp =  { getIp: () => { return ip; } };
      client = mockIp

      authenticator.checkStoredToken(client, receivedToken)
      expect(authenticator.checkStoredToken()).toBe();
    });
    
    it("checkStoredToken with received token", () => {

      const authenticator = new Authenticator({});
 
      const receivedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyT2JqZWN0Ijp7InVzZXJuYW1lIjoidXNlciIsImlkIjoiaWQiLCJpcCI6Ijo6ZmZmZjoxMjcuMC4wLjEifSwiaWF0IjoxNTg5OTgwNDM0fQ.KgRc_djcmlc8aDozLNpUN4d3r6twiDoFxfqnI0kDhow'
      ServerConfig.TokenSecret = '3970B5079E5B3CB468355D16E4E8648EA1BEA982109B813F7B183F42E416E6C5',

      ip = '::ffff:127.0.0.1';
      mockIp =  { getIp: () => { return ip; } };
      client = mockIp

      const mockSetUserObject = jest.fn();
      client.setUserObject = mockSetUserObject;
      const mockSetAuthentication = jest.fn();
      client.setAuthentication = mockSetAuthentication;
      const mockSendUserToClient = jest.fn();
      authenticator.sendUserToClient = mockSendUserToClient;

      authenticator.checkStoredToken(client, receivedToken)
      expect(mockSetAuthentication).toHaveBeenCalled();    
    });
  });  

  describe("logUserActivity", () => {
    it("logUserActivity when activityType = 'login' ", () => {
      const authenticator = new Authenticator({ 
        sendMessageCallback: (h, o) => {
        handler = h;
        obj = o;
      }
    });
      const activityType = 'login';
      const userObject = { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      mockUserObject =  { getUserObject: () => { return userObject.username; } };
      client = mockUserObject
      const mockAppendData = jest.fn();
      authenticator.appendData = mockAppendData;

      authenticator.logUserActivity(client, activityType)
      expect(mockAppendData).toHaveBeenCalled();    
    });
   
    it("logUserActivity when activityType = 'interaction' with historyItem ", () => {
      const authenticator = new Authenticator({ 
        sendMessageCallback: (h, o) => {
        handler = h;
        obj = o;
      }
    });
      const activityType = 'interaction';
      
      history = {
        username: 'user',
        date: '2020-05-19T19:27:12.973Z',
        activityDate: '2020-05-19T19:27:12.973Z'
      }
      const mockFind = jest.fn(()=>{return history});
      authenticator.history.find = mockFind;
      const mockAppendData = jest.fn();
      authenticator.appendData = mockAppendData;

      authenticator.logUserActivity(client, activityType)
      expect(mockAppendData).toHaveBeenCalled();    
    });

    it("logUserActivity when activityType = 'interaction' without historyItem ", () => {
      const authenticator = new Authenticator({ 
        sendMessageCallback: (h, o) => {
        handler = h;
        obj = o;
      }
    });
      const activityType = 'interaction';
  
      const mockAppendData = jest.fn();
      authenticator.appendData = mockAppendData;

      authenticator.logUserActivity(client, activityType)
      expect(mockAppendData).toHaveBeenCalled();    
    });       
  });    
});

