const Win32PlatformUtility = require('../../../../src/platform/win32/Win32PlatformUtility');
const { execSync } = require('child_process');
jest.mock('child_process'); // websocketConnector is now a mock constructor

describe("Win32PlatformUtility test", () => {
  it("check reboot method", () => {
    const win32Platformtility = new Win32PlatformUtility();
    win32Platformtility.rebootSystem()
    expect(execSync).toHaveBeenCalledWith('shutdown /r /t 5');
  });
});