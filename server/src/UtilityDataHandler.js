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
    const platformUtility = this.platformObjects.getPlatformUtility();
    platformUtility.rebootSystem();
  }
}

module.exports = UtilityDataHandler;
