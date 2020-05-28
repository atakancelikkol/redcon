const { execSync } = require('child_process');
const IPlatformUtility = require('../interfaces/IPlatformUtility');

class Win32PlatformUtility extends IPlatformUtility {
  rebootSystem() {
    execSync('shutdown /r');
  }
}

module.exports = Win32PlatformUtility;
