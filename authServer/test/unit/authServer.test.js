const http = require('http');
const crypto = require('crypto');
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

    it('should initialize LowDB', () => {
      const LDBspy = jest.spyOn(httpServerInstance.dbStorage, 'init');
      httpServerInstance.init();
      expect(LDBspy).toHaveBeenCalled();
      httpServerInstance.closeConnection();
    });
  });

  describe('authenticator ', () => {
    it('should return false with user not found', () => {
      httpServerInstance.init();

      httpServerInstance.dbStorage.findUser = jest.fn();
      httpServerInstance.dbStorage.findUser.mockReturnValueOnce(false);

      const mockReq = {
        body: {
          email: 'test',
          password: 'test',
        },
      };

      const mockRes = {
        write() {

        },
        end() {

        },
      };

      httpServerInstance.authenticator(mockReq, mockRes);
      expect(httpServerInstance.token).toBe(false);
      httpServerInstance.closeConnection();
    });

    it('should return true', () => {
      const mockReq = {
        body: {
          email: 'test',
          password: 'test',
        },
      };

      const hash = crypto.createHash('sha256');
      hash.update(mockReq.body.password);
      const hashedPass = hash.digest('hex');

      const mockFoundUser = {
        email: 'test',
        password: hashedPass,
      };

      const mockRes = {
        write() {

        },
        end() {

        },
      };

      httpServerInstance.init();

      httpServerInstance.dbStorage.findUser = jest.fn();
      httpServerInstance.dbStorage.findUser.mockReturnValueOnce(mockFoundUser);

      httpServerInstance.authenticator(mockReq, mockRes);
      expect(httpServerInstance.token).toBe(true);
      httpServerInstance.closeConnection();
    });

    it('should return false with wrong password', () => {
      const mockReq = {
        body: {
          email: 'test',
          password: 'test',
        },
      };

      const hash = crypto.createHash('sha256');
      hash.update('test2');
      const hashedPass = hash.digest('hex');

      const mockFoundUser = {
        email: 'test',
        password: hashedPass,
      };

      const mockRes = {
        write() {

        },
        end() {

        },
      };

      httpServerInstance.init();

      httpServerInstance.dbStorage.findUser = jest.fn();
      httpServerInstance.dbStorage.findUser.mockReturnValueOnce(mockFoundUser);

      httpServerInstance.authenticator(mockReq, mockRes);
      expect(httpServerInstance.token).toBe(false);
      httpServerInstance.closeConnection();
    });
  });

  describe('register ', () => {
    it('should return undefined', () => {
      const mockReq = {
        body: {
          email: '',
          password: 'test',
        },
      };

      const mockRes = {
        write() {

        },
        end() {

        },
      };

      httpServerInstance.init();

      httpServerInstance.register(mockReq, mockRes);
      expect(httpServerInstance.isRegistered).toBe(undefined);
      httpServerInstance.closeConnection();
    });

    it('should return false, user already exist', () => {
      const mockReq = {
        body: {
          email: 'test',
          password: 'test',
        },
      };

      const mockRes = {
        write() {

        },
        end() {

        },
      };

      httpServerInstance.init();

      httpServerInstance.dbStorage.registerNewUser = jest.fn();
      httpServerInstance.dbStorage.registerNewUser.mockReturnValueOnce(false);

      httpServerInstance.register(mockReq, mockRes);
      expect(httpServerInstance.isRegistered).toBe(false);
      httpServerInstance.closeConnection();
    });

    it('should return true for successful register', () => {
      const mockReq = {
        body: {
          email: 'test',
          password: 'test',
        },
      };

      const mockRes = {
        write() {

        },
        end() {

        },
      };

      httpServerInstance.init();

      httpServerInstance.dbStorage.registerNewUser = jest.fn();
      httpServerInstance.dbStorage.registerNewUser.mockReturnValueOnce(true);

      httpServerInstance.register(mockReq, mockRes);
      expect(httpServerInstance.isRegistered).toBe(true);
      httpServerInstance.closeConnection();
    });
  });
});
