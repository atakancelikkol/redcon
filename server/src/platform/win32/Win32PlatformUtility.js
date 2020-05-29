const { execSync } = require('child_process');
const IPlatformUtility = require('../interfaces/IPlatformUtility');

class Win32PlatformUtility extends IPlatformUtility {
  rebootSystem() {
    execSync('shutdown /r /t 5');
  }
}

module.exports = Win32PlatformUtility;
