const PlatformFactory = require('../../../src/platform/PlatformFactory');

describe("PlatformFactory test", () => {
  it("should create win32 factory", () => {
    const win32Factory = PlatformFactory.createFactory('win32');
    expect(win32Factory.getPlatformString()).toEqual('win32');
  });

  it("should create posix factory", () => {
    const posixFactory = PlatformFactory.createFactory('darwin');
    expect(posixFactory.getPlatformString()).toEqual('posix');
  });

  it("should create posix factory", () => {
    const posixFactory = PlatformFactory.createFactory('freebsd');
    expect(posixFactory.getPlatformString()).toEqual('posix');
  });

  it("should create posix factory", () => {
    const posixFactory = PlatformFactory.createFactory('linux');
    expect(posixFactory.getPlatformString()).toEqual('posix');
  });

  it("should create posix factory", () => {
    const posixFactory = PlatformFactory.createFactory('openbsd');
    expect(posixFactory.getPlatformString()).toEqual('posix');
  });

  it("should create mock factory", () => {
    const mockFactory = PlatformFactory.createFactory('mock');
    expect(mockFactory.getPlatformString()).toEqual('mock');
  });

  it("should not create an invalid factory", () => {
    const mockFactory = PlatformFactory.createFactory('invalid-platform');
    expect(mockFactory).toEqual(undefined);
  });



});