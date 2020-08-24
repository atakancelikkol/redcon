const find = require('find');

class ControllerPlugins {
  constructor(){
    this.fileNames=[];
    this.pluginObjects=[]
    this.instances=[];
  }
  init() {
    this.createControllerInstances();
  }

  findControllers(){
    this.fileNames = find.fileSync(/([A-Z]\w*)(Controller\.js)/, __dirname);
  }

  createModuleObjects(){
    this.findControllers();
    this.fileNames.forEach(plugin => {
      this.moduleObjects.push(require(plugin));
    });
  }

  createControllerInstances() {
    this.createModuleObjects();
    this.moduleObjects.forEach(plugin => {
      this.instances.push(new plugin);
    });
    return this.instances
  }
}

module.exports = ControllerPlugins;
