const Server = require('./Server');

const server = new Server();
server.init();

process.on('SIGINT', () => {
  server.onExit();
  process.exit();
});
