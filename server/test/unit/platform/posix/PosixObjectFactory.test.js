const PosixObjectFactory = require('../../../../src/platform/posix/PosixObjectFactory');

describe("PosixObjectFactory test", () => {
  it("should return the correct platform string", () => {
    const posixObjectFactory = new PosixObjectFactory();
    expect(posixObjectFactory.getPlatformString()).toEqual('posix');
  });

  it("should return the platform objects", () => {
    const posixObjectFactory = new PosixObjectFactory();
    expect(posixObjectFactory.createGPIOUtility()).not.toEqual(undefined);
    expect(posixObjectFactory.createNetworkUtility()).not.toEqual(undefined);
    expect(posixObjectFactory.createUSBUtility()).not.toEqual(undefined);
    expect(posixObjectFactory.createPlatformUtility()).not.toEqual(undefined);
  });
});