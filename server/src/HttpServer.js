const { v4: uuidv4 } = require('uuid');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const compression = require('compression');
const ClientConnection = require('./ClientConnection');
const Authenticator = require('./Authenticator');

const auth = new Authenticator();

const logger = require('./util/Logger');
const ServerConfig = require('./ServerConfig');

class HttpServer {
  constructor({ controllers }) {
    this.controllers = controllers;
    this.port = 3000;
    if (process.argv[2] === 'production') {
      // change the port to 80 as this is running in production mode
      this.port = 80;
    }
    this.app = null;
    this.httpServer = null;
    this.webSocketServer = null;
    this.clients = [];
    this.isAlive = null;
    this.pingPongInterval = null;
    this.pingPongIntervalMsec = null;
    this.inactiveTimeIntervalMsec = null;
    this.maxInactiveTime = null;
  }

  init() {
    logger.info('initializing HttpServer...');
    this.app = express();

    // start web server
    this.app.use(bodyParser.json({ limit: '500mb' }));
    this.app.use(bodyParser.urlencoded({
      limit: '500mb', extended: true,
    }));
    this.app.use(bodyParser.raw({ limit: '500mb' }));
    this.app.use(compression());

    this.httpServer = http.createServer(this.app);

    // create http server
    this.httpServer.listen(this.port);
    this.app.use(express.static('public'));

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    // create websocket server
    this.webSocketServer = new WebSocket.Server({ server: this.httpServer });
    this.webSocketServer.on('connection', this.onConnectionHandler.bind(this));

    // after maxInactiveTime client will be removed.
    this.maxInactiveTime = 5 * 1000; // 60 secs

    // create interval
    this.pingPongIntervalMsec = 1 * 1000; // 15 secs
    this.pingPongInterval = setInterval(this.ping.bind(this), this.pingPongIntervalMsec);
  }

  inactiveClientChecker() {
    if (this.clients.length !== 0) {
      this.clients.forEach((client) => {
        const currentDate = new Date();
        if (client.getLastActivityTime()) {
          if (((currentDate - client.getLastActivityTime()) / 1000) > (this.maxInactiveTime / 1000)) {
            logger.info('timeout ========', ((currentDate - client.getLastActivityTime()) / 1000));
            client.connection.terminate();
          } else {
            logger.info('normal ========', client.getLastActivityTime());
          }
        } else {
          client.setLastActivityTime(currentDate);
        }
      });
    }
  }

  ping() {
    this.webSocketServer.clients.forEach((ws) => {
      if (this.clients.length !== 0) {
        logger.info('ping to ', ws._socket.remoteAddress); // eslint-disable-line
        this.isAlive = false;
        ws.ping();
      }
    });
    this.inactiveClientChecker();
    logger.info('=====number of clients ====', this.clients.length);
  }

  heartbeat(client) {
    const newDate = new Date();
    logger.info('inactive time ===', ((newDate - client.getLastActivityTime()) / 1000), 'seconds.');
    client.setLastActivityTime(newDate);
    logger.info('last activity of ', client.id, '===', client.lastActivityTime);
    this.isAlive = true;
    logger.info('this is heartBeat ===', this.isAlive);
  }

  getApp() {
    return this.app;
  }

  getClients() {
    return this.clients;
  }

  onConnectionHandler(connection, req) {
    // request handler
    const client = new ClientConnection({
      id: uuidv4(),
      ip: req.connection.remoteAddress,
      connection,
      isAuthenticated: false,
      onUserAuthChanged: () => {
        this.sendInitialMessage(client);
      },
    });
    logger.info('New connection request received! id: ', client.getId());
    logger.info('Remote client address:', client.getIp());

    this.clients.push(client);
    // send initial message to the client
    this.sendInitialMessage(client);
    connection.on('message', this.onMessageHandler.bind(this, client));
    connection.on('close', this.onCloseHandler.bind(this, client));
    connection.on('pong', this.heartbeat.bind(this, client));
  }

  onMessageHandler(client, message) {
    const obj = JSON.parse(message);
    this.controllers.forEach((controller) => {
      if (ServerConfig.useAuthentication) {
        if (!controller.isAuthRequired() || client.isAuthenticated()) {
          controller.handleMessage(obj, client, this.clients);
        }
      } else {
        controller.handleMessage(obj, client, this.clients);
      }
    });
  }

  onCloseHandler(client/* , connection */) {
    logger.info('connection closed! id: ', client.getId());
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      auth.logoutByTimeout(client, 'lostConnection', this.clients);
      this.clients.splice(index, 1);
      this.controllers.forEach((controller) => {
        controller.onConnectionClosed(client, this.clients);
      });
      logger.info(client.id, 'client removed');
    } else {
      logger.info(`Error on closing connection ${client.getId()}`);
    }
  }

  sendInitialMessage(client) {
    // collect data from data controllers
    const obj = {};
    this.controllers.forEach((controller) => {
      if (ServerConfig.useAuthentication) {
        if (!controller.isAuthRequired() || client.isAuthenticated()) {
          controller.appendData(obj);
        }
      } else {
        controller.appendData(obj);
      }
    });
    client.connection.send(JSON.stringify(obj));
  }

  sendToAllClients(controller, obj) {
    this.clients.forEach((client) => {
      if (ServerConfig.useAuthentication) {
        if (!controller.isAuthRequired() || client.isAuthenticated()) {
          client.connection.send(JSON.stringify(obj));
        }
      } else {
        client.connection.send(JSON.stringify(obj));
      }
    });
  }
}

module.exports = HttpServer;
