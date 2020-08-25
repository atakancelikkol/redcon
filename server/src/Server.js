
const HttpServer = require('./HttpServer');
const Authenticator = require('./Authenticator');
const PlatformObjects = require('./platform/PlatformObjects');
const DataStorage = require('./dataStorage/LowDBDataStorage');
const ControllerPlugins = require('./ControllerPlugins');

const idleConnectionCheckInterval = 5 * 60 * 1000; // units of ms 5 * 60 * 1000 = 5 minutes

class Server {
  constructor() {
    this.platformObjects = new PlatformObjects();
    this.dataStorage = new DataStorage();
    this.controllerPlugins = new ControllerPlugins();
    this.controllers = this.controllerPlugins.createControllerInstances();

    this.authenticator = new Authenticator();
    this.controllers.push(this.authenticator);

    // find a way to include with ControllerPlugins
    this.usbController = this.controllers.find((controller) => controller.name === 'USBController');

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
      controller.init();
    });

    // upload handler
    this.httpServer.getApp().post('/uploadFileToUsbDevice', this.usbController.uploadFileToUsbDevice.bind(this.usbController));
    this.httpServer.getApp().get('/getFileFromUsbDevice', this.usbController.getFileFromUsbDevice.bind(this.usbController));

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
