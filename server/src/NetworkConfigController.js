const os = require('os');
const ControllerBase = require('./ControllerBase');

class NetworkConfigController extends ControllerBase {
  constructor() {
    super('NetworkConfigController');
  }

  init() {
    // apply current configuration on startup
    this.onConfigurationUpdated();
  }

  async handleMessage(obj/* , client */) {
    const commandObject = obj.networkConfig;
    if (commandObject) {
      if (commandObject.action === 'updateNetworkInterfaceConfiguration' && commandObject.configuration) {
        await this.updateNetworkInterfaceConfiguration(commandObject.configuration);
      } else if (commandObject.action === 'addUdpExtToIntNetworkRule' && commandObject.rule) {
        await this.addUdpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeUdpExtToIntNetworkRule' && commandObject.rule) {
        await this.removeUdpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'addUdpIntToExtNetworkRule' && commandObject.rule) {
        await this.addUdpIntToExtNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeUdpIntToExtNetworkRule' && commandObject.rule) {
        await this.removeUdpIntToExtNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'addTcpExtToIntNetworkRule' && commandObject.rule) {
        await this.addTcpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeTcpExtToIntNetworkRule' && commandObject.rule) {
        await this.removeTcpExtToIntNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'addTcpIntToExtNetworkRule' && commandObject.rule) {
        await this.addTcpIntToExtNetworkRule(commandObject.rule);
      } else if (commandObject.action === 'removeTcpIntToExtNetworkRule' && commandObject.rule) {
        await this.removeTcpIntToExtNetworkRule(commandObject.rule);
      }
    }
  }

  appendData(obj) {
    // this function returns the initial state
    obj.networkConfig = {...this.dataStorage.getNetworkConfiguration()}; // eslint-disable-line
    obj.networkConfig.networkInterfaces = this.getNetworkInterfaces(); // eslint-disable-line
  }

  getNetworkInterfaces() {
    const interfaces = os.networkInterfaces();
    const interfaceNames = Object.keys(interfaces);
    const networkInterfaces = [];
    interfaceNames.forEach((name) => {
      let ip;
      let mac;
      interfaces[name].forEach((obj) => {
        if (obj.family === 'IPv4') {
          ip = obj.address;
          mac = obj.mac;
        }
      });
      networkInterfaces.push({ name, ip, mac });
    });
    return networkInterfaces;
  }

  async updateNetworkInterfaceConfiguration(configuration) {
    if (configuration.internalInterfaceName || configuration.externalInterfaceName || configuration.internalInterfaceSubnet) {
      await this.dataStorage.updateNetworkInterfaceConfiguration(configuration);
      await this.onConfigurationUpdated();
    }
  }

  async addUdpExtToIntNetworkRule({ name, externalPort, internalIp, internalPort }) {
    if (externalPort && internalIp && internalPort) {
      await this.dataStorage.addUdpExtToIntNetworkRule({ name, externalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeUdpExtToIntNetworkRule({ externalPort, internalIp, internalPort }) {
    if (externalPort && internalIp && internalPort) {
      await this.dataStorage.removeUdpExtToIntNetworkRule({ externalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async addUdpIntToExtNetworkRule({ name, internalPort, externalIp, externalPort }) {
    if (internalPort && externalIp && externalPort) {
      await this.dataStorage.addUdpIntToExtNetworkRule({ name, internalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeUdpIntToExtNetworkRule({ internalPort, externalIp, externalPort }) {
    if (internalPort && externalIp && externalPort) {
      await this.dataStorage.removeUdpIntToExtNetworkRule({ internalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  async addTcpExtToIntNetworkRule({ name, deviceExternalPort, internalIp, internalPort }) {
    if (deviceExternalPort && internalIp && internalPort) {
      await this.dataStorage.addTcpExtToIntNetworkRule({ name, deviceExternalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort }) {
    if (deviceExternalPort && internalIp && internalPort) {
      await this.dataStorage.removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async addTcpIntToExtNetworkRule({ name, deviceInternalPort, externalIp, externalPort }) {
    if (deviceInternalPort && externalIp && externalPort) {
      await this.dataStorage.addTcpIntToExtNetworkRule({ name, deviceInternalPort, externalIp, externalPort });
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
    const configuration = { ...this.dataStorage.getNetworkConfiguration() };
    configuration.networkInterfaces = this.getNetworkInterfaces();
    await this.platformObjects.getNetworkUtility().applyNetworkConfiguration(configuration);
    this.sendCurrentConfiguration();
  }
}

module.exports = NetworkConfigController;
