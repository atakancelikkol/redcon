const ServerConfig = {
  // Authenticator
  AuthenticatorTokenSecret: '3970B5079E5B3CB468355D16E4E8648EA1BEA982109B813F7B183F42E416E6C5',
  AuthenticatorTimeoutDuration: 10 * 60, // units of seconds for now

  // Logger
  LoggerLevel: 'debug', // importance: error > warning > info > verbose > debug > silly
  LoggerMaxFileSize: undefined, // units of bytes
  LoggerCallerModuleDepth: 3,

  // PosixUSBUtility
  USBMountPoint: '/media/REDCONMOUNTPOINT',

  // Win32USBUtility
  USBLabelName: 'REDCON',
};

module.exports = ServerConfig;
