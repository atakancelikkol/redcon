const HttpServer = require('./HttpServer');
const PlatformObjects = require('./platform/PlatformObjects');
const DataStorage = require('./dataStorage/LowDBDataStorage');
const ControllerLoader = require('./ControllerLoader');

class Server {
  constructor() {
    this.platformObjects = new PlatformObjects();
    this.dataStorage = new DataStorage();
    this.controllerLoader = new ControllerLoader();
    this.controllers = this.controllerLoader.createControllerInstances();

    // create connection manager
    this.httpServer = new HttpServer({ controllers: this.controllers });
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
  }

  onExit() {
    this.controllers.forEach((controller) => {
      controller.onExit();
    });
  }
}

module.exports = Server;
