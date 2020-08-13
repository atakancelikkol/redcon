const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('../../server/src/util/Logger.js');
const AuthServerConfig = require('./AuthServerConfig');
const LowDBDataStorage = require('./dataStorage/LowDBDataStorage.js');

class AuthServer {
  constructor(options) {
    this.port = AuthServerConfig.ServerPort;
    this.app = null;
    this.httpServer = null;
    this.token = undefined;
    this.dbStorage = new LowDBDataStorage();
  }

  init() {
    // logger.info('initializing HttpServer...');
    this.app = express();

    // start web server

    this.httpServer = http.createServer(this.app);

    // create http server

    this.app.use(bodyParser.json());

    this.app.post('/checkUserAuth', (req, res) => {
      this.token = undefined;
      this.onDataHandler(req, res);
    });
    this.httpServer.listen(this.port, () => logger.info(`AuthServer listening at http://localhost:${this.port}`));
  }

  onDataHandler(req, res) {
    const user = req.body;
    const { email } = user;
    const { password } = user;
    logger.info('email of the request == ', email);

    const foundUser = this.dbStorage.findUser(email);
    if (foundUser) {
      logger.info(`found email: ${foundUser.email}`);
      if (foundUser.password === password) {
        logger.info(`correct password for  ${foundUser.email}`);
        this.token = true;
      } else {
        logger.info('wrong password');
        this.token = false;
      }
    } else {
      logger.info('user not found');
      this.token = false;
    }

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
