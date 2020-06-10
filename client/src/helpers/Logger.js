class Logger {
  constructor() {
    this.currentLogLevel = 0; // default level is set to debug level
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

  setLevel(level) {
    if (Object.prototype.hasOwnProperty.call(this.LOG_LEVELS, level)) {
      this.currentLogLevel = this.LOG_LEVELS[level];
    }
  }
}

const logger = new Logger();
// Object.freeze(logger);

export default logger;
