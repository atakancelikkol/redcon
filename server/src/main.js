const GPIOController = require('./GPIOController');
const USBController = require('./USBController');
const AppServer = require('./AppServer');
const SerialPortController = require('./SerialPortController');
const PortConfigController = require('./PortConfigController');
const UtilityDataHandler = require('./UtilityDataHandler');
const Authenticator = require('./Authenticator');

const dataHandlers = [];
dataHandlers.push(new Authenticator({ sendMessageCallback }));
dataHandlers.push(new GPIOController({ sendMessageCallback }));
const usbController = new USBController({ sendMessageCallback });
dataHandlers.push(usbController);
dataHandlers.push(new SerialPortController({ sendMessageCallback }));
dataHandlers.push(new PortConfigController({ sendMessageCallback }));
dataHandlers.push(new UtilityDataHandler({ sendMessageCallback }));

// create connection manager
const appServer = new AppServer({ dataHandlers });
appServer.init();

// upload handler
appServer.getApp().post('/uploadFileToUsbDevice', usbController.uploadFileToUsbDevice.bind(usbController));
appServer.getApp().get('/getFileFromUsbDevice', usbController.getFileFromUsbDevice.bind(usbController));

// init data handlers
dataHandlers.forEach((handler) => {
  handler.init();
});

function sendMessageCallback(obj) {
  appServer.sendToAllClients(obj);
}

process.on('SIGINT', function () {
  dataHandlers.forEach((handler) => {
    handler.onExit();
  });
  process.exit();
});
