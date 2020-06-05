const { execSync } = require('child_process');
const IPlatformUtility = require('../interfaces/IPlatformUtility');

class PosixPlatformUtility extends IPlatformUtility {
  rebootSystem() {
    execSync('reboot');
  }
}

module.exports = PosixPlatformUtility;
