
const HttpServer = require('./HttpServer');
const Authenticator = require('./Authenticator');
const PlatformObjects = require('./platform/PlatformObjects');
const DataStorage = require('./dataStorage/LowDBDataStorage');
const ControllerLoader = require('./ControllerLoader');

const idleConnectionCheckInterval = 5 * 60 * 1000; // units of ms 5 * 60 * 1000 = 5 minutes

class Server {
  constructor() {
    this.platformObjects = new PlatformObjects();
    this.dataStorage = new DataStorage();
    this.controllerLoader = new ControllerLoader();
    this.controllers = this.controllerLoader.createControllerInstances();

    this.authenticator = new Authenticator();
    this.controllers.push(this.authenticator);

    // create connection manager
    this.httpServer = new HttpServer({ controllers: this.controllers });

    this.idleConnectionCheckIntervalHandle = undefined;
  }

  async init() {
    await this.dataStorage.init();
    this.httpServer.init();

    // init controllers
    this.controllers.forEach((controller) => {
      controller.registerSendMessageCallback(this.httpServer.sendToAllClients.bind(this.httpServer));
      controller.registerPlatformObjects(this.platformObjects);
      controller.registerDataStorage(this.dataStorage);
      controller.registerHttpServer(this.httpServer);
      controller.init();
    });

    this.idleConnectionCheckIntervalHandle = setInterval(this.idleConnectionChecker.bind(this), idleConnectionCheckInterval);
  }

  onExit() {
    this.controllers.forEach((controller) => {
      controller.onExit();
    });

    if (this.idleConnectionCheckIntervalHandle) {
      clearInterval(this.idleConnectionCheckIntervalHandle);
    }
  }

  idleConnectionChecker() {
    this.authenticator.checkIdleConnections(this.httpServer.getClients());
  }
}

module.exports = Server;
