const UtilityDataHandler = require('../../src/UtilityDataHandler');
const { execSync } = require('child_process');

jest.mock('child_process');

describe('UtilityDataHandler', () => {
  test('isAuthRequired should return true', () => {
    let UtilityDataH = new UtilityDataHandler({});
    expect(UtilityDataH.isAuthRequired()).toBe(true);
  });

  test('init should print out console message', () => {
    let UtilityDataH = new UtilityDataHandler({});
  });

  test('appendData does nothing');

  test('handleMessage should call executeRebootCommandif action is reboot', () => {
    let UtilityDataH = new UtilityDataHandler({
      sendMessageCallback: (h, o) => {
        handler = h;
        obj = o;
      }
    });
    let mockExecuteRebootC = jest.fn();
    UtilityDataH.executeRebootCommand = mockExecuteRebootC;
    UtilityDataH.handleMessage({ utility: { action: "reboot" } });
    expect(mockExecuteRebootC).toHaveBeenCalled();
  });

  test('executeRebootCommand', () => {
  });

  test('onExit does nothing');
});
