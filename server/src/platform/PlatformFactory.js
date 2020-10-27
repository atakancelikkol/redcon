const Win32ObjectFactory = require('./win32/Win32ObjectFactory');
const PosixObjectFactory = require('./posix/PosixObjectFactory');
const MockObjectFactory = require('./mock/MockObjectFactory');

class PlatformFactory {
  static createFactory(platformIndentifier) {
    let factory;
    switch (platformIndentifier) {
      case 'darwin':
      case 'freebsd':
      case 'linux':
      case 'openbsd':
        factory = new PosixObjectFactory();
        break;
      case 'win32':
        factory = new Win32ObjectFactory();
        break;
      case 'mock':
        factory = new MockObjectFactory();
        break;
      default:
        break;
    }

    return factory;
  }
}

module.exports = PlatformFactory;
