const http = require('http');
const AuthServer = require('../../src/authServer.js');
const AuthServerConfig = require('../../src/AuthServerConfig');

const httpServerInstance = new AuthServer();

afterAll(() => { httpServerInstance.closeConnection(); });

describe('AuthServer ', () => {
  describe('Constructor ', () => {
    it('constructs', () => {
      const httpServer = new AuthServer();
      expect(httpServer.port).toBe(AuthServerConfig.ServerPort);
      expect(httpServer.app).toBe(null);
      expect(httpServer.httpServer).toBe(null);
    });
  });

  describe('init ', () => {
    it('should invoke express once', () => {
      const createServerSpy = jest.spyOn(http, 'createServer');
      httpServerInstance.init();
      expect(createServerSpy).toHaveBeenCalledWith(httpServerInstance.app);
      httpServerInstance.closeConnection();
    });
  });

  describe('onDataHandler', () => {
    it('body must be checked from mock database as false', () => {
      const httpServer = new AuthServer({ useMockUsers: true });
      const mockRes = {
        write(input) {
          return (input);
        },
        end() {
        },
      };
      const mockReq = {
        body: { email: 'test', password: 'invalidPass' },
      };
      //httpServer.onDataHandler(mockReq, mockRes);

      // expect(httpServer.token).toBe(false);
    });
  });
});
