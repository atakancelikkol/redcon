const http = require('http');
const HttpServer = require('../../src/HttpServer');
const ServerConfig = require('../../src/ServerConfig');

const httpServerInstance = new HttpServer({ controllers: [] });
const useAuthenticationTemp = ServerConfig.useAuthentication;

afterAll(() => { httpServerInstance.httpServer.close(); ServerConfig.useAuthentication = useAuthenticationTemp; clearInterval(httpServerInstance.pingPongInterval); });

describe('HttpServer ', () => {
  describe('Constructor ', () => {
    it('constructs in production mode', () => {
      process.argv[2] = 'production';
      const httpServer = new HttpServer({ controllers: [] });
      expect(httpServer.port).toBe(80);
      process.argv = process.argv.slice(0, 2);
    });

    it('constructs and tests empty controller', () => {
      const controllers = [];
      const httpServer = new HttpServer({ controllers });
      expect(httpServer.port).toBe(3000);
      expect(httpServer.controllers).toBe(controllers);
    });
  });

  describe('init ', () => {
    it('should invoke express once', () => {
      const createServerSpy = jest.spyOn(http, 'createServer');
      httpServerInstance.init();
      expect(createServerSpy).toHaveBeenCalledWith(httpServerInstance.getApp());
    });
  });

  describe('inactiveClientChecker ', () => {
    it('normal connection', () => {
      const httpServer = new HttpServer({ controllers: [] });
      const mockClient = {
        getLastActivityTime: () => new Date(),
        connection: {
          terminate() {
          },
        },
      };
      const terminateSpy = jest.spyOn(mockClient.connection, 'terminate');
      httpServer.clients.push(mockClient);
      httpServer.inactiveClientChecker();
      expect(terminateSpy).not.toHaveBeenCalled();
    });

    it('lost connection, terminate client', () => {
      const httpServer = new HttpServer({ controllers: [] });
      const mockClient = {
        getLastActivityTime: () => new Date('2011-04-11T10:20:30Z'),
        connection: {
          terminate() {
          },
        },
      };
      const terminateSpy = jest.spyOn(mockClient.connection, 'terminate');
      httpServer.clients.push(mockClient);
      httpServer.inactiveClientChecker();
      expect(terminateSpy).toHaveBeenCalled();
    });

    it('if client has no lastActivity Record', () => {
      const httpServer = new HttpServer({ controllers: [] });
      const mockClient = {
        LastActivityTime: null,
        getLastActivityTime: () => undefined,
        setLastActivityTime(newTime) {
          mockClient.LastActivityTime = newTime;
        },
      };
      httpServer.clients.push(mockClient);
      httpServer.inactiveClientChecker();
      expect(mockClient.LastActivityTime).not.toBe(null);
    });

    it('if client already has lastActivity Record', () => {
      const httpServer = new HttpServer({ controllers: [] });
      const mockClient = {
        LastActivityTime: new Date('2011-04-11T10:20:30Z'),
        getLastActivityTime: () => new Date('2011-04-11T10:20:30Z'),
        setLastActivityTime(newTime) {
          mockClient.LastActivityTime = newTime;
        },
        connection: {
          terminate() {
          },
        },
      };

      const setLAstSpy = jest.spyOn(mockClient, 'setLastActivityTime');
      httpServer.clients.push(mockClient);
      httpServer.inactiveClientChecker();
      expect(setLAstSpy).not.toHaveBeenCalled();
    });
  });

  describe('ping function ', () => {
    it('should call inactiveClientChecker function', () => {
      const inactiveClientCheckerSpy = jest.spyOn(httpServerInstance, 'inactiveClientChecker');
      httpServerInstance.ping();
      expect(inactiveClientCheckerSpy).toHaveBeenCalled();
    });

    it('should call should send ping and set isAlive to false', () => {
      const inactiveClientCheckerSpy = jest.spyOn(httpServerInstance, 'inactiveClientChecker');
      const mockWebSocketServer = {
        clients: [
          {
            _socket: { // eslint-disable-line
              remoteAddress: 12,
            },
            ping() {
            },
          },
          {
            _socket: { // eslint-disable-line
              remoteAddress: 13,
            },
            ping() {
            },
          },
        ],
      };
      const mockClient = {
        LastActivityTime: new Date(),
        getLastActivityTime: () => mockClient.LastActivityTime,
        setLastActivityTime(newTime) {
          mockClient.LastActivityTime = newTime;
        },
        connection: {
          terminate() {
          },
        },
      };

      httpServerInstance.clients.push(mockClient);

      const pingSpy = jest.spyOn(mockWebSocketServer.clients[0], 'ping');
      const pingSpy2 = jest.spyOn(mockWebSocketServer.clients[1], 'ping');

      const tempWebSocketServer = httpServerInstance.webSocketServer;
      httpServerInstance.isAlive = true;
      httpServerInstance.webSocketServer = mockWebSocketServer;
      httpServerInstance.ping();
      expect(pingSpy).toHaveBeenCalled();
      expect(pingSpy2).toHaveBeenCalled();
      expect(inactiveClientCheckerSpy).toHaveBeenCalled();
      expect(httpServerInstance.isAlive).toBe(false);

      httpServerInstance.webSocketServer = tempWebSocketServer;
    });
  });

  describe('heartbeat function ', () => {
    it('should set to client a new lastActivityTime and should set isAlive as true', () => {
      const httpServer = new HttpServer({ controllers: [] });
      const mockClient = {
        LastActivityTime: new Date('2011-04-11T10:20:30Z'),
        getLastActivityTime: () => new Date('2011-04-11T10:20:30Z'),
        setLastActivityTime(newTime) {
          mockClient.LastActivityTime = newTime;
        },
        connection: {
          terminate() {
          },
        },
      };

      const setLAstSpy = jest.spyOn(mockClient, 'setLastActivityTime');
      httpServer.clients.push(mockClient);
      httpServer.isAlive = false;
      httpServer.heartbeat(mockClient);
      expect(setLAstSpy).toHaveBeenCalled();
      expect(mockClient.LastActivityTime).not.toStrictEqual(new Date('2011-04-11T10:20:30Z'));
      expect(httpServer.isAlive).toStrictEqual(true);
    });
  });

  describe('getClients ', () => {
    it('should get the clients array', () => {
      const httpServer = new HttpServer({ controllers: [] });
      httpServer.clients = [{ myClient: 'test' }];
      expect(httpServer.getClients()).toStrictEqual([{ myClient: 'test' }]);
    });
  });

  describe('getApp ', () => {
    it('gets app', () => {
      const httpServer = new HttpServer({ controllers: [] });
      httpServer.app = 'myTestApp';
      expect(httpServer.getApp()).toBe('myTestApp');
    });
  });

  describe('onConnectionHandler ', () => {
    it('tests connection handling', () => {
      const httpServer = new HttpServer({ controllers: [] });
      let secondParameterMessageEvent;
      let secondParameterCloseEvent;
      let secondParameterPongEvent;
      const mockConnection = {
        on: (p1, p2) => {
          if (p1 === 'message') {
            secondParameterMessageEvent = p2;
          } else if (p1 === 'close') {
            secondParameterCloseEvent = p2;
          } else if (p1 === 'pong') {
            secondParameterPongEvent = p2;
          }
        },
      };
      const onSpy = jest.spyOn(mockConnection, 'on');
      const mockReq = { connection: { remoteAddress: 'mockRemoteAdress' } };
      httpServer.sendInitialMessage = jest.fn();
      httpServer.onConnectionHandler(mockConnection, mockReq);
      expect(typeof secondParameterMessageEvent).toBe('function');
      expect(typeof secondParameterCloseEvent).toBe('function');
      expect(typeof secondParameterPongEvent).toBe('function');
      expect(onSpy).toHaveBeenCalledTimes(3);
      expect(httpServer.sendInitialMessage).toHaveBeenCalled();
    });
  });

  describe('onMessageHandler', () => {
    it('handles the message when useAuthentication: true, isAuthReq:1 , isAuthed:1', () => {
      const mockObject = { mockMember: 'mockValue' };
      let handleMessageHasBeenCalled = false;
      const controller = {
        isAuthRequired: () => true,
        handleMessage: () => { handleMessageHasBeenCalled = true; },
      };
      const controllers = [];
      controllers.push(controller);
      const mockClient = { isAuthenticated: () => true };
      const httpServer = new HttpServer({ controllers });
      ServerConfig.useAuthentication = true;
      httpServer.onMessageHandler(mockClient, JSON.stringify(mockObject));
      expect(handleMessageHasBeenCalled).toBe(true);
    });

    it('handles the message when useAuthentication: false, isAuthReq:1 , isAuthed:1', () => {
      const mockObject = { mockMember: 'mockValue' };
      let handleMessageHasBeenCalled = false;
      const controller = {
        isAuthRequired: () => true,
        handleMessage: () => { handleMessageHasBeenCalled = true; },
      };
      const controllers = [];
      controllers.push(controller);
      const mockClient = { isAuthenticated: () => true };
      const httpServer = new HttpServer({ controllers });
      ServerConfig.useAuthentication = false;
      httpServer.onMessageHandler(mockClient, JSON.stringify(mockObject));
      expect(handleMessageHasBeenCalled).toBe(true);
    });

    it('handles the message when useAuthentication: true, isAuthReq:1 , isAuthed:0', () => {
      const mockObject = { mockMember: 'mockValue' };
      let handleMessageHasBeenCalled = false;
      const controller = {
        isAuthRequired: () => true,
        handleMessage: () => { handleMessageHasBeenCalled = true; },
      };
      const controllers = [];
      controllers.push(controller);
      const mockClient = { isAuthenticated: () => false };
      const httpServer = new HttpServer({ controllers });
      ServerConfig.useAuthentication = true;
      httpServer.onMessageHandler(mockClient, JSON.stringify(mockObject));
      expect(handleMessageHasBeenCalled).toBe(false);
    });

    it('handles the message when useAuthentication: false, isAuthReq:1 , isAuthed:0', () => {
      const mockObject = { mockMember: 'mockValue' };
      let handleMessageHasBeenCalled = false;
      const controller = {
        isAuthRequired: () => true,
        handleMessage: () => { handleMessageHasBeenCalled = true; },
      };
      const controllers = [];
      controllers.push(controller);
      const mockClient = { isAuthenticated: () => false };
      const httpServer = new HttpServer({ controllers });
      ServerConfig.useAuthentication = false;
      httpServer.onMessageHandler(mockClient, JSON.stringify(mockObject));
      expect(handleMessageHasBeenCalled).toBe(true);
    });
  });

  describe('onCloseHandler', () => {
    it('handles on Close if index !== -1', () => { // eslint-disable-line
      const controllers = [{ onConnectionClosed: () => { } }];
      const httpServer = new HttpServer({ controllers });
      const mockClient = {
        id: 'myConnectionClosingId',
        mockSpec: false,
        getId: () => mockClient.id,
        setAuthentication(param) {
          mockClient.mockSpec = param;
        },
        setUserObject(param) {
          mockClient.mockSpec = param;
        },
        send(param) {
          mockClient.mockSpec = param;
        },
        setLastActivityTime(param) {
          mockClient.mockSpec = param;
        },
        getUserObject() {
        },
      };
      httpServer.clients.push(mockClient);
      httpServer.onCloseHandler(mockClient);
      expect(httpServer.clients.length).toBe(0);
    });

    it('handles on Close if index === -1', () => { // eslint-disable-line
      const httpServer = new HttpServer({ controllers: [] });
      const mockClient = {
        id: 'myConnectionClosingId',
        getId: () => mockClient.id,
      };
      const getIdSpy = jest.spyOn(mockClient, 'getId');
      httpServer.onCloseHandler(mockClient);
      expect(getIdSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendInitialMessage', () => {
    it('tests sending initial message', () => {
      const testObject = { testMember: 'test' };
      const controllers = [];
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const mockController = { appendData: (obj) => { obj.testMember = 'test'; }, isAuthRequired: () => true }; // eslint-disable-line      
      const mockClient = {
        connection: mockConnection,
        isAuthenticated: () => true,
        id: 'sendInitialMessageId',
        getId: () => mockClient.id,
      };
      controllers.push(mockController);
      const httpServer = new HttpServer({ controllers });
      httpServer.sendInitialMessage(mockClient);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });
  });

  describe('sendToAllClients', () => {
    it('sends to all clients when useAuthentication: false, trueisAuthReq:1 , isAuthed:1', () => {
      const testObject = { testMember: 'testString' };

      const mockController = { isAuthRequired: () => true };
      const httpServer = new HttpServer({ controllers: [] });
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const mockClient = {
        connection: mockConnection,
        isAuthenticated: () => true,
        id: 'sendToAllClientsId',
        getId: () => mockClient.id,
      };
      httpServer.clients.push(mockClient);
      const obj = { testMember: 'testString' };
      ServerConfig.useAuthentication = false;
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });

    it('sends to all clients when useAuthentication: true, isAuthReq:1 , isAuthed:1', () => {
      const testObject = { testMember: 'testString' };

      const mockController = { isAuthRequired: () => true };
      const httpServer = new HttpServer({ controllers: [] });
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const mockClient = {
        connection: mockConnection,
        isAuthenticated: () => true,
        id: 'sendToAllClientsId',
        getId: () => mockClient.id,
      };
      httpServer.clients.push(mockClient);
      const obj = { testMember: 'testString' };
      ServerConfig.useAuthentication = true;
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });

    it('sends to all clients when useAuthentication:false isAuthReq:1 , isAuthed:0', () => {
      const mockController = { isAuthRequired: () => true };
      const httpServer = new HttpServer({ controllers: [] });
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const mockClient = {
        connection: mockConnection,
        isAuthenticated: () => false,
        id: 'sendToAllClientsId',
        getId: () => mockClient.id,
      };
      httpServer.clients.push(mockClient);
      const obj = { testMember: 'testString' };
      ServerConfig.useAuthentication = false;
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual('{"testMember":"testString"}');
    });

    it('sends to all clients when useAuthentication:true isAuthReq:1 , isAuthed:0', () => {
      const mockController = { isAuthRequired: () => true };
      const httpServer = new HttpServer({ controllers: [] });
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const mockClient = {
        connection: mockConnection,
        isAuthenticated: () => false,
        id: 'sendToAllClientsId',
        getId: () => mockClient.id,
      };
      httpServer.clients.push(mockClient);
      const obj = { testMember: 'testString' };
      ServerConfig.useAuthentication = true;
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(undefined);
    });
  });
});
