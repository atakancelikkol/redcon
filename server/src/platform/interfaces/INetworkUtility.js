class INetworkUtility {
  /**
   * applyPortConfiguration
   * runs port forwarding script
   */
  applyPortConfiguration() {
    throw new Error('applyPortConfiguration() not implemented');
  }

  async applyNetworkConfiguration(config) {
    throw new Error('applyNetworkConfiguration() not implemented', config);
  }
}

module.exports = INetworkUtility;
