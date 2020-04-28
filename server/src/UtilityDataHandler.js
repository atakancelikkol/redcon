const execSync = require('child_process').execSync;

class UtilityDataHandler {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
  }

  isAuthRequired(){
    return true
  }

  init() {
    console.log("initializing UtilityDataHandler");
  }

  appendData(obj) {
  }

  handleMessage(obj, client) {

    // { utility: { action: 'reboot' } };
    if (obj["utility"]) {
      if (obj["utility"].action == "reboot") {
        this.executeRebootCommand();
      }
    }
  }

  executeRebootCommand() {
    if (process.platform == "win32") {
      console.log("do not execute reboot command on win32")
      return;
    }

    execSync("reboot");
  }

  onExit() {

  }
}

module.exports = UtilityDataHandler;