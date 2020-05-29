const UtilityDataHandler = require('../../src/UtilityDataHandler');
const PlatformObjects = require('../../src/platform/PlatformObjects');
const platformObjects = new PlatformObjects('mock');

describe('UtilityDataHandler', () => {
  test('isAuthRequired should return true', () => {
    let utilityDataHandlerInstance = new UtilityDataHandler();
    utilityDataHandlerInstance.registerPlatformObjects(platformObjects);
    expect(utilityDataHandlerInstance.isAuthRequired()).toBe(true);
  });

  test('handleMessage should call executeRebootCommand if action is reboot', () => {
    let utilityDataHandlerInstance = new UtilityDataHandler();
    utilityDataHandlerInstance.registerPlatformObjects(platformObjects);
    let mockExecuteRebootCommand = jest.fn();
    utilityDataHandlerInstance.executeRebootCommand = mockExecuteRebootCommand;
    utilityDataHandlerInstance.handleMessage({ utility: { action: "reboot" } });
    expect(mockExecuteRebootCommand).toHaveBeenCalled();
  });

  test('executeRebootCommand should call platform reboot', () => {
    let utilityDataHandlerInstance = new UtilityDataHandler();
    utilityDataHandlerInstance.registerPlatformObjects(platformObjects);
    const platformUtility = platformObjects.getPlatformUtility();
    const rebootSystemSpy = jest.spyOn(platformUtility, 'rebootSystem');

    utilityDataHandlerInstance.handleMessage({ utility: { action: "invalid command" } });
    expect(rebootSystemSpy).not.toHaveBeenCalled();

    utilityDataHandlerInstance.handleMessage({ invalid_module: { action: "invalid command" } });
    expect(rebootSystemSpy).not.toHaveBeenCalled();

    utilityDataHandlerInstance.handleMessage({ utility: { action: "reboot" } });
    expect(rebootSystemSpy).toHaveBeenCalled();
  });
});
