const GPIOController = require('./GPIOController');
const AppServer = require('./AppServer');
const SerialPortController = require('./SerialPortController');



dataHandlers = [];
dataHandlers.push(new GPIOController({sendMessageCallback}));
dataHandlers.push(new SerialPortController({sendMessageCallback}));

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

