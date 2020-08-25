const find = require('find');
const path = require('path');

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
    this.fileNames = find.fileSync(/([A-Z]\w+)(\.js)/, path.join(__dirname, 'controllers'));
  }

  createModuleObjects() {
    this.findControllers();
    this.fileNames.forEach((plugin) => {
      this.pluginObjects.push(require(plugin)); // eslint-disable-line
    });
  }

  createControllerInstances() {
    this.createModuleObjects();
    this.pluginObjects.forEach((Plugin) => {
      this.instances.push(new Plugin());
    });
    return this.instances;
  }
}

module.exports = ControllerPlugins;
