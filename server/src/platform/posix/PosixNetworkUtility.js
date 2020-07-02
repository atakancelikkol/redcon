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
  async applyNetworkConfiguration(config) {
    logger.info('applying configuration!', config);
    const status = IPTableRuleGenerator.generateScript(config);
    if (status.error) {
      logger.error('error occurred during iptable rule generation!');
      return { error: true };
    }

    const output = await execPromise(status.script);
    return output;
  }
}

module.exports = PosixNetworkUtility;
