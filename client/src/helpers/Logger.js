
class Logger {
  constructor() {
    this.level = undefined;
  }

  info(...args) {
    console.info(...args); // eslint-disable-line
  }

  error(...args) {
    console.error(...args); // eslint-disable-line
  }

  debug(...args) {
    console.debug(...args); // eslint-disable-line
  }
}

const logger = new Logger();
// Object.freeze(logger);

export default logger;
