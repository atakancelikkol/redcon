const { exec } = require('child_process');
const INetworkUtility = require('../interfaces/INetworkUtility');
const IPTableRuleGenerator = require('./IPTableRuleGenerator');
const logger = require('../../util/Logger');

const execPromise = (command) => new Promise((resolve) => {
  exec(command, (error, stdout, stderr) => {
    resolve({ error, stdout, stderr });
  });
});

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


  async applyNetworkConfiguration(config) {
    console.log('applying configuration!', config);
    const status = IPTableRuleGenerator.generateScript(config);
    if (status.error) {
      console.log('error occurred during iptable rule generation!');
      return;
    }

    console.log(status.script);

    const { error, stdout, stderr } = await execPromise(status.script);
    console.log('run script. output is');
    console.log('ERROR:', error);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }
}

module.exports = PosixNetworkUtility;
