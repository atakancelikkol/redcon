const { execSync } = require('child_process');
const PosixPlatformUtility = require('../../../../src/platform/posix/PosixPlatformUtility');

jest.mock('child_process');

describe('PosixPlatformUtility test', () => {
  it('check reboot method', () => {
    const posixPlatformtility = new PosixPlatformUtility();
    posixPlatformtility.rebootSystem();
    expect(execSync).toHaveBeenCalledWith('reboot');
  });
});
