class INetworkUtility {
  /**
   * applyPortConfiguration
   * runs port forwarding script
   */
  applyPortConfiguration() {
    throw new Error('applyPortConfiguration() not implemented');
  }

  async getNetworkInterfaces() {
    throw new Error('getNetworkInterfaces() not implemented');
  }

  async applyNetworkConfiguration(config) {
    throw new Error('applyNetworkConfiguration() not implemented', config);
  }
}

module.exports = INetworkUtility;
