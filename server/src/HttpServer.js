const { v4: uuidv4 } = require('uuid');
const http = require('http');
const express = require('express');
const WebSocketServer = require('ws').Server;
const bodyParser = require('body-parser');
const compression = require('compression');
const ClientConnection = require('./ClientConnection');

const logger = require('./util/Logger');

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
    this.webSocketServer = new WebSocketServer({ server: this.httpServer });
    this.webSocketServer.on('connection', this.onConnectionHandler.bind(this));
  }

  getApp() {
    return this.app;
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
  }

  onMessageHandler(client, message) {
    const obj = JSON.parse(message);
    this.controllers.forEach((controller) => {
      if (!controller.isAuthRequired() || client.isAuthenticated()) {
        if (controller.name === 'Authenticator') {
          controller.handleMessage(obj, client, this.clients);
        } else {
          controller.handleMessage(obj, client);
        }
      }
    });
  }

  onCloseHandler(client/* , connection */) {
    logger.info('connection closed! id: ', client.getId());
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
      for (let controllersIndex = 0; controllersIndex < this.controllers.length; controllersIndex += 1) {
        if (this.controllers[controllersIndex].name === 'Authenticator') {
          this.controllers[controllersIndex].onConnectionClosed(this.clients);
        }
      }
    } else {
      logger.info(`Error on closing connection ${client.getId()}`);
    }
  }

  sendInitialMessage(client) {
    // collect data from data controllers
    const obj = {};
    this.controllers.forEach((controller) => {
      if (!controller.isAuthRequired() || client.isAuthenticated()) {
        controller.appendData(obj);
      }
    });
    client.connection.send(JSON.stringify(obj));
  }

  sendToAllClients(controller, obj) {
    this.clients.forEach((client) => {
      if (!controller.isAuthRequired() || client.isAuthenticated()) {
        client.connection.send(JSON.stringify(obj));
      }
    });
  }
}

module.exports = HttpServer;
