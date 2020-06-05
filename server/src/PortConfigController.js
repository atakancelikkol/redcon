const fs = require('fs');
const ControllerBase = require('./ControllerBase');
const logger = require('./util/Logger');

const CONFIG_FILE_PATH = '../scripts/port_forwarding/int.config';
const CONFIG_CUSTOM_CONFIG_PATH = '../scripts/port_forwarding/custom.config';

class PortConfigController extends ControllerBase {
  constructor() {
    super('PortConfigController');
    this.shellOutput = '';
    this.shellError = '';
  }

  init() {
    this.applyConfigFile();
  }

  handleMessage(obj/* , client */) {
    /*
    obj["portconfig"] = {
        action: "readConfigFile",
      }

    obj["portconfig"] = {
        action: "setConfigFile",
        configContents: "",
      }
    obj["portconfig"] = {
        action: "resetConfigFile",
      }
    */
    if (obj.portconfig) {
      const commandObject = obj.portconfig;
      if (commandObject.action === 'readConfigFile') {
        this.readAndSendConfigFile();
      } else if (commandObject.action === 'setConfigFile' && commandObject.configContents) {
        this.setConfigFile(commandObject.configContents);
      } else if (commandObject.action === 'resetConfigFile') {
        this.resetConfigFile();
      }
    }
  }

  readAndSendConfigFile() {
    fs.readFile(CONFIG_CUSTOM_CONFIG_PATH, 'utf-8', (err, data) => {
      if (!err) {
        this.sendConfigFileToClients(data, err);
      } else {
        fs.readFile(CONFIG_FILE_PATH, 'utf-8', (er, dat) => {
          this.sendConfigFileToClients(dat, er);
        });
      }
    });
  }

  sendConfigFileToClients(data, error) {
    const configResponse = { portconfig: {
      configContents: error ? 'An error occurred while reading file' : data,
      shellOutput: this.shellOutput,
      shellError: this.shellError,
    } };
    this.sendMessageCallback(this, configResponse);
  }

  setConfigFile(configContents) {
    if (typeof configContents !== 'string') {
      // console.log('Invalid parameters', configContents);
      logger.error('Invalid parameters', configContents);
      return;
    }
    fs.writeFile(CONFIG_CUSTOM_CONFIG_PATH, configContents, 'utf8', (/* err */) => {
      this.applyConfigFile();
    });
  }

  resetConfigFile() {
    fs.readFile(CONFIG_FILE_PATH, 'utf-8', (err, data) => {
      fs.writeFile(CONFIG_CUSTOM_CONFIG_PATH, data, 'utf8', (/* er */) => {
        this.applyConfigFile();
      });
    });
  }

  async applyConfigFile() {
    const platformPortConfig = await this.platformObjects.getNetworkUtility().applyPortConfiguration();
    if (platformPortConfig) {
      this.shellOutput = platformPortConfig.shellOutput;
      this.shellError = platformPortConfig.shellError;
    }
    this.readAndSendConfigFile();
  }
}

module.exports = PortConfigController;
