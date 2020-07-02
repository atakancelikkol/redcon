class INetworkUtility {
  /**
   * applyNetworkConfiguration
   * applies network configuration
   */
  async applyNetworkConfiguration(config) {
    throw new Error('applyNetworkConfiguration() not implemented', config);
  }
}

module.exports = INetworkUtility;
