const ServerConfig = {
  // Authenticator
  TokenSecret: '3970B5079E5B3CB468355D16E4E8648EA1BEA982109B813F7B183F42E416E6C5',

  // Logger
  LoggerLevel: 'debug', // importance: error > warning > info > verbose > debug > silly
  LoggerMaxFileSize: undefined, // units of bytes
  LoggerCallerModuleDepth: 3,

  // PosixUSBUtility
  MountPoint: '/media/REDCONMOUNTPOINT',

  // Win32USBUtility
  LabelName: 'REDCON',
};

module.exports = ServerConfig;
