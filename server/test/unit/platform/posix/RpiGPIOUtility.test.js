const RpiGPIOUtility = require('../../../../src/platform/posix/RpiGPIOUtility');

describe("RpiGPIOUtility test", () => {
  it("test methods for output mode", () => {
    const rpiGPIOUtility = new RpiGPIOUtility();
    const portToOpenForOutput = 3;
    expect(rpiGPIOUtility.openForOutput(portToOpenForOutput, 0)).toEqual(undefined);
    expect(rpiGPIOUtility.write(portToOpenForOutput, 1)).toEqual(undefined);
    expect(rpiGPIOUtility.close(portToOpenForOutput)).toEqual(undefined);
  });

  it("test methods for input mode", () => {
    const rpiGPIOUtility = new RpiGPIOUtility();
    const portToOpenForInput = 5;
    expect(rpiGPIOUtility.openForInput(portToOpenForInput, 0)).toEqual(undefined);
    expect(rpiGPIOUtility.read(portToOpenForInput)).toEqual(0);
    expect(rpiGPIOUtility.close(portToOpenForInput)).toEqual(undefined);
  });
});
