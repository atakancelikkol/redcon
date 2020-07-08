const GPIOController = require('../../src/GPIOController');
const PlatformObjects = require('../../src/platform/PlatformObjects');
const GPIOPins = require('../../src/GPIOPins');

const platformObjects = new PlatformObjects('mock');

describe('GPIOController', () => {
  it('Constructing gpioState of gpioController Instance', () => {
    const gpioController = new GPIOController();
    gpioController.registerPlatformObjects(platformObjects);
    expect(gpioController.gpioState[GPIOPins.RELAY_POWER_PIN]).toEqual(1);
    expect(gpioController.gpioState[GPIOPins.RELAY_CONTACT_PIN]).toEqual(1);
  });

  it('isAuthRequired should return true', () => {
    const gpioController = new GPIOController();
    gpioController.registerPlatformObjects(platformObjects);
    expect(gpioController.isAuthRequired()).toBe(true);
  });

  it('init', () => {
    const gpioController = new GPIOController();
    const gpioUtility = platformObjects.getGPIOUtility();
    const openForOutputSpy = jest.spyOn(gpioUtility, 'openForOutput');
    gpioController.registerPlatformObjects(platformObjects);
    gpioController.init();
    expect(openForOutputSpy).toHaveBeenCalledTimes(2);
  });

  describe('getCopyState', () => {
    it('', () => {
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.gpioState[3] = 0;
      gpioController.gpioState[5] = 1;
      gpioController.startTime = new Date();
      gpioController.endTime = new Date();
      gpioController.history = [
        {
          port: '5', state: 1, date: 2020,
        },
        {
          port: '3', state: 1, date: 2015,
        },
        {
          port: '3', state: 0, date: 2010,
        },
        {
          port: '5', state: 1, date: 2005,
        },
        {
          port: '3', state: 0, date: 2000,
        },
        {
          port: '3', state: 1, date: 1995,
        },
        {
          port: '3', state: 0, date: 1990,
        },
        {
          port: '5', state: 1, date: 1985,
        },
        {
          port: '5', state: 0, date: 1980,
        },
        {
          port: '5', state: 1, date: 1975,
        },
      ];
      const obj = {};
      gpioController.appendData(obj);
      expect(gpioController.getCopyState()).toStrictEqual({
        state: gpioController.gpioState,
        startTime: gpioController.startTime,
        endTime: gpioController.endTime,
        history: gpioController.history,
      });
    });
  });

  describe('appendData', () => {
    it('Pin(3):HIGH Pin(5):HIGH, startTime&endTime = new Date(), history = bunch of object list', () => {
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.gpioState[3] = 1;
      gpioController.gpioState[5] = 0;
      gpioController.startTime = new Date();
      gpioController.endTime = new Date();
      gpioController.history = [
        {
          port: '3', state: 1, date: 2020,
        },
        {
          port: '5', state: 1, date: 2019,
        },
        {
          port: '3', state: 0, date: 2018,
        },
        {
          port: '3', state: 1, date: 2017,
        },
        {
          port: '3', state: 0, date: 2016,
        },
        {
          port: '3', state: 1, date: 2015,
        },
        {
          port: '5', state: 0, date: 2014,
        },
        {
          port: '5', state: 1, date: 2013,
        },
        {
          port: '3', state: 0, date: 2012,
        },
        {
          port: '5', state: 1, date: 2011,
        },
      ];
      const obj = {};
      gpioController.appendData(obj);
      expect(obj.gpio).toStrictEqual({
        state: gpioController.gpioState,
        startTime: gpioController.startTime,
        endTime: gpioController.endTime,
        history: gpioController.history,
      });
    });
  });

  describe('handleMessage', () => {
    it("Parameters passing to handleMessage = {gpio: {port: GPIOPins.RELAY_POWER_PIN,state: false}}", () => {
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: {
        port: GPIOPins.RELAY_POWER_PIN, state: false,
      } });
      expect(gpioController.gpioState[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(0);
      expect(gpioController.gpioState[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(1);
    });

    it("Parameters passing to handleMessage = {gpio: {port: GPIOPins.RELAY_CONTACT_PIN,state: false}}", () => {
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: {
        port: GPIOPins.RELAY_CONTACT_PIN, state: false,
      } });
      expect(gpioController.gpioState[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(1);
      expect(gpioController.gpioState[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(0);
    });

    it("Parameters passing to handleMessage = {gpio: {port: GPIOPins.RELAY_POWER_PIN,state: true}}", () => {
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: {
        port: GPIOPins.RELAY_POWER_PIN, state: true,
      } });
      expect(gpioController.gpioState[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(1);
      expect(gpioController.gpioState[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(1);
    });

    it("Parameters passing to handleMessage = {gpio: {port: GPIOPins.RELAY_CONTACT_PIN,state: true}}", () => {
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: {
        port: GPIOPins.RELAY_CONTACT_PIN, state: true,
      } });
      expect(gpioController.gpioState[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(1);
      expect(gpioController.gpioState[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(1);
    });
  });

  describe('setGPIOPort', () => {
    it("Parameters passing to setGPIOPort = (GPIOPins.RELAY_POWER_PIN, 1)", () => {
      let obj;
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        obj = o;
      });
      gpioController.init();
      gpioController.setGPIOPort(GPIOPins.RELAY_POWER_PIN, 1);
      expect(obj.gpio.state[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(1);
      expect(obj.gpio.state[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(1);
    });

    it("Parameters passing to setGPIOPort = (GPIOPins.RELAY_CONTACT_PIN, 1)", () => {
      let obj;
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        obj = o;
      });
      gpioController.init();
      gpioController.setGPIOPort(GPIOPins.RELAY_CONTACT_PIN, 1);
      expect(obj.gpio.state[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(1);
      expect(obj.gpio.state[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(1);
    });

    it("Parameters passing to setGPIOPort = (GPIOPins.RELAY_POWER_PIN, 0)", () => {
      let obj;
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        obj = o;
      });
      gpioController.init();
      gpioController.setGPIOPort(GPIOPins.RELAY_POWER_PIN, 0);
      expect(obj.gpio.state[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(0);
      expect(obj.gpio.state[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(1);
    });

    it("Parameters passing to setGPIOPort = (GPIOPins.RELAY_CONTACT_PIN, 0)", () => {
      let obj;
      const gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        obj = o;
      });
      gpioController.init();
      gpioController.setGPIOPort(GPIOPins.RELAY_CONTACT_PIN, 0);
      expect(obj.gpio.state[GPIOPins.RELAY_POWER_PIN]).toStrictEqual(1);
      expect(obj.gpio.state[GPIOPins.RELAY_CONTACT_PIN]).toStrictEqual(0);
    });
  });
});
