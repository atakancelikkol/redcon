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
    // checkUserAuth
    this.app.post('/authServer', (req, res) => {
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
    const reqAction = req.body.action;
    logger.info('action of the request == ', reqAction);

    if (reqAction === 'authentication') {
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
    } else if (reqAction === 'register') {
      if((email === null || email ==='' || email === undefined) || (password === null || password ==='' || password === undefined)){
        logger.info('email or password is null, empty or undefined, please check');
      } else {
        logger.info('email of the reg request == ', email);
        logger.info('pass of the reg request == ', password);
        const isRegistered = this.dbStorage.registerNewUser(email, password);
        res.write(`{"isRegistered":${isRegistered}}`);
        res.end();
        logger.info('registerResult === ', isRegistered);
      }
    } else {
      logger.info('Unexpected Action!');
    }
  }

  closeConnection() {
    this.httpServer.close();
  }

  onExit() {

  }
}

module.exports = AuthServer;
