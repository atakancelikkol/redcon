const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('../../server/src/util/Logger.js');
const AuthServerConfig = require('./AuthServerConfig');
const LowDBDataStorage = require('./dataStorage/LowDBDataStorage.js');
//const usersJson = require('./utils/usersDb.json');

class AuthServer {
  constructor(options) {
    this.port = AuthServerConfig.ServerPort;
    this.app = null;
    this.httpServer = null;
    this.token = undefined;
    this.dbStorage = new LowDBDataStorage();
    if (options && options.useMockUsers) this.userArray = [{ email: 'test', password: 'validPass' }];
    else this.userArray = this.dbStorage.getUsers();
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

    // search and match from json
    /*for (let i = 0; i < this.userArray.length; i += 1) {
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
    }*/
    let foundUser = this.dbStorage.findUser(email);
    console.log(foundUser);
    if(foundUser){
      logger.info(`found email: ${foundUser.email}`);
      if(foundUser.password === password){
        logger.info(`correct password for  ${foundUser.email}`);
        this.token = true;
      }else{
        logger.info('wrong password');
        this.token = false;
      }
    }else{
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
