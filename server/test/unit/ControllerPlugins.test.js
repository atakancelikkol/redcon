const ControllerLoader = require('../../src/ControllerLoader');

const controllerLoader = new ControllerLoader();

describe('ControllerBase', () => {
  it('init', () => {
    const tempcreateControllerInstances = controllerLoader.createControllerInstances;
    controllerLoader.createControllerInstances = jest.fn();
    controllerLoader.init();
    expect(controllerLoader.createControllerInstances).toHaveBeenCalledTimes(1);
    controllerLoader.createControllerInstances = tempcreateControllerInstances;
  });

  it('should return the name of js files under given folder', () => {
    expect(controllerLoader.findControllers(__dirname)).toContain(__filename);
    expect(controllerLoader.findControllers()).not.toContain(['./TestPackageObject.js']);
  });

  it('loadModules', () => {
    expect(controllerLoader.loadModules(['./ControllerLoader.js'])).toContain(require('../../src/ControllerLoader.js')); // eslint-disable-line
    expect(controllerLoader.loadModules()).toContainEqual(expect.anything());
  });

  it('createControllerInstances', () => {
    expect(controllerLoader.createControllerInstances()[0]).toHaveProperty('dataStorage');
    expect(controllerLoader.createControllerInstances(controllerLoader.loadModules())[0]).toHaveProperty('httpServer');
  });
});
