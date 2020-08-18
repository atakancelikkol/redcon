const os = require('os');
const net = require('net');
const ControllerBase = require('./ControllerBase');
const logger = require('./util/Logger');

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
    obj.networkConfig = { ...this.dataStorage.getNetworkConfiguration() }; // eslint-disable-line
    obj.networkConfig.networkInterfaces = this.getNetworkInterfaces(); // eslint-disable-line
  }

  getNetworkInterfaces() {
    const interfaces = os.networkInterfaces();
    const interfaceNames = Object.keys(interfaces);
    const networkInterfaces = [];
    interfaceNames.forEach((name) => {
      let ip;
      interfaces[name].forEach((obj) => {
        if (obj.family === 'IPv4') {
          ip = obj.address;
        }
      });
      networkInterfaces.push({ name, ip });
    });
    return networkInterfaces;
  }

  async updateNetworkInterfaceConfiguration(configuration) {
    configuration.internalInterfaceName = this.normalizeString(configuration.internalInterfaceName); // eslint-disable-line
    configuration.externalInterfaceName = this.normalizeString(configuration.externalInterfaceName); // eslint-disable-line
    if (configuration.internalInterfaceName && configuration.externalInterfaceName && this.parameterCheckIsSubNet(configuration.internalInterfaceSubnet)) {
      const networkInterfaces = this.getNetworkInterfaces()
      configuration.externalInterfaceIP = networkInterfaces.find((item) => item.name === configuration.externalInterfaceName).ip;
      configuration.internalInterfaceIP = networkInterfaces.find((item) => item.name === configuration.internalInterfaceName).ip;
      await this.removeConfiguration();
      await this.dataStorage.updateNetworkInterfaceConfiguration(configuration);
      await this.onConfigurationUpdated();
    }
  }

  async addUdpExtToIntNetworkRule({ name, externalPort, internalIp, internalPort }) {
    if (this.parameterCheckPort(externalPort) && this.parameterCheckIp(internalIp) && this.parameterCheckPort(internalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.addUdpExtToIntNetworkRule({ name: this.normalizeString(name), externalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeUdpExtToIntNetworkRule({ externalPort, internalIp, internalPort }) {
    if (this.parameterCheckPort(externalPort) && this.parameterCheckIp(internalIp) && this.parameterCheckPort(internalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.removeUdpExtToIntNetworkRule({ externalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async addUdpIntToExtNetworkRule({ name, internalPort, externalIp, externalPort }) {
    if (this.parameterCheckPort(internalPort) && this.parameterCheckIp(externalIp) && this.parameterCheckPort(externalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.addUdpIntToExtNetworkRule({ name: this.normalizeString(name), internalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeUdpIntToExtNetworkRule({ internalPort, externalIp, externalPort }) {
    if (this.parameterCheckPort(internalPort) && this.parameterCheckIp(externalIp) && this.parameterCheckPort(externalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.removeUdpIntToExtNetworkRule({ internalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  async addTcpExtToIntNetworkRule({ name, deviceExternalPort, internalIp, internalPort }) {
    if (this.parameterCheckPort(deviceExternalPort) && this.parameterCheckIp(internalIp) && this.parameterCheckPort(internalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.addTcpExtToIntNetworkRule({ name: this.normalizeString(name), deviceExternalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort }) {
    if (this.parameterCheckPort(deviceExternalPort) && this.parameterCheckIp(internalIp) && this.parameterCheckPort(internalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort });
      await this.onConfigurationUpdated();
    }
  }

  async addTcpIntToExtNetworkRule({ name, deviceInternalPort, externalIp, externalPort }) {
    if (this.parameterCheckPort(deviceInternalPort) && this.parameterCheckIp(externalIp) && this.parameterCheckPort(externalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.addTcpIntToExtNetworkRule({ name: this.normalizeString(name), deviceInternalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  async removeTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort }) {
    if (this.parameterCheckPort(deviceInternalPort) && this.parameterCheckIp(externalIp) && this.parameterCheckPort(externalPort)) {
      await this.removeConfiguration();
      await this.dataStorage.removeTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort });
      await this.onConfigurationUpdated();
    }
  }

  sendCurrentConfiguration() {
    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }

  parameterCheckPort(port) {
    const portInt = Number.parseInt(port, 10);
    if (!Number.isNaN(portInt) && portInt >= 0 && portInt <= 65535) {
      return true;
    }

    return false;
  }

  parameterCheckIp(ip) {
    return net.isIPv4(ip);
  }

  parameterCheckIsSubNet(subnet) {
    if (!subnet) {
      return false;
    }

    const items = subnet.split('/');
    if (!items[0] || !this.parameterCheckIp(items[0])) {
      return false;
    }

    if (!items[1]) {
      return false;
    }

    const subnetMask = Number.parseInt(items[1], 10);
    if (Number.isNaN(subnetMask) || subnetMask < 0 || subnetMask > 32) {
      return false;
    }

    return true;
  }

  normalizeString(str) {
    if (typeof str !== 'string') {
      return '';
    }

    let normalizedString = str.replace(/[\W_]+/g, ' ');
    if (normalizedString.length > 30) {
      normalizedString = normalizedString.substr(0, 30);
    }

    return normalizedString;
  }

  async removeConfiguration() {
    const configuration = { ...this.dataStorage.getNetworkConfiguration() };
    configuration.networkInterfaces = this.getNetworkInterfaces();
    //configuration.networkInterfaces = [{"name":configuration.interfaceConfiguration.internalInterfaceName, "ip":configuration.interfaceConfiguration.internalInterfaceIP}, {"name":configuration.interfaceConfiguration.externalInterfaceName, "ip":configuration.interfaceConfiguration.externalInterfaceIP}];
    await this.platformObjects.getNetworkUtility().removeNetworkConfiguration(configuration);
  }
  
  async onConfigurationUpdated() {
    const configuration = { ...this.dataStorage.getNetworkConfiguration() };
    configuration.networkInterfaces = [{"name":configuration.interfaceConfiguration.internalInterfaceName, "ip":configuration.interfaceConfiguration.internalInterfaceIP}, {"name":configuration.interfaceConfiguration.externalInterfaceName, "ip":configuration.interfaceConfiguration.externalInterfaceIP}];
    await this.platformObjects.getNetworkUtility().applyNetworkConfiguration(configuration);
    this.sendCurrentConfiguration();
  }
}

module.exports = NetworkConfigController;
