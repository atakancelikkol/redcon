const ControllerPlugins = require('../../src/ControllerPlugins');

const controllerPlugins = new ControllerPlugins();

describe('ControllerBase', () => {
  it('should return the name of js files under given folder', () => {
    expect(controllerPlugins.findControllers(__dirname)).toContain(__filename);
    expect(controllerPlugins.findControllers()).not.toContain(['./TestPackageObject.js']);
  });

  it('loadModules', () => {
    expect(controllerPlugins.loadModules(['./ControllerPlugins.js'])).toContain(require('../../src/ControllerPlugins.js'));
    expect(controllerPlugins.loadModules()).toContainEqual(expect.anything());
  });

  it('createControllerInstances', () => {
    expect(controllerPlugins.createControllerInstances()[0]).toHaveProperty('dataStorage');
  });
});
