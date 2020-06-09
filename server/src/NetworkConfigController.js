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
      this.sendCurrentConfiguration();
    }
  }

  async addUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp }) {
    if (externalIp && externalPort && internalIp) {
      await this.dataStorage.addUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp });
      this.sendCurrentConfiguration();
    }
  }

  async removeUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp }) {
    if (externalIp && externalPort && internalIp) {
      await this.dataStorage.removeUdpExtToIntNetworkRule({ externalIp, externalPort, internalIp });
      this.sendCurrentConfiguration();
    }
  }

  async addUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp }) {
    if (internalIp && internalPort && externalIp) {
      await this.dataStorage.addUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp });
      this.sendCurrentConfiguration();
    }
  }

  async removeUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp }) {
    if (internalIp && internalPort && externalIp) {
      await this.dataStorage.removeUdpIntToExtNetworkRule({ internalIp, internalPort, externalIp });
      this.sendCurrentConfiguration();
    }
  }

  async addTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort }) {
    if (deviceExternalPort && internalIp && internalPort) {
      await this.dataStorage.addTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort });
      this.sendCurrentConfiguration();
    }
  }

  async removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort }) {
    if (deviceExternalPort && internalIp && internalPort) {
      await this.dataStorage.removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort });
      this.sendCurrentConfiguration();
    }
  }

  async addTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort }) {
    if (deviceInternalPort && externalIp && externalPort) {
      await this.dataStorage.addTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort });
      this.sendCurrentConfiguration();
    }
  }

  async removeTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort }) {
    if (deviceInternalPort && externalIp && externalPort) {
      await this.dataStorage.removeTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort });
      this.sendCurrentConfiguration();
    }
  }

  sendCurrentConfiguration() {
    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }
}

module.exports = NetworkConfigController;
