const PlatformObjects = require('../../../src/platform/PlatformObjects');

describe('PlatformObjects test', () => {
  it('should create mock factory', () => {
    const platformObjects = new PlatformObjects('mock');
    expect(platformObjects.factory.getPlatformString()).toEqual('mock');
  });

  it('should create platform factory', () => {
    const platformObjects = new PlatformObjects();
    expect(platformObjects.getGPIOUtility()).not.toEqual(null);
    expect(platformObjects.getNetworkUtility()).not.toEqual(null);
    expect(platformObjects.getUSBUtility()).not.toEqual(null);
    expect(platformObjects.getPlatformUtility()).not.toEqual(null);
  });

  it('should create mock platform objects', () => {
    const platformObjects = new PlatformObjects('mock');
    expect(platformObjects.getGPIOUtility()).not.toEqual(null);
    expect(platformObjects.getNetworkUtility()).not.toEqual(null);
    expect(platformObjects.getUSBUtility()).not.toEqual(null);
    expect(platformObjects.getPlatformUtility()).not.toEqual(null);
  });

  it('should throw an exception when creating for an invalid platform', () => {
    expect(() => {
      const platformObjects = new PlatformObjects('invalid-platform');
    }).toThrow(new Error('Can not create object factory for the platform! invalid-platform'));
  });
});
