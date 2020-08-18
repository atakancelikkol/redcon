const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const crypto = require('crypto');
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
    this.app.post('/authenticate', (req, res) => {
      this.token = undefined;
      this.Authenticator(req, res);
    });
    this.app.post('/register', (req, res) => {
      this.Register(req, res);
    });

    this.httpServer.listen(this.port, () => logger.info(`AuthServer listening at http://localhost:${this.port}`));
  }

  Authenticator(req, res) {
    const user = req.body;
    const { email } = user;
    const { password } = user;
    const isAuthObj = {
      isAuth: '',
    };
    logger.info('email of the request == ', email);
    const reqAction = req.body.action;
    logger.info('action of the request == ', reqAction);

    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPass = hash.digest('hex');
    logger.info('hascoded == ', hashedPass);

    const foundUser = this.dbStorage.findUser(email);
    if (foundUser) {
      logger.info(`found email: ${foundUser.email}`);
      if (foundUser.password === hashedPass) {
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

    isAuthObj.isAuth = this.token;

    res.write(JSON.stringify(isAuthObj));
    res.end();
    logger.info('authResult === ', this.token);
  }

  Register(req, res) {
    const user = req.body;
    const { email } = user;
    const { password } = user;
    const isRegisteredObj = {
      isRegistered: '',
    };
    logger.info('email of the request == ', email);
    const reqAction = req.body.action;
    logger.info('action of the request == ', reqAction);

    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPass = hash.digest('hex');
    logger.info('hascoded == ', hashedPass);

    if ((email === null || email === '' || email === undefined) || (password === null || password === '' || password === undefined)) {
      logger.info('email or password is null, empty or undefined, please check');
    } else {
      logger.info('email of the reg request == ', email);
      logger.info('pass of the reg request == ', password);

      const isRegistered = this.dbStorage.registerNewUser(email, hashedPass);

      isRegisteredObj.isRegistered = isRegistered;

      res.write(JSON.stringify(isRegisteredObj));
      res.end();
      logger.info('registerResult === ', isRegistered);
    }
  }

  closeConnection() {
    this.httpServer.close();
  }

  onExit() {

  }
}
module.exports = AuthServer;
