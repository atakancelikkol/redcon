const HttpServer = require('../../src/HttpServer');
jest.mock('../../src/Authenticator');
const Authenticator = require('../../src/Authenticator');


describe("HttpServer ", () => {

  it("Constructor", () => {
    let controllers = [];
    let httpServer = new HttpServer({ controllers });
    expect(httpServer.port).toBe(3000);
    expect(httpServer.controllers).toBe(controllers);
  });

  it("getApp", () => {
    let controllers = [];
    controllers.push(new Authenticator({}));
    let httpServer = new HttpServer({ controllers });
    expect(httpServer.getApp()).toBe(httpServer.app);
  });


  describe("init ", () => {
    xit('should invoke express once', () => {
      let httpServer = new HttpServer({});
      httpServer.init();
      console.log(httpServer.getApp());
      expect(httpServer.getApp()).toStrictEqual(tempApp);
    })
    /*let mockExpressUse = jest.fn();
    express.use = mockExpressUse;
    httpServer.init();
    expect(mockExpressUse).toHaveBeenCalled();*/
  });
  describe("onCloseHandler", () => {
    it('onCloseHandler if index !== -1', () => {
      let httpServer = new HttpServer({});
      const mockClient = {
        id: 'myConnectionClosingId',
        getId: () => { return mockClient.id; },
      }
      httpServer.clients.push(mockClient);
      httpServer.onCloseHandler(mockClient);
      expect(httpServer.clients.length).toBe(0);
    })

    it('onCloseHandler if index === -1', () => {
      let httpServer = new HttpServer({});
      let mockClient = {
        id: 'myConnectionClosingId',
        getId: () => { return mockClient.id; },
      }
      let log = console.log;
      console.log = jest.fn();
      httpServer.onCloseHandler(mockClient);
      expect(console.log).toHaveBeenCalledWith('Error on closing connection! id: ', mockClient.getId());
      console.log = log;
    })
  });

  it('sendInitialMessage', () => {
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
  })

  describe("sendToAllClients", () => {

    it('sendToAllClients isAuthReq:0 , isAuthed:0', () => {
      const testObject = {
        testMember : 'testString'
      };

      const mockController = {
        isAuthRequired: () => { return false; }
      };
      const httpServer = new HttpServer({});
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
        testMember : 'testString'
      };
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });

    it('sendToAllClients isAuthReq:0 , isAuthed:1', () => {
      const testObject = {
        testMember : 'testString'
      };

      const mockController = {
        isAuthRequired: () => { return false; }
      };
      const httpServer = new HttpServer({});
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
        testMember : 'testString'
      };
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });

    it('sendToAllClients isAuthReq:1 , isAuthed:1', () => {
      const testObject = {
        testMember : 'testString'
      };

      const mockController = {
        isAuthRequired: () => { return true; }
      };
      const httpServer = new HttpServer({});
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
        testMember : 'testString'
      };
      httpServer.sendToAllClients(mockController, obj);
      expect(sendObject).toStrictEqual(JSON.stringify(testObject));
    });

    it('sendToAllClients isAuthReq:1 , isAuthed:0', () => {

      const mockController = {
        isAuthRequired: () => { return true; }
      };
      const httpServer = new HttpServer({});
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
        testMember : 'testString'
      };
      let log = console.log;
      console.log = jest.fn();
      httpServer.sendToAllClients(mockController, obj);
      expect(console.log).toHaveBeenCalledWith(`Authentication is required for this controller feature and ${mockClient.getId()} is not Authenticated`);
      console.log = log;
    });

  });



});

/*      appendData(obj) {
          obj.authHistory = this.getCopyState(); // eslint-disable-line
        }

        getCopyState() {
          return {
            history: [...this.history],
          };
        }


        const client = {
        id: '9e02e9c9-0233-41dc-82a1-f48ec031ac16',
        ip: '::ffff:127.0.0.1',
        connection: { WebSocket: {} },
        authenticated: true,
        userObject: { username: 'user', id: 'id', ip: '::ffff:127.0.0.1' }
      };

      const mockConnection = { send: (objStr) => { sendObject = objStr; } };
      console.log(mockConnection);
      let clientConnection = new ClientConnection({ connection: mockConnection });
      let sendObject;
      const obj = {
        authHistory: { history: [] },
        gpio: { state: { '3': 1, '5': 1 }, startTime: 0, endTime: 0, history: [] },
        usb: {
          isAvailable: false,
          kvmLedStateECU: 0,
          kvmLedStateRPI: 0,
          mountedPath: '',
          usbName: '',
          device: '',
          currentDirectory: '.',
          currentItems: [],
          currentItemInfo: {},
          usbErrorString: ''
        },
        serial: { ports: {}, portStatus: {}, serialFiles: {} }
      };
      const controllers = [];
      controllers.push(new Authenticator({  }));
      const httpServer = new HttpServer({ controllers });


      */