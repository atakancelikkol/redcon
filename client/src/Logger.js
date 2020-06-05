/* const dateFormat = () => {
  const date = new Date(Date.now()).toUTCString();
  return date.substring(5, date.length);
}; */

class Logger {
  constructor() {
    this.logger = undefined;
  }

  info(...args) {
    const message = this.constructTheMessage(args);
    console.info(message); // eslint-disable-line
  }

  error(...args) {
    const message = this.constructTheMessage(args);
    console.error(message); // eslint-disable-line
  }

  debug(...args) {
    const message = this.constructTheMessage(args);
    console.debug(message); // eslint-disable-line
  }

  constructTheMessage(args) {
    return this.concatenateArguments(args);
  }

  concatenateArguments(arg) {
    let message = '';
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
}

const logger = new Logger();
// Object.freeze(logger);

export default logger;
