const fs = require('fs')

const CONFIG_FILE_PATH = "../scripts/port_forwarding/int.config";

class PortConfigController {
  constructor({sendMessageCallback}) {
    this.sendMessageCallback = sendMessageCallback;

  }

  init() {

  }

  appendData(obj) {
    // No initial data to send
  }

  handleMessage(obj) {
    /*
    obj["portconfig"] = {
        action: "readConfigFile",
      }

      obj["portconfig"] = {
        action: "setConfigFile",
        configContents: "",
      }
    */
    if (obj["portconfig"]) {
      let commandObject = obj["portconfig"];
      if(commandObject["action"] == "readConfigFile") {
        this.readAndSendConfigFile();
      } else if(commandObject["action"] == "setConfigFile" && commandObject["configContents"]) {
        this.setConfigFile(commandObject["configContents"]);
      }
    }
  }

  readAndSendConfigFile() {
    fs.readFile(CONFIG_FILE_PATH, 'utf-8', (err, data) => {
      this.sendConfigFileToClients(data, err);
    })
  }

  sendConfigFileToClients(data, error) {
    let configResponse = {
      portconfig: {
        configContents: error ? "An error occurred while reading file" : data,
    }};
    this.sendMessageCallback(configResponse);
  }

  setConfigFile(configContents) {
    // TODO: update config contents
  }
}

module.exports = PortConfigController;