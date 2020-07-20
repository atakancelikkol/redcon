const express = require('express');
const http = require('http');
const logger = require('../../server/src/util/Logger.js');

class AuthServer {
  constructor(options) {
    this.port = 3010;
    this.app = null;
    this.httpServer = null;
    this.body = '';
    this.token = undefined;
    if (options && options.useMockUsers) this.userArray = [{ email: 'test', password: 'test123' }];
    else this.userArray = require('./utils/users.json'); // eslint-disable-line
  }

  init() {
    // logger.info('initializing HttpServer...');
    this.app = express();

    // start web server

    this.httpServer = http.createServer(this.app);

    // create http server

    this.app.post('/', (req, res) => {
      req.on('data', this.onDataHandler.bind(this));
      req.on('end', this.onEndHandler.bind(this, res));
    });
    this.httpServer.listen(this.port, () => logger.info(`AuthServer listening at http://localhost:${this.port}`));
  }

  onDataHandler(chunk) {
    // get data from client
    logger.info('chunk received');
    this.body += chunk;
    this.token = undefined;
  }

  onEndHandler(res) {
    const user = JSON.parse(this.body);
    const { email } = user;
    const { password } = user;
    logger.info('email of the request == ', email);

    // search and match from json
    for (let i = 0; i < this.userArray.length; i += 1) {
      if (email === this.userArray[i].email) {
        logger.info(`found email: ${this.userArray[i].email}`);
        if (password === this.userArray[i].password) {
          logger.info(`correct password for  ${this.userArray[i].email}`);
          this.token = true;
        } else {
          logger.info('wrong password');
          this.token = false;
        }
      }
    }

    this.body = '';
    res.write(`{"isAuth":${this.token}}`);
    res.end();
    logger.info('authResult === ', this.token);
  }

  closeConnection() {
    this.httpServer.close();
  }

  onExit() {

  }
}

module.exports = AuthServer;
