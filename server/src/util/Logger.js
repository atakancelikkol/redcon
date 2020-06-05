const winston = require('winston');
const callsites = require('callsites');
const ServerConfig = require('../ServerConfig');

const dateFormat = () => new Date(Date.now()).toUTCString();

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

  info() {
    let message = '';
    const route = this.getCallerModule();
    const lineNumberMessage = this.getCallerLineNumber();
    message = this.concatenateArguments(route, lineNumberMessage, arguments);
    this.logger.log('info', message);
  }

  error() {
    let message = '';
    const route = this.getCallerModule();
    const lineNumberMessage = this.getCallerLineNumber();
    message = this.concatenateArguments(route, lineNumberMessage, arguments);
    this.logger.log('error', message);
  }

  debug() {
    let message = '';
    const route = this.getCallerModule();
    const lineNumberMessage = this.getCallerLineNumber();
    message = this.concatenateArguments(route, lineNumberMessage, arguments);
    this.logger.log('debug', message);
  }

  concatenateArguments(route, lineNumberMessage, arg) {
    let message = `${route} | ${lineNumberMessage} | ${arg[0]} |`;
    for (let i = 1; i < arg.length; i += 1) {
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

  getCallerModule() {
    const callerFileName = callsites()[2].getFileName();
    const redundantCharacterNumberAtTheEnd = 3; // .js
    const redundantCharacterNumberAtTheMiddle = 5; // \src\
    const redundantCharacterNumberAtTheBeginning = process.cwd().length;

    return callerFileName.substring(redundantCharacterNumberAtTheBeginning + redundantCharacterNumberAtTheMiddle, callerFileName.length - redundantCharacterNumberAtTheEnd);
  }

  getCallerLineNumber() {
    const callerLineNumber = callsites()[2].getLineNumber();
    const lineNumberMessage = `at line ${callerLineNumber}`;
    return lineNumberMessage;
  }

  silenceLogger(condition) {
    this.logger.silent = condition;
  }
}

const logger = new Logger();
logger.createLogger();
Object.freeze(logger);

module.exports = logger;
