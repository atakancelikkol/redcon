const find = require('find');
const path = require('path');

class ControllerPlugins {
  init() {
    this.createControllerInstances();
  }

  findControllers(searchPath = path.join(__dirname, 'controllers')) {
    const objectsToCreate = find.fileSync(/([A-Z]\w+)((\.test)*\.js)/, searchPath);
    return objectsToCreate;
  }

  loadModules(objectsToCreate = []) {
    if (!objectsToCreate.length) {
      objectsToCreate = this.findControllers(); // eslint-disable-line
    }
    const instancesToCreate = [];
    objectsToCreate.forEach((plugin) => {
      instancesToCreate.push(require(plugin)); // eslint-disable-line
    });
    return instancesToCreate;
  }

  createControllerInstances(instancesToCreate = []) {
    if (!instancesToCreate.length) {
      instancesToCreate = this.loadModules(); // eslint-disable-line
    }
    const instancesCreated = [];
    instancesToCreate.forEach((Plugin) => {
      instancesCreated.push(new Plugin());
    });
    return instancesCreated;
  }
}

module.exports = ControllerPlugins;
