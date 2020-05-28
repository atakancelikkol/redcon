const PosixNetworkUtility = require('../../../../src/platform/posix/PosixNetworkUtility');
const { exec } = require('child_process');

jest.mock('child_process');

describe("PosixNetworkUtility test", () => {
  it("exec should called once", () => {
    const posixNetworkUtility = new PosixNetworkUtility();
    posixNetworkUtility.run()
    expect(exec).toHaveBeenCalled();
  });
});