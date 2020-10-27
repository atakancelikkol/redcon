const ControllerBase = require('../../src/ControllerBase');

const controllerBase = new ControllerBase('testName');
const obj = {};

describe('ControllerBase', () => {
  it('constructor', () => {
    expect(controllerBase.name).toBe('testName');
    expect(controllerBase.platformObjects).toBe(null);
    expect(controllerBase.dataStorage).toBe(null);
    expect(controllerBase.httpServer).toBe(null);
    expect(controllerBase.sendMessageCallback).toBeInstanceOf(Function);
  });

  it('registerSendMessageCallback', () => {
    controllerBase.registerSendMessageCallback(obj);
    expect(controllerBase.sendMessageCallback).toBe(obj);
  });

  it('registerPlatformObjects', () => {
    controllerBase.registerPlatformObjects(obj);
    expect(controllerBase.platformObjects).toBe(obj);
    expect(() => { controllerBase.registerPlatformObjects(obj); }).toThrow(Error);
  });

  it('registerDataStorage', () => {
    controllerBase.registerDataStorage(obj);
    expect(controllerBase.dataStorage).toBe(obj);
    expect(() => { controllerBase.registerDataStorage(obj); }).toThrow(Error);
  });

  it('registerHttpServer', () => {
    controllerBase.registerHttpServer(obj);
    expect(controllerBase.httpServer).toBe(obj);
    expect(() => { controllerBase.registerHttpServer(obj); }).toThrow(Error);
  });

  it('isAuthRequired', () => {
    expect(controllerBase.isAuthRequired()).toBeTruthy();
  });
});
