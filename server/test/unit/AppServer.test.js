const AppServer = require('../../src/AppServer');
const Authenticator = require('../../src/Authenticator');
const GPIOController = require('../../src/GPIOController');
const PortConfigController = require('../../src/PortConfigController');
const SerialPortController = require('../../src/SerialPortController');
const USBController = require('../../src/USBController');
const UtilityDataHandler = require('../../src/UtilityDataHandler');

const dataHandlers = [];
dataHandlers.push(new Authenticator({ sendMessageCallback }));
dataHandlers.push(new GPIOController({ sendMessageCallback }));
const usbController = new USBController({ sendMessageCallback });
dataHandlers.push(usbController);
dataHandlers.push(new SerialPortController({ sendMessageCallback }));
dataHandlers.push(new PortConfigController({ sendMessageCallback }));
dataHandlers.push(new UtilityDataHandler({ sendMessageCallback }));


jest.mock('../../src/Authenticator');
jest.mock('../../src/GPIOController');
jest.mock('../../src/PortConfigController');
jest.mock('../../src/SerialPortController');
jest.mock('../../src/USBController');
jest.mock('../../src/UtilityDataHandler');

const appServer = new AppServer({ dataHandlers });

function sendMessageCallback () {

}

describe("AppServer Constructor", () => {
  test("appServer instance's port should return 3000 in development", () => {
    expect(appServer.port).toBe(3000);
  });
});

