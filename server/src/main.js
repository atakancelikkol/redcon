const GPIOController = require('./GPIOController');
const USBController = require('./USBController');
const AppServer = require('./AppServer');
const SerialPortController = require('./SerialPortController');
const PortConfigController = require('./PortConfigController');
const RPiController = require('./RPiController');

dataHandlers = [];
dataHandlers.push(new GPIOController({sendMessageCallback}));
dataHandlers.push(new USBController({sendMessageCallback}));
dataHandlers.push(new SerialPortController({sendMessageCallback}));
dataHandlers.push(new PortConfigController({sendMessageCallback}));
dataHandlers.push(new RPiController({sendMessageCallback}));

// create connection manager
const appServer = new AppServer({dataHandlers});
appServer.init();

// init data handlers
dataHandlers.forEach((handler) => {
  handler.init();
});


function sendMessageCallback(obj) {
  appServer.sendToAllClients(obj);
}
