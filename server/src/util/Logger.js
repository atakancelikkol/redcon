const winston = require('winston');
const callsites = require('callsites');
const ServerConfig = require('../ServerConfig');

class Logger {
  constructor() {
    this.logger = undefined;
  }

  dateFormat() {
    return new Date(Date.now()).toLocaleString();
  }

  createLogger() {
    this.logger = winston.createLogger({

      transports: this.transportSettings(),
      /* [
        new winston.transports.Console({ level: ServerConfig.LoggerLevel }),
         new winston.transports.File({
          filename: './logs/Server.log',
          maxsize: ServerConfig.MaxLoggerFileSize, // max size
          level: ServerConfig.LoggerLevel,
        }),
      ], */

      format: winston.format.printf((info) => {
        const message = `${this.dateFormat()} | ${info.level.toUpperCase()} | ${info.message}`;
        return message;
      }),
      silent: false,

    });
  }

  transportSettings() {
    const transports = [];
    transports[0] = new winston.transports.Console({ level: ServerConfig.LoggerLevel });

    if (process.env.NODE_ENV !== 'test') {
      transports[1] = new winston.transports.File({
        filename: './logs/Server.log',
        maxsize: ServerConfig.MaxLoggerFileSize, // max size
        level: ServerConfig.LoggerLevel,
      });
    }
    return transports;
  }

  info(...args) {
    const message = this.constructTheMessage(args);
    this.logger.log('info', message);
  }

  error(...args) {
    const message = this.constructTheMessage(args);
    this.logger.log('error', message);
  }

  debug(...args) {
    const message = this.constructTheMessage(args);
    this.logger.log('debug', message);
  }

  constructTheMessage(args) {
    const callSiteObject = this.getCallSitesObject();
    const callerModule = this.getCallerModule(callSiteObject);
    const lineNumberMessage = this.getCallerLineNumber(callSiteObject);
    return this.concatenateArguments(callerModule, lineNumberMessage, args);
  }

  getCallSitesObject() {
    const callSites = callsites();
    return callSites[ServerConfig.LoggerCallerModuleDepth];
  }

  getCallerModule(callSiteObject) {
    if (callSiteObject !== undefined) {
      const callerFileName = callSiteObject.getFileName();
      return this.getCallerModuleString(callerFileName);
    }
    return 'Undefined Module';
  }

  getCallerModuleString(callerFileName) {
    const splittedFileNameArrayWin32 = callerFileName.split('\\');
    if (splittedFileNameArrayWin32.length > 1) {
      return splittedFileNameArrayWin32[splittedFileNameArrayWin32.length - 1];
    }
    const splittedFileNameArray = callerFileName.split('/');
    return splittedFileNameArray[splittedFileNameArray.length - 1];
  }

  getCallerLineNumber(callSiteObject) {
    if (callSiteObject !== undefined) {
      const callerLineNumber = callSiteObject.getLineNumber();
      const lineNumberMessage = `${callerLineNumber}`;
      return lineNumberMessage;
    }
    return '?';
  }

  concatenateArguments(callerModule, lineNumberMessage, arg) {
    let message = `${callerModule}:${lineNumberMessage} | `;
    for (let i = 0; i < arg.length; i += 1) {
      if (arg[i] == null) {
        message = `${message} ${arg[i]} |`;
      } else if (typeof arg[i] === 'function') {
        message = `${message} ${typeof arg[i]} |`;
      } else {
        let hasItToStringProperty;
        try {
          hasItToStringProperty = Object.prototype.hasOwnProperty.call(arg[i], 'toString'); // (arg[i]).hasOwnProperty('toString')
        } catch (error) {
          this.error(error);
        }
        if (hasItToStringProperty) {
          message = `${message} ${arg[i].toString()} |`;
        } else {
          message = `${message} ${JSON.stringify(arg[i])} |`;
        }
      }
    }
    return message;
  }

  silenceLogger(condition) {
    this.logger.silent = condition;
  }
}

const logger = new Logger();
logger.createLogger();

module.exports = logger;
