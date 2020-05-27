const HttpServer = require('../../src/HttpServer');
const Authenticator = require('../../src/Authenticator');
const GPIOController = require('../../src/GPIOController');
const PortConfigController = require('../../src/PortConfigController');
const SerialPortController = require('../../src/SerialPortController');
const USBController = require('../../src/USBController');
const UtilityDataHandler = require('../../src/UtilityDataHandler');

const controllers = [];
controllers.push(new Authenticator({ sendMessageCallback }));
controllers.push(new GPIOController({ sendMessageCallback }));
const usbController = new USBController({ sendMessageCallback });
controllers.push(usbController);
controllers.push(new SerialPortController({ sendMessageCallback }));
controllers.push(new PortConfigController({ sendMessageCallback }));
controllers.push(new UtilityDataHandler({ sendMessageCallback }));


jest.mock('../../src/Authenticator');
jest.mock('../../src/GPIOController');
jest.mock('../../src/PortConfigController');
jest.mock('../../src/SerialPortController');
jest.mock('../../src/USBController');
jest.mock('../../src/UtilityDataHandler');

const httpServer = new HttpServer({ controllers });

function sendMessageCallback () {

}

describe("HttpServer Constructor", () => {
  test("HttpServer instance's port should return 3000 in development", () => {
    expect(httpServer.port).toBe(3000);
  });
});

