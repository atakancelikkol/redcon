const ControllerBase = require('../../src/ControllerBase');
const PlatformObjects = require('../../src/platform/PlatformObjects');
const DataStorage = require('../../src/dataStorage/LowDBDataStorage');
const HttpServer = require('../../src/HttpServer');

const controllerBase = new ControllerBase('testName');

describe('ControllerBase', () => {
  it('Constructor', () => {
    expect(controllerBase.name).toBe('testName');
    expect(controllerBase.platformObjects).toBe(null);
    expect(controllerBase.dataStorage).toBe(null);
    expect(controllerBase.sendMessageCallback).toBeInstanceOf(Function);
  });

  it('registerSendMessageCallback', () => {
    const controllers = [];
    const httpServer = new HttpServer({ controllers });
    const callback = httpServer.sendToAllClients.bind(httpServer);
    controllerBase.registerSendMessageCallback(callback);
    expect(controllerBase.sendMessageCallback).toBe(callback);
  });

  it('registerPlatformObjects', () => {
    const platformObjects = new PlatformObjects();
    controllerBase.registerPlatformObjects(platformObjects);
    expect(controllerBase.platformObjects).toBe(platformObjects);
    expect(() => { controllerBase.registerPlatformObjects(platformObjects); }).toThrow(Error);
  });

  it('registerDataStorage', () => {
    const dataStorage = new DataStorage();
    controllerBase.registerDataStorage(dataStorage);
    expect(controllerBase.dataStorage).toBe(dataStorage);
    expect(() => { controllerBase.registerDataStorage(dataStorage); }).toThrow(Error);
  });

  it('isAuthRequired', () => {
    expect(controllerBase.isAuthRequired()).toBeTruthy();
  });
});
