const HttpServer = require('../../src/HttpServer');
jest.mock('../../src/Authenticator');
const Authenticator = require('../../src/Authenticator');


describe("HttpServer ", () => {

  it("Constructor", () => {
    const controllers = [];
    const httpServer = new HttpServer({ controllers });
    expect(httpServer.port).toBe(3000);
    expect(httpServer.controllers).toBe(controllers);
  });

  it("getApp", () => {
    const controllers = [];
    controllers.push(new Authenticator({}));
    const httpServer = new HttpServer({ controllers });
    expect(httpServer.getApp()).toBe(httpServer.app);
  });


  describe("init ", () => {
    xit('should invoke express once', () => {
      const httpServer = new HttpServer({});
      httpServer.init();
      console.log(httpServer.getApp());
      expect(httpServer.getApp()).toStrictEqual(tempApp);
    })
    /*let mockExpressUse = jest.fn();
    express.use = mockExpressUse;
    httpServer.init();
    expect(mockExpressUse).toHaveBeenCalled();*/
  });

  it('sendInitialMessage', () => {
    const expectedStringifiedObject = { testMember: 'test' };
    const controllers = [];
    const mockController = {
      appendData: (obj) => { obj.testMember = 'test'; }
    };
    controllers.push(mockController);
    const httpServer = new HttpServer({ controllers });

    let sendObject;
    const mockConnection = { send: (objStr) => { sendObject = objStr; } };
    mockClient = {
      connection: mockConnection

    };

    httpServer.sendInitialMessage(mockClient)
    expect(sendObject).toStrictEqual(JSON.stringify(expectedStringifiedObject));
  })

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