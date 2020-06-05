const winston = require('winston');
const callsites = require('callsites');
const ServerConfig = require('../ServerConfig');

const dateFormat = () => {
  const date = new Date(Date.now()).toUTCString();
  return date.substring(5, date.length);
};

class Logger {
  constructor() {
    this.logger = undefined;
  }

  createLogger() {
    this.logger = winston.createLogger({

      transports: [
        new winston.transports.Console({ level: ServerConfig.LoggerLevel }),
        new winston.transports.File({
          filename: './logs/Server.log',
          maxsize: ServerConfig.MaxLoggerFileSize, // max size
          level: ServerConfig.LoggerLevel,
        }),
      ],

      format: winston.format.printf((info) => {
        const message = `${dateFormat()} | ${info.level.toUpperCase()} | ${info.message}`;
        return message;
      }),
      silent: false,

    });
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

  concatenateArguments(callerModule, lineNumberMessage, arg) {
    let message = `${callerModule}:${lineNumberMessage} | `;
    for (let i = 0; i < arg.length; i += 1) {
      if (arg[i] === null) {
        message = `${message} ${arg[i]} |`;
      } else if (Object.prototype.hasOwnProperty.call(arg[i], toString)) { // arg[i].hasOwnProperty('toString')
        message = `${message} ${arg[i]} |`;
      } else {
        message = `${message} ${JSON.stringify(arg[i])} |`;
      }
    }
    return message;
  }

  getCallerModule(callSiteObject) {
    const callerFileName = callSiteObject.getFileName();
    return this.getCallerModuleString(callerFileName);
  }

  getCallerLineNumber(callSiteObject) {
    const callerLineNumber = callSiteObject.getLineNumber();
    const lineNumberMessage = `${callerLineNumber}`;
    return lineNumberMessage;
  }

  getCallSitesObject() {
    const callSites = callsites();
    if (callSites[ServerConfig.LoggerCallerModuleDepth] !== undefined) {
      return callSites[ServerConfig.LoggerCallerModuleDepth];
    }
    return callSites[0];
  }

  getCallerModuleString(callerFileName) {
    const splittedFileNameArrayWin32 = callerFileName.split('\\');
    if (splittedFileNameArrayWin32.length > 1) {
      return splittedFileNameArrayWin32[splittedFileNameArrayWin32.length - 1];
    }
    const splittedFileNameArray = callerFileName.split('/');
    return splittedFileNameArray[splittedFileNameArray.length - 1];
  }

  silenceLogger(condition) {
    this.logger.silent = condition;
  }
}

const logger = new Logger();
logger.createLogger();
// Object.freeze(logger);

module.exports = logger;
