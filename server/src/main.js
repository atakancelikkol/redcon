const GPIOController = require('./GPIOController');
const AppServer = require('./AppServer');
const PortConfigController = require('./PortConfigController');

dataHandlers = [];
dataHandlers.push(new GPIOController({sendMessageCallback}));
dataHandlers.push(new PortConfigController({sendMessageCallback}));

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

