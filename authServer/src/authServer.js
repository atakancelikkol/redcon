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
    this.dbStorage.init();
    // checkUserAuth
    this.app.post('/authenticate', (req, res) => {
      this.token = undefined;
      this.authenticator(req, res);
    });
    this.app.post('/register', (req, res) => {
      this.register(req, res);
    });

    this.httpServer.listen(this.port, () => logger.info(`AuthServer listening at http://localhost:${this.port}`));
  }

  authenticator(req, res) {
    const user = req.body;
    const { email } = user;
    const { password } = user;
    const isAuthObj = {
      isAuth: '',
    };

    const foundUser = this.dbStorage.findUser(email);
    if (foundUser) {
      logger.info(`found email: ${foundUser.email}`);
      const hash = crypto.createHash('sha256');
      hash.update(password);
      const hashedPass = hash.digest('hex');
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

  register(req, res) {
    const user = req.body;
    const { email } = user;
    const { password } = user;
    const isRegisteredObj = {
      isRegistered: '',
    };

    if ((email === null || email === '' || email === undefined) || (password === null || password === '' || password === undefined)) {
      logger.info('email or password is null, empty or undefined, please check');
    } else {
      const isRegistered = this.dbStorage.registerNewUser(email, password);

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
