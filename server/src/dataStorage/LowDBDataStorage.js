const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const Memory = require('lowdb/adapters/Memory');
const DefaultData = require('./DefaultData');

const DATABASE_FILE = 'database.json';

class LowDBDataStorage {
  constructor() {
    this.db = undefined;
  }

  async init() {
    const adapter = LowDBDataStorage.createAdapter(process.env.NODE_ENV);
    this.db = await low(adapter);
    await this.db.defaults(DefaultData).write();
  }

  static createAdapter(env) {
    if (env === 'test') {
      return new Memory();
    }
    return new FileAsync(DATABASE_FILE);
  }

  // Network Configruation methods
  getNetworkConfiguration() {
    return this.db.get('networkConfiguration').value();
  }

  async updateNetworkInterfaceConfiguration(config) {
    const interfaceConfiguration = this.db.get('networkConfiguration').get('interfaceConfiguration');
    await interfaceConfiguration.assign(config).write();
  }

  async addUdpExtToIntNetworkRule({ name, externalPort, internalIp, internalPort }) {
    const udpExtToIntRules = this.db.get('networkConfiguration').get('udpExtToIntRules');
    // externalIp, externalPort must be unique!
    const existingRule = await udpExtToIntRules.find({ externalPort, internalIp, internalPort }).value();
    if (!existingRule) {
      await udpExtToIntRules.push({ name, externalPort, internalIp, internalPort }).write();
    }
  }

  async removeUdpExtToIntNetworkRule({ externalPort, internalIp, internalPort }) {
    return this.db.get('networkConfiguration').get('udpExtToIntRules').remove({ externalPort, internalIp, internalPort }).write();
  }

  async addUdpIntToExtNetworkRule({ name, internalPort, externalIp, externalPort }) {
    const udpIntToExtRules = this.db.get('networkConfiguration').get('udpIntToExtRules');
    const existingRule = await udpIntToExtRules.find({ internalPort, externalIp, externalPort }).value();
    if (!existingRule) {
      await udpIntToExtRules.push({ name, internalPort, externalIp, externalPort }).write();
    }
  }

  async removeUdpIntToExtNetworkRule({ internalPort, externalIp, externalPort }) {
    return this.db.get('networkConfiguration').get('udpIntToExtRules').remove({ internalPort, externalIp, externalPort }).write();
  }

  async addTcpExtToIntNetworkRule({ name, deviceExternalPort, internalIp, internalPort }) {
    const tcpExtToIntRules = this.db.get('networkConfiguration').get('tcpExtToIntRules');
    const existingRule = await tcpExtToIntRules.find({ deviceExternalPort, internalIp, internalPort }).value();
    if (!existingRule) {
      await tcpExtToIntRules.push({ name, deviceExternalPort, internalIp, internalPort }).write();
    }
  }

  async removeTcpExtToIntNetworkRule({ deviceExternalPort, internalIp, internalPort }) {
    return this.db.get('networkConfiguration').get('tcpExtToIntRules').remove({ deviceExternalPort, internalIp, internalPort }).write();
  }

  async addTcpIntToExtNetworkRule({ name, deviceInternalPort, externalIp, externalPort }) {
    const tcpIntToExtRules = this.db.get('networkConfiguration').get('tcpIntToExtRules');
    const existingRule = await tcpIntToExtRules.find({ deviceInternalPort, externalIp, externalPort }).value();
    if (!existingRule) {
      await tcpIntToExtRules.push({ name, deviceInternalPort, externalIp, externalPort }).write();
    }
  }

  async removeTcpIntToExtNetworkRule({ deviceInternalPort, externalIp, externalPort }) {
    return this.db.get('networkConfiguration').get('tcpIntToExtRules').remove({ deviceInternalPort, externalIp, externalPort }).write();
  }
}

module.exports = LowDBDataStorage;
