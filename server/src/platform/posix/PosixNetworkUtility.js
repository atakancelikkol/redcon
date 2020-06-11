const { exec } = require('child_process');
const INetworkUtility = require('../interfaces/INetworkUtility');
const logger = require('../../util/Logger');

class PosixNetworkUtility extends INetworkUtility {
  applyPortConfiguration() {
    return new Promise((resolve) => {
      const platformPortConfig = {
        shellOutput: '',
        shellError: '',
      };
      exec('cd ../scripts/port_forwarding/ && ./port_forward.sh', (error, stdout, stderr) => {
        platformPortConfig.shellOutput = stdout;
        platformPortConfig.shellError = stderr;
        logger.info(error, stdout, stderr);
        resolve(platformPortConfig);
      });
    });
  }
}

module.exports = PosixNetworkUtility;
