class Logger {
  constructor() {
    this.currentLogLevel = ''; // default level is set to debug level
    this.LOG_LEVELS = { debug: 0, info: 1, error: 2 };
  }

  info(...args) {
    if (this.currentLogLevel <= this.LOG_LEVELS.info) {
      console.info(...args); // eslint-disable-line
    }
  }

  error(...args) {
    if (this.currentLogLevel <= this.LOG_LEVELS.error) {
      console.error(...args); // eslint-disable-line
    }
  }

  debug(...args) {
    if (this.currentLogLevel <= this.LOG_LEVELS.debug) {
      console.debug(...args); // eslint-disable-line
    }
  }

  setLevel(lvl) {
    switch (lvl) {
      case 'info':
        this.currentLogLevel = this.LOG_LEVELS.info;
        break;
      case 'error':
        this.currentLogLevel = this.LOG_LEVELS.error;
        break;
      case 'debug':
        this.currentLogLevel = this.LOG_LEVELS.debug;
        break;
      default:
        this.currentLogLevel = this.LOG_LEVELS.debug;
    }
  }
}

const logger = new Logger();
logger.setLevel(); // default level is set 
// Object.freeze(logger);

export default logger;
