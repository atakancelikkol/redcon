const PosixPlatformUtility = require('../../../../src/platform/posix/PosixPlatformUtility');
const { execSync } = require('child_process');
jest.mock('child_process');

describe("PosixPlatformUtility test", () => {
  it("check reboot method", () => {
    const posixPlatformtility = new PosixPlatformUtility();
    posixPlatformtility.rebootSystem()
    expect(execSync).toHaveBeenCalledWith('reboot');
  });
});