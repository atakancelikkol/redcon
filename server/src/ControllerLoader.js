const find = require('find');
const path = require('path');
const logger = require('./util/Logger');

class ControllerLoader {
  init() {
    this.createControllerInstances();
  }

  findControllers() {
    const objectsToCreate = find.fileSync(/([A-Z]\w+)((\.test)*\.js)/, path.join(__dirname, 'controllers'));
    return objectsToCreate;
  }

  loadModules() {
    const objectsToCreate = this.findControllers();
    const instancesToCreate = [];
    objectsToCreate.forEach((plugin) => {
      instancesToCreate.push(require(plugin)); // eslint-disable-line
    });
    return instancesToCreate;
  }

  createControllerInstances() {
    const instancesToCreate = this.loadModules();
    const instancesCreatedArr = [];
    instancesToCreate.forEach((Plugin) => {
      const instancesCreated = new Plugin();
      logger.info(instancesCreated.name, 'Controller created and loaded.');
      instancesCreatedArr.push(instancesCreated);
    });
    return instancesCreatedArr;
  }
}

module.exports = ControllerLoader;
