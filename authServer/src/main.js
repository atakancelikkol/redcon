const AuthServer = require('./authServer');

const authServer = new AuthServer();
authServer.init();

process.on('SIGINT', () => {
  authServer.onExit();
  process.exit();
});
