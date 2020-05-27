
const GPIOController = require('./GPIOController');
const USBController = require('./USBController');
const HttpServer = require('./HttpServer');
const SerialPortController = require('./SerialPortController');
const PortConfigController = require('./PortConfigController');
const UtilityDataHandler = require('./UtilityDataHandler');
const Authenticator = require('./Authenticator');
const PlatformObjects = require('./platform/PlatformObjects');

class Server {
  constructor() {
    this.platformObjects = new PlatformObjects();
    this.controllers = [];

    this.controllers.push(new Authenticator());
    this.controllers.push(new GPIOController());
    this.usbController = new USBController();
    this.controllers.push(this.usbController);
    this.controllers.push(new SerialPortController());
    this.controllers.push(new PortConfigController());
    this.controllers.push(new UtilityDataHandler());

    // create connection manager
    this.httpServer = new HttpServer({ controllers: this.controllers });
  }

  init() {
    this.httpServer.init();

    // init controllers
    this.controllers.forEach((controller) => {
      controller.registerSendMessageCallback(this.httpServer.sendToAllClients.bind(this.httpServer));
      controller.registerPlatformObjects(this.platformObjects);
      controller.init();
    });

    // upload handler
    this.httpServer.getApp().post('/uploadFileToUsbDevice', this.usbController.uploadFileToUsbDevice.bind(this.usbController));
    this.httpServer.getApp().get('/getFileFromUsbDevice', this.usbController.getFileFromUsbDevice.bind(this.usbController));
  }

  onExit() {
    this.controllers.forEach((controller) => {
      controller.onExit();
    });
  }
}

module.exports = Server;
