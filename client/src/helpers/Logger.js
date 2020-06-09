
class Logger {
  constructor() {
    this.level = 0; // default level is set to debug level
  }

  info(...args) {
    if (this.level <= 1) {
      console.info(...args); // eslint-disable-line
    }
  }

  error(...args) {
    if (this.level <= 2) {
      console.error(...args); // eslint-disable-line
    }
  }

  debug(...args) {
    if (this.level <= 0) {
      console.debug(...args); // eslint-disable-line
    }
  }

  setLevel(lvl) {
    switch (lvl) {
      case 'info':
        this.level = 1;
        break;
      case 'error':
        this.level = 2;
        break;
      case 'debug':
        this.level = 0;
        break;
      default:
        this.level = 0;
    }
  }
}

const logger = new Logger();
// Object.freeze(logger);

export default logger;
