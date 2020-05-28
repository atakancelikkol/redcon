const { exec } = require('child_process');
const INetworkUtility = require('../interfaces/INetworkUtility');

class PosixNetworkUtility extends INetworkUtility {
  run() {
    return new Promise((resolve) => {
      const platformPortConfig = {
        shellOutput: '',
        shellError: '',
      };
      exec('cd ../scripts/port_forwarding/ && ./port_forward.sh', (error, stdout, stderr) => {
        platformPortConfig.shellOutput = stdout;
        platformPortConfig.shellError = stderr;
        console.log(error, stdout, stderr);
        resolve(platformPortConfig);
      });
    });
  }
}

module.exports = PosixNetworkUtility;
