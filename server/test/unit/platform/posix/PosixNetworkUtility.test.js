const { exec } = require('child_process');
const PosixNetworkUtility = require('../../../../src/platform/posix/PosixNetworkUtility');

let execCommandString = '';
jest.mock('child_process', () => ({ exec: jest.fn((commandString, callback) => {
  execCommandString = commandString;
  callback('error', 'testStdOut', 'testStdError');
}) }));

describe('PosixNetworkUtility test', () => {
  it('exec should called once', () => new Promise((done) => {
    const posixNetworkUtility = new PosixNetworkUtility();
    posixNetworkUtility.applyPortConfiguration().then((platformPortConfig) => {
      expect(platformPortConfig).toStrictEqual({
        shellError: 'testStdError', shellOutput: 'testStdOut',
      });
      done();
    });

    expect(exec.mock.calls[0][0]).toBe(execCommandString);
  }));
});
