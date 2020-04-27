const GPIOController = require('./GPIOController');
const USBController = require('./USBController');
const AppServer = require('./AppServer');
const SerialPortController = require('./SerialPortController');
const PortConfigController = require('./PortConfigController');
const UtilityDataHandler = require('./UtilityDataHandler');
const Authenticator = require('./Authenticator');

dataHandlers = [];
dataHandlers.push(new Authenticator({sendMessageCallback}));
dataHandlers.push(new GPIOController({sendMessageCallback}));
dataHandlers.push(new USBController({sendMessageCallback}));
dataHandlers.push(new SerialPortController({sendMessageCallback}));
dataHandlers.push(new PortConfigController({sendMessageCallback}));
dataHandlers.push(new UtilityDataHandler({sendMessageCallback}));


// create connection manager
const appServer = new AppServer({ dataHandlers });
appServer.init();

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