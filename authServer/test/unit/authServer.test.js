const http = require('http');
const AuthServer = require('../../src/authServer.js');

const httpServerInstance = new AuthServer();

const mockRes = {
  write(input) {
    return (input);
  },
  end() {
  },
};

afterAll(() => { httpServerInstance.closeConnection(); });

describe('AuthServer ', () => {
  describe('Constructor ', () => {
    it('constructs', () => {
      const httpServer = new AuthServer();
      expect(httpServer.port).toBe(3010);
      expect(httpServer.app).toBe(null);
      expect(httpServer.httpServer).toBe(null);
      expect(httpServer.body).toBe('');
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
    it('chunk must be added to body', () => {
      const httpServer = new AuthServer();
      httpServer.body = 'test body';
      httpServer.onDataHandler('test chunk');
      expect(httpServer.body).toBe('test bodytest chunk');
    });
  });

  describe('onEndHandler', () => {
    it('body must be checked from mock database as true', () => {
      const httpServer = new AuthServer({ useMockUsers: true });
      httpServer.body = '{"email": "test","password": "test123"}';
      httpServer.onEndHandler(mockRes);
      expect(httpServer.token).toBe(true);
    });

    it('body must be checked from mock database as false', () => {
      const httpServer = new AuthServer({ useMockUsers: true });
      httpServer.body = '{"email": "test","password": "test"}';
      httpServer.onEndHandler(mockRes);
      expect(httpServer.token).toBe(false);
    });
  });
});
