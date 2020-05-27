const { execSync } = require('child_process');
const ControllerBase = require('./ControllerBase');

class UtilityDataHandler extends ControllerBase {
  constructor() {
    super('UtilityDataHandler');
  }

  handleMessage(obj) {
    // { utility: { action: 'reboot' } };
    if (obj.utility) {
      if (obj.utility.action === 'reboot') {
        this.executeRebootCommand();
      }
    }
  }

  executeRebootCommand() {
    if (process.platform === 'win32') {
      console.log('do not execute reboot command on win32');
      return;
    }

    execSync('reboot');
  }
}

module.exports = UtilityDataHandler;
