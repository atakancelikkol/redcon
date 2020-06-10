const ControllerBase = require('./ControllerBase');

class NetworkConfigController extends ControllerBase {
  constructor() {
    super('NetworkConfigController');
  }

  async handleMessage(obj/* , client */) {
    const commandObject = obj.networkConfig;
    if (commandObject) {
      if (commandObject.action === 'updateNetworkInterfaceConfiguration' && commandObject.configuration) {
        await this.updateNetworkInterfaceConfiguration(commandObject.configuration);
      } else if (commandObject.action === 'addUdpExtToIntNetworkRule' && commandObject.rule) {
        this.addUdpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeUdpExtToIntNetworkRule' && commandObject.rule) {
        this.removeUdpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'addUdpIntToExtNetworkRule' && commandObject.rule) {
        this.addUdpIntToExtNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeUdpIntToExtNetworkRule' && commandObject.rule) {
        this.removeUdpIntToExtNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'addTcpExtToIntNetworkRule' && commandObject.rule) {
        this.addTcpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeTcpExtToIntNetworkRule' && commandObject.rule) {
        this.removeTcpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'addTcpIntToExtNetworkRule' && commandObject.rule) {
        this.addTcpIntToExtNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeTcpIntToExtNetworkRule' && commandObject.rule) {
        this.removeTcpIntToExtNetworkRule(commandObject.rule);
      }
    }
  }

  appendData(obj) {
    // this function returns the initial state
    obj.networkConfig = this.dataStorage.getNetworkConfiguration(); // eslint-disable-line
  }

  async updateNetworkInterfaceConfiguration(configuration) {
    if (configuration.internalInterfaceName || configuration.externalInterfaceName) {
      await this.dataStorage.updateNetworkInterfaceConfiguration(configuration);
      await this.onConfigurationUpdated();
    }
  }

  async addUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp }) {
    if (externalIp && externalPort && internalIp) {
      await this.dataStorage.addUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp });
      await this.onConfigurationUpdated();
    }
  }

  async removeUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp }) {
    if (externalIp && externalPort && internalIp) {
      await this.dataStorage.removeUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp });
      await this.onConfigurationUpdated();
    }
  }

  async addUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp }) {
    if (internalIp && internalPort && externalIp) {
      await this.dataStorage.addUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp });
      await this.onConfigurationUpdated();
    }
  }

  async removeUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp }) {
    if (internalIp && internalPort && externalIp) {
      await this.dataStorage.removeUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp });
      await this.onConfigurationUpdated();
    }
  }

  async addTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort }) {
    if (deviceExternalPort && internalIp && internalPort) {
      await this.dataStorage.addTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort }) {
    if (deviceExternalPort && internalIp && internalPort) {
      await this.dataStorage.removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async addTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort }) {
    if (deviceInternalPort && externalIp && externalPort) {
      await this.dataStorage.addTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort }) {
    if (deviceInternalPort && externalIp && externalPort) {
      await this.dataStorage.removeTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  sendCurrentConfiguration() {
    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }

  async onConfigurationUpdated() {
    this.sendCurrentConfiguration();
  }
}

module.exports = NetworkConfigController;
