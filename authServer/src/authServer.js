const express = require('express');
const http = require('http');
const logger = require('./utils/Logger.js');

class AuthServer {
  constructor(options) {
    this.port = 3010;
    this.app = null;
    this.httpServer = null;
    this.body = '';
    this.token = undefined;
    if (options && options.useMockUsers) this.jsonarray = [{ email: 'test', password: 'test123' }];
    else this.jsonarray = require('./utils/users.json'); // eslint-disable-line
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
    logger.info('chunk == ', chunk);
    this.body += chunk;
    logger.info('body of the request == ', this.body);
    this.token = undefined;
  }

  onEndHandler(res) {
    logger.info('body of the request == ', this.body);
    const user = JSON.parse(this.body);
    const { email } = user;
    const { password } = user;

    // search and match from json
    for (let i = 0; i < this.jsonarray.length; i += 1) {
      if (email === this.jsonarray[i].email) {
        logger.info(`found email: ${this.jsonarray[i].email}`);
        if (password === this.jsonarray[i].password) {
          logger.info(`correct password: ${this.jsonarray[i].password}`);
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
