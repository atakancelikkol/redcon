const { exec } = require('child_process');
const INetworkUtility = require('../interfaces/INetworkUtility');

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
        console.log(error, stdout, stderr);
        resolve(platformPortConfig);
      });
    });
  }

  async getNetworkInterfaces() {
    return ['mockEth0', 'mockEth1', 'mockEth2'];
  }

  async applyNetworkConfiguration(config) {
    console.log('applying network configuration', config);
  }
}

module.exports = PosixNetworkUtility;
