const http = require('http');
const express = require('express');
const AuthServer = require('../../src/authServer.js');

const httpServerInstance = new AuthServer();

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
});
