const winston = require('winston');
const loggerInstance = require('../../../src/util/Logger');

describe('Logger', () => {
  it('tests silencing logger ', () => {
    loggerInstance.silenceLogger(true);
    expect(loggerInstance.logger.silent).toBe(true);
  });

  describe('dateFormat', () => {
    it('tests whether date fnc of YEAR returns correct value ', () => {
      const dateString = loggerInstance.dateFormat();
      const splittedStringByComma = dateString.split(',');
      const splittedStringBySlash = splittedStringByComma[0].split('/');
      const yearString = splittedStringBySlash[2];
      expect(Number(yearString)).toBeGreaterThanOrEqual(2020);
    });
  });

  describe('createLogger', () => {
    it('tests whether the createLogger method winston package does work or not ', () => {
      const createLoggerSpy = jest.spyOn(winston, 'createLogger');
      loggerInstance.createLogger();
      expect(createLoggerSpy).toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('tests info method of the class ', () => {
      const tempconstructTheMessage = loggerInstance.constructTheMessage;
      loggerInstance.constructTheMessage = jest.fn();
      const templog = loggerInstance.logger.log;
      loggerInstance.logger.log = jest.fn();
      loggerInstance.info();
      expect(loggerInstance.constructTheMessage).toHaveBeenCalled();
      expect(loggerInstance.logger.log.mock.calls[0][0]).toBe('info');
      loggerInstance.constructTheMessage = tempconstructTheMessage;
      loggerInstance.logger.log = templog;
    });
  });

  describe('error', () => {
    it('tests error method of the class ', () => {
      const tempconstructTheMessage = loggerInstance.constructTheMessage;
      loggerInstance.constructTheMessage = jest.fn();
      const templog = loggerInstance.logger.log;
      loggerInstance.logger.log = jest.fn();
      loggerInstance.error();
      expect(loggerInstance.constructTheMessage).toHaveBeenCalled();
      expect(loggerInstance.logger.log.mock.calls[0][0]).toBe('error');
      loggerInstance.constructTheMessage = tempconstructTheMessage;
      loggerInstance.logger.log = templog;
    });
  });

  describe('debug', () => {
    it('tests debug method of the class ', () => {
      const tempconstructTheMessage = loggerInstance.constructTheMessage;
      loggerInstance.constructTheMessage = jest.fn();
      const templog = loggerInstance.logger.log;
      loggerInstance.logger.log = jest.fn();
      loggerInstance.debug();
      expect(loggerInstance.constructTheMessage).toHaveBeenCalled();
      expect(loggerInstance.logger.log.mock.calls[0][0]).toBe('debug');
      loggerInstance.constructTheMessage = tempconstructTheMessage;
      loggerInstance.logger.log = templog;
    });
  });

  describe('constructTheMessage', () => {
    it('tests constructing the message ', () => {
      const tempgetCallSitesObject = loggerInstance.getCallSitesObject;
      const tempgetCallerModule = loggerInstance.getCallerModule;
      const tempgetCallerLineNumber = loggerInstance.getCallerLineNumber;
      const tempconcatenateArguments = loggerInstance.concatenateArguments;
      loggerInstance.getCallSitesObject = jest.fn(() => 'callSiteObject');
      loggerInstance.getCallerModule = jest.fn(() => 'callerModule');
      loggerInstance.getCallerLineNumber = jest.fn(() => 'callerLinueNumber');
      loggerInstance.concatenateArguments = jest.fn();
      loggerInstance.constructTheMessage('arguments');

      expect(loggerInstance.getCallSitesObject).toHaveReturnedWith('callSiteObject');
      expect(loggerInstance.getCallerModule).toHaveBeenCalledWith('callSiteObject');
      expect(loggerInstance.getCallerLineNumber).toHaveBeenCalledWith('callSiteObject');
      expect(loggerInstance.concatenateArguments).toHaveBeenCalledWith('callerModule', 'callerLinueNumber', 'arguments');
      loggerInstance.getCallSitesObject = tempgetCallSitesObject;
      loggerInstance.getCallerModule = tempgetCallerModule;
      loggerInstance.getCallerLineNumber = tempgetCallerLineNumber;
      loggerInstance.concatenateArguments = tempconcatenateArguments;
    });
  });

  describe('getCallSitesObject', () => {
    it('tests getting callsites object properly ', () => {
      const callSites = loggerInstance.getCallSitesObject();
      expect(callSites).not.toBe(undefined);
    });
  });

  describe('getCallerModule', () => {
    it('tests getting caller module properly ', () => {
      const mockCallSiteObject = { getFileName: () => 'mockCallerFileName' };
      const tempgetCallerModuleString = loggerInstance.getCallerModuleString;
      loggerInstance.getCallerModuleString = jest.fn();
      loggerInstance.getCallerModule(mockCallSiteObject);
      expect(loggerInstance.getCallerModuleString).toHaveBeenCalledWith('mockCallerFileName');
      loggerInstance.getCallerModuleString = tempgetCallerModuleString;
    });

    it('tests getting caller module wrongly ', () => {
      const mockCallSiteObject = undefined;
      const returnValueCallerModule = loggerInstance.getCallerModule(mockCallSiteObject);
      expect(returnValueCallerModule).toBe('Undefined Module');
    });
  });

  describe('getCallerModuleString', () => {
    it('tests getting caller module string properly first if case (Windows)', () => {
      const mockCallerFileName = 'C:\\workspace\\redcon\\server\\src\\MockModule.js';
      const returnValueOfCallerModuleStr = loggerInstance.getCallerModuleString(mockCallerFileName);
      expect(returnValueOfCallerModuleStr).toBe('MockModule.js');
    });

    it('tests getting caller module string properly other case ( / splitted file path)', () => {
      const mockCallerFileName = 'C:/workspace/redcon/server/src/MockModule2.js';
      const returnValueOfCallerModuleStr = loggerInstance.getCallerModuleString(mockCallerFileName);
      expect(returnValueOfCallerModuleStr).toBe('MockModule2.js');
    });
  });

  describe('getCallerLineNumber', () => {
    it('tests getting caller line number properly', () => {
      const mockLineNumber = 333;
      const mockCallSiteObject = { getLineNumber: () => mockLineNumber };
      const returnValueOfCallerLineNumber = loggerInstance.getCallerLineNumber(mockCallSiteObject);
      expect(returnValueOfCallerLineNumber).toBe(`${mockLineNumber}`);
    });

    it('tests getting caller line number wrongly', () => {
      const mockCallSiteObject = undefined;
      const returnValueOfCallerLineNumber = loggerInstance.getCallerLineNumber(mockCallSiteObject);
      expect(returnValueOfCallerLineNumber).toBe('?');
    });
  });

  describe('concatenateArguments', () => {
    it('tests combining logger arguments ', () => {
      const callerModule = 'callerModule.js';
      const callerLineNumber = 'callerLineNumber';
      const arg = ['argument1', 'argument2'];
      const returnedCominedMessage = loggerInstance.concatenateArguments(callerModule, callerLineNumber, arg);
      expect(returnedCominedMessage).toBe(`callerModule.js:callerLineNumber |  ${JSON.stringify(arg[0])} | ${JSON.stringify(arg[1])} |`);
    });

    it('tests combining logger arguments if arg is a function', () => {
      const callerModule = 'callerModule.js';
      const callerLineNumber = 'callerLineNumber';
      const arg = ['argument1', loggerInstance.debug];
      const returnedCominedMessage = loggerInstance.concatenateArguments(callerModule, callerLineNumber, arg);
      expect(returnedCominedMessage).toBe(`callerModule.js:callerLineNumber |  ${JSON.stringify(arg[0])} | ${typeof arg[1]} |`);
    });

    it('tests combining logger arguments if arg is a null', () => {
      const callerModule = 'callerModule.js';
      const callerLineNumber = 'callerLineNumber';
      const arg = ['argument1', null];
      const returnedCominedMessage = loggerInstance.concatenateArguments(callerModule, callerLineNumber, arg);
      expect(returnedCominedMessage).toBe(`callerModule.js:callerLineNumber |  ${JSON.stringify(arg[0])} | ${arg[1]} |`);
    });

    it('tests combining logger arguments if arg has its own toString Property', () => {
      const callerModule = 'callerModule.js';
      const callerLineNumber = 'callerLineNumber';
      const obj = { toString: () => 'Object is Converted to String' };
      const arg = ['argument1', obj];
      const returnedCominedMessage = loggerInstance.concatenateArguments(callerModule, callerLineNumber, arg);
      expect(returnedCominedMessage).toBe(`callerModule.js:callerLineNumber |  ${JSON.stringify(arg[0])} | Object is Converted to String |`);
    });
  });
});
