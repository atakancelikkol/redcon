const ServerConfig = {
  // Authenticator
  AuthenticatorTokenSecret: '3970B5079E5B3CB468355D16E4E8648EA1BEA982109B813F7B183F42E416E6C5',
  AuthenticatorTimeoutDuration: 60 * 60, // units of seconds for now: 60*60=1h

  // Logger
  LoggerLevel: 'debug', // importance: error > warning > info > verbose > debug > silly
  LoggerMaxFileSize: undefined, // units of bytes
  LoggerCallerModuleDepth: 3,

  // PosixUSBUtility
  USBMountPoint: '/media/REDCONMOUNTPOINT',

  // Win32USBUtility
  USBLabelName: 'REDCON',

  // Authentication configurations

  useAuthentication: true,
  authServer: 'http://localhost:3010',
  //
  GPIOPinConfigName: 'raspberry',
};

module.exports = ServerConfig;
