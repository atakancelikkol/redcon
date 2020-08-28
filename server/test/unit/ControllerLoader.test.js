const find = require('find');
const ControllerLoader = require('../../src/ControllerLoader');

const controllerLoader = new ControllerLoader();

describe('ControllerLoader', () => {
  it('init', () => {
    const tempcreateControllerInstances = controllerLoader.createControllerInstances;
    controllerLoader.createControllerInstances = jest.fn();
    controllerLoader.init();
    expect(controllerLoader.createControllerInstances).toHaveBeenCalledTimes(1);
    controllerLoader.createControllerInstances = tempcreateControllerInstances;
  });

  it('should return the name of js files under given folder', () => {
    const tempfileSync = find.fileSync;
    find.fileSync = jest.fn();
    controllerLoader.findControllers();
    expect(find.fileSync).toHaveBeenCalledTimes(1);
    find.fileSync = tempfileSync;
  });

  const tempfindController = controllerLoader.findControllers;
  controllerLoader.findControllers(() => find.fileSync(/([A-Z]\w+)((\.test)?\.js)/, '../../src/controllers'));

  it('loadModules', () => {
    const controllerList = controllerLoader.findControllers();
    expect(controllerLoader.loadModules()).toContain(require(controllerList[0])); // eslint-disable-line
  });

  it('createControllerInstances', () => {
    expect(controllerLoader.createControllerInstances()[0]).toHaveProperty('dataStorage');
    expect(controllerLoader.createControllerInstances()[0]).toHaveProperty('httpServer');
    controllerLoader.findControllers = tempfindController;
  });
});
