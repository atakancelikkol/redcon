class INetworkUtility {
  /**
   * applyNetworkConfiguration
   * applies network configuration
   */
  async applyNetworkConfiguration(config) {
    throw new Error('applyNetworkConfiguration() not implemented', config);
  }

  /**
   * removeNetworkConfiguration
   * removes network configuration
   */
  async removeNetworkConfiguration(config) {
    throw new Error('removeNetworkConfiguration() not implemented', config);
  }
}

module.exports = INetworkUtility;
