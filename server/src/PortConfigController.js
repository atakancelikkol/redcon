const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const ControllerBase = require('./ControllerBase');

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
    const configResponse = {
      portconfig: {
        configContents: error ? 'An error occurred while reading file' : data,
        shellOutput: this.shellOutput,
        shellError: this.shellError,
      },
    };
    this.sendMessageCallback(this, configResponse);
  }

  setConfigFile(configContents) {
    if (typeof configContents !== 'string') {
      console.log('Invalid parameters', configContents);
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

  applyConfigFile() {
    if (os.platform() !== 'linux') {
      console.log('Port forwarding script can be used only in linux operating system.');
      this.readAndSendConfigFile();
    } else {
      exec('cd ../scripts/port_forwarding/ && ./port_forward.sh', (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
        this.shellOutput = stdout;
        this.shellError = stderr;
        this.readAndSendConfigFile();
      });
    }
  }
}

module.exports = PortConfigController;
