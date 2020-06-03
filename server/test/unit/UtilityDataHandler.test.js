const UtilityDataHandler = require('../../src/UtilityDataHandler');
const PlatformObjects = require('../../src/platform/PlatformObjects');

const platformObjects = new PlatformObjects('mock');

describe('UtilityDataHandler', () => {
  test('isAuthRequired should return true', () => {
    const utilityDataHandlerInstance = new UtilityDataHandler();
    utilityDataHandlerInstance.registerPlatformObjects(platformObjects);
    expect(utilityDataHandlerInstance.isAuthRequired()).toBe(true);
  });

  test('handleMessage should call executeRebootCommand if action is reboot', () => {
    const utilityDataHandlerInstance = new UtilityDataHandler();
    utilityDataHandlerInstance.registerPlatformObjects(platformObjects);
    const mockExecuteRebootCommand = jest.fn();
    utilityDataHandlerInstance.executeRebootCommand = mockExecuteRebootCommand;
    utilityDataHandlerInstance.handleMessage({ utility: { action: 'reboot' } });
    expect(mockExecuteRebootCommand).toHaveBeenCalled();
  });

  test('executeRebootCommand should call platform reboot', () => {
    const utilityDataHandlerInstance = new UtilityDataHandler();
    utilityDataHandlerInstance.registerPlatformObjects(platformObjects);
    const platformUtility = platformObjects.getPlatformUtility();
    const rebootSystemSpy = jest.spyOn(platformUtility, 'rebootSystem');

    utilityDataHandlerInstance.handleMessage({ utility: { action: 'invalid command' } });
    expect(rebootSystemSpy).not.toHaveBeenCalled();

    utilityDataHandlerInstance.handleMessage({ invalid_module: { action: 'invalid command' } });
    expect(rebootSystemSpy).not.toHaveBeenCalled();

    utilityDataHandlerInstance.handleMessage({ utility: { action: 'reboot' } });
    expect(rebootSystemSpy).toHaveBeenCalled();
  });
});
