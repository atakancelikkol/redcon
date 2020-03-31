
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const express = require('express');
const WebSocketServer = require('ws').Server;

class AppServer {
  constructor({dataHandlers}) {
    this.dataHandlers = dataHandlers;
    this.port = 3000;
    this.app = null;
    this.httpServer = null;
    this.webSocketServer = null;
    this.clients = [];
  }

  init() {
    console.log("initializing AppServer...");
    this.app = express();
    this.httpServer = http.createServer(this.app);

    // create http server
    this.httpServer.listen(this.port);
    this.app.use(express.static('public'));

    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // create websocket server
    this.webSocketServer = new WebSocketServer({ server: this.httpServer });
    this.webSocketServer.on('connection', this.onConnectionHandler.bind(this));

  }

  onConnectionHandler(connection, req) {
    // request handler
    const id = uuidv4();
    console.log("New connection request received! id: ", id);
    const client = { id, connection };
    this.clients.push(client);

    // send initial message to the client
    this.sendInitialMessage(client);

    connection.on('message', this.onMessageHandler.bind(this, client));
    connection.on('close', this.onCloseHandler.bind(this, client));  
  }

  onMessageHandler(client, message) {
    let obj = JSON.parse(message);
    this.dataHandlers.forEach((handler) => {
      handler.handleMessage(obj);
    });
  }

  onCloseHandler(client, connection) {
    console.log("connection closed! id: ", client.id);
    let index = this.clients.indexOf(client);
    if (index != -1) {
      this.clients.splice(index, 1);
    } else {
      console.log("Error on closing connection! id: ", client.id);
    }
  }

  sendInitialMessage(client) {
    // collect data from data handlers
    let obj = {};
    this.dataHandlers.forEach((handler) => {
      handler.appendData(obj);
    });
  
    client.connection.send(JSON.stringify(obj));
  }

  sendToAllClients(obj) {
    this.clients.forEach((client) => {
      client.connection.send(JSON.stringify(obj));
    });
  }
}

module.exports = AppServer;
