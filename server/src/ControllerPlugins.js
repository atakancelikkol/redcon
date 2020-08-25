const find = require('find');

class ControllerPlugins {
  constructor() {
    this.fileNames = [];
    this.pluginObjects = [];
    this.instances = [];
  }

  init() {
    this.createControllerInstances();
  }

  findControllers() {
    this.fileNames = find.fileSync('controllers');
  }

  createModuleObjects() {
    this.findControllers();
    this.fileNames.forEach((plugin) => {
      this.moduleObjects.push(require(plugin)); // eslint-disable-line
    });
  }

  createControllerInstances() {
    this.createModuleObjects();
    this.moduleObjects.forEach((Plugin) => {
      this.instances.push(new Plugin());
    });
    return this.instances;
  }
}

module.exports = ControllerPlugins;
