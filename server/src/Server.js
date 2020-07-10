
const GPIOController = require('./GPIOController');
const USBController = require('./USBController');
const HttpServer = require('./HttpServer');
const SerialPortController = require('./SerialPortController');
const UtilityDataHandler = require('./UtilityDataHandler');
const Authenticator = require('./Authenticator');
const NetworkConfigController = require('./NetworkConfigController');
const PlatformObjects = require('./platform/PlatformObjects');
const DataStorage = require('./dataStorage/LowDBDataStorage');

const idleConnectionCheckInterval = 1000; // ms

class Server {
  constructor() {
    this.platformObjects = new PlatformObjects();
    this.dataStorage = new DataStorage();
    this.controllers = [];

    this.authenticator = new Authenticator();
    this.controllers.push(this.authenticator);
    this.controllers.push(new GPIOController());
    this.usbController = new USBController();
    this.controllers.push(this.usbController);
    this.controllers.push(new SerialPortController());
    this.controllers.push(new UtilityDataHandler());
    this.controllers.push(new NetworkConfigController());

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
