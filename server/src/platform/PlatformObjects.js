const PlatformFactory = require('./PlatformFactory');

class PlatformObjects {
  constructor(platformIndentifier = process.platform) {
    this.factory = PlatformFactory.createFactory(platformIndentifier);
    if (!this.factory) {
      throw new Error(`Can not create object factory for the platform! ${platformIndentifier}`);
    }

    this.gpioUtility = this.factory.createGPIOUtility();
    this.networkUtility = this.factory.createNetworkUtility();
    this.usbUtility = this.factory.createUSBUtility();
    this.platformUtility = this.factory.createPlatformUtility();
  }

  getGPIOUtility() {
    return this.gpioUtility;
  }

  getNetworkUtility() {
    return this.networkUtility;
  }

  getUSBUtility() {
    return this.usbUtility;
  }

  getPlatformUtility() {
    return this.platformUtility;
  }
}

module.exports = PlatformObjects;
