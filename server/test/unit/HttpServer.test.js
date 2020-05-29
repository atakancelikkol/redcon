const HttpServer = require('../../src/HttpServer');
const http = require('http');

const httpServerInstance = new HttpServer({controllers: []});
afterAll(() => {httpServerInstance.httpServer.close();});

describe("HttpServer ", () => {

  describe("Constructor ", () => {
    it("constructs in production mode", () => {
      process.argv[2] = 'production';
      let httpServer = new HttpServer({controllers: []});
      expect(httpServer.port).toBe(80);
      process.argv = process.argv.slice(0, 2);
    });

    it("constructs and tests empty controller", () => {
      let controllers = [];
      let httpServer = new HttpServer({ controllers });
      expect(httpServer.port).toBe(3000);
      expect(httpServer.controllers).toBe(controllers);
    });
  });

  describe("init ", () => {
    it('should invoke express once', () => {
      const createServerSpy = jest.spyOn(http, 'createServer');
      httpServerInstance.init();
      expect(createServerSpy).toHaveBeenCalledWith(httpServerInstance.getApp());
    });
  });

  describe("getApp ", () => {
    it("gets app", () => {
      let httpServer = new HttpServer({controllers: []});
      httpServer.app = "myTestApp";
      expect(httpServer.getApp()).toBe("myTestApp");
    });
  });

  describe("onConnectionHandler ", () => {
    it("tests connection handling", () => {
      let httpServer = new HttpServer({controllers: []});
      let secondParameterMessageEvent;
      let secondParameterCloseEvent;
      let mockConnection = {
        on: (p1, p2) => {
          if (p1 === 'message') {
            secondParameterMessageEvent = p2;
          } else if (p1 === 'close') {
            secondParameterCloseEvent = p2;
          }
        }
      };
      const onSpy = jest.spyOn(mockConnection, 'on');
      let mockReq = { connection: { remoteAddress: 'mockRemoteAdress' } };
      httpServer.sendInitialMessage = jest.fn();
      httpServer.onConnectionHandler(mockConnection, mockReq);
      expect(typeof secondParameterMessageEvent).toBe('function');
      expect(typeof secondParameterCloseEvent).toBe('function');
      expect(onSpy).toHaveBeenCalledTimes(2);
      expect(httpServer.sendInitialMessage).toHaveBeenCalled();
    });
  });

  describe('onMessageHandler', () => {
    it('handles the message when isAuthReq:1 , isAuthed:1', () => {
      let mockObject = {
        mockMember: 'mockValue'
      };
      let handleMessageHasBeenCalled = false;
      const controller = {
        isAuthRequired: () => { return true; },
        handleMessage: () => { handleMessageHasBeenCalled = true; }
      };
      let controllers = [];
      controllers.push(controller);
      let mockClient = {
        isAuthenticated: () => { return true; }
      };
      const httpServer = new HttpServer({ controllers });
      httpServer.onMessageHandler(mockClient, JSON.stringify(mockObject));
      expect(handleMessageHasBeenCalled).toBe(true);
    });

    it('handles the message when isAuthReq:1 , isAuthed:0', () => {
      let mockObject = {
        mockMember: 'mockValue'
      };
      let handleMessageHasBeenCalled = false;
      const controller = {
        isAuthRequired: () => { return true; },
        handleMessage: () => { handleMessageHasBeenCalled = true; }
      };
      let controllers = [];
      controllers.push(controller);
      let mockClient = {
        isAuthenticated: () => { return false; }
      };
      const httpServer = new HttpServer({ controllers });
      httpServer.onMessageHandler(mockClient, JSON.stringify(mockObject));
      expect(handleMessageHasBeenCalled).toBe(false);
    });
  });

  describe("onCloseHandler", () => {
    it('handles on Close if index !== -1', () => {
      let httpServer = new HttpServer({controllers: []});
      const mockClient = {
        id: 'myConnectionClosingId',
        getId: () => { return mockClient.id; },
      }
      httpServer.clients.push(mockClient);
      httpServer.onCloseHandler(mockClient);
      expect(httpServer.clients.length).toBe(0);
    });

    it('handles on Close if index === -1', () => {
      let httpServer = new HttpServer({controllers: []});
      let mockClient = {
        id: 'myConnectionClosingId',
        getId: () => { return mockClient.id; },
      }
      const getIdSpy = jest.spyOn(mockClient, 'getId');
      httpServer.onCloseHandler(mockClient);
      expect(getIdSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("sendInitialMessage", () => {
    it('tests sending initial message', () => {
      const testObject = { testMember: 'test' };
      let controllers = [];
      let mockController = {
        appendData: (obj) => { obj.testMember = 'test'; }
      };
      controllers.push(mockController);
      let httpServer = new HttpServer({ controllers });
      let sendObject;
      let mockConnection = { send: (objStr) => { sendObject = objStr; } };
      mockClient = {
        connection: mockConnection
      };
      httpServer.sendInitialMessage(mockClient);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });
  });


  describe("sendToAllClients", () => {
    it('sends to all clients when isAuthReq:1 , isAuthed:1', () => {
      const testObject = {
        testMember: 'testString'
      };

      const mockController = {
        isAuthRequired: () => { return true; }
      };
      const httpServer = new HttpServer({controllers: []});
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const mockClient = {
        connection: mockConnection,
        isAuthenticated: () => { return true; },
        id: 'sendToAllClientsId',
        getId: () => { return mockClient.id; }
      };
      httpServer.clients.push(mockClient);
      const obj = {
        testMember: 'testString'
      };
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });

    it('sends to all clients when isAuthReq:1 , isAuthed:0', () => {
      const mockController = {
        isAuthRequired: () => { return true; }
      };
      const httpServer = new HttpServer({controllers: []});
      let sendObject;
      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      const mockClient = {
        connection: mockConnection,
        isAuthenticated: () => { return false; },
        id: 'sendToAllClientsId',
        getId: () => { return mockClient.id; }
      };
      httpServer.clients.push(mockClient);
      const obj = {
        testMember: 'testString'
      };
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(undefined);
    });
  });
});