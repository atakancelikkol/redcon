class IObjectFactory {
  /**
   * getPlatformString
   * override this method and return platform specific string
   */
  getPlatformString() {
    throw new Error('getPlatformString() not implemented');
  }

  /**
   * createGPIOUtility
   * override this method and return platform specific gpio utility instance
   */
  createGPIOUtility() {
    throw new Error('createGPIOUtility() not implemented');
  }

  /**
   * createNetworkUtiltiy
   * override this method and return platform specific network utility instance
   */
  createNetworkUtility() {
    throw new Error('createNetworkUtiltiy() not implemented');
  }

  /**
   * createUSBUtility
   * override this method and return platform specific usb utility instance
   */
  createUSBUtility() {
    throw new Error('createUSBUtility() not implemented');
  }

  /**
   * createPlatformUtility
   * override this method and return platform specific platform utility instance
   */
  createPlatformUtility() {
    throw new Error('createPlatformUtility() not implemented');
  }
}

module.exports = IObjectFactory;
