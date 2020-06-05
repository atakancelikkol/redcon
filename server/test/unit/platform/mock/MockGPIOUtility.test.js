const MockGPIOUtility = require('../../../../src/platform/mock/MockGPIOUtility');

describe('MockGPIOUtility test', () => {
  it('methods should be called without an error', () => {
    const mockGPIOUtility = new MockGPIOUtility();
    expect(mockGPIOUtility.openForOutput()).toEqual(undefined);
    expect(mockGPIOUtility.openForInput()).toEqual(undefined);
    expect(mockGPIOUtility.read()).toEqual(true);
    expect(mockGPIOUtility.write()).toEqual(undefined);
    expect(mockGPIOUtility.close()).toEqual(undefined);
  });
});
