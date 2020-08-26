const ControllerPlugins = require('../../src/ControllerPlugins');

const controllerPlugins = new ControllerPlugins();

describe('ControllerBase', () => {
  it('init', () => {
    const tempcreateControllerInstances = controllerPlugins.createControllerInstances;
    controllerPlugins.createControllerInstances = jest.fn();
    controllerPlugins.init();
    expect(controllerPlugins.createControllerInstances).toHaveBeenCalledTimes(1);
    controllerPlugins.createControllerInstances = tempcreateControllerInstances;
  });

  it('should return the name of js files under given folder', () => {
    expect(controllerPlugins.findControllers(__dirname)).toContain(__filename);
    expect(controllerPlugins.findControllers()).not.toContain(['./TestPackageObject.js']);
  });

  it('loadModules', () => {
    expect(controllerPlugins.loadModules(['./ControllerPlugins.js'])).toContain(require('../../src/ControllerPlugins.js')); // eslint-disable-line
    expect(controllerPlugins.loadModules()).toContainEqual(expect.anything());
  });

  it('createControllerInstances', () => {
    expect(controllerPlugins.createControllerInstances()[0]).toHaveProperty('dataStorage');
    expect(controllerPlugins.createControllerInstances(controllerPlugins.loadModules())[0]).toHaveProperty('httpServer');
  });
});
