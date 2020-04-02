const GPIOController = require('./GPIOController');
const AppServer = require('./AppServer');

dataHandlers = [];
dataHandlers.push(new GPIOController({sendMessageCallback}));

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

