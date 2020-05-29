const GPIOController = require('../../src/GPIOController');
const PlatformObjects = require('../../src/platform/PlatformObjects');

const platformObjects = new PlatformObjects('mock');

describe("GPIOController", () => {
  it("Constructing gpioState of gpioController Instance", () => {
    let gpioController = new GPIOController();
    gpioController.registerPlatformObjects(platformObjects);
    expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 1 });
  });

  it("isAuthRequired should return true", () => {
    let gpioController = new GPIOController();
    gpioController.registerPlatformObjects(platformObjects);
    expect(gpioController.isAuthRequired()).toBe(true);
  });

  it("init", () => {
    let gpioController = new GPIOController();
    const gpioUtility = platformObjects.getGPIOUtility();
    const openForOutputSpy = jest.spyOn(gpioUtility, 'openForOutput');
    gpioController.registerPlatformObjects(platformObjects);
    gpioController.init();
    expect(openForOutputSpy).toHaveBeenCalledTimes(2);
  });

  describe("getCopyState", () => {
    it("", () => {
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.gpioState[3] = 0;
      gpioController.gpioState[5] = 1;
      gpioController.startTime = new Date();
      gpioController.endTime = new Date()
      gpioController.history = [
        { port: '5', state: 1, date: 2020 },
        { port: '3', state: 1, date: 2015 },
        { port: '3', state: 0, date: 2010 },
        { port: '5', state: 1, date: 2005 },
        { port: '3', state: 0, date: 2000 },
        { port: '3', state: 1, date: 1995 },
        { port: '3', state: 0, date: 1990 },
        { port: '5', state: 1, date: 1985 },
        { port: '5', state: 0, date: 1980 },
        { port: '5', state: 1, date: 1975 }
      ]
      let obj = {}
      gpioController.appendData(obj);
      expect(gpioController.getCopyState()).toStrictEqual({
        state: gpioController.gpioState,
        startTime: gpioController.startTime,
        endTime: gpioController.endTime,
        history: gpioController.history,
      });
    });
  });

  describe("appendData", () => {
    it("Pin(3):HIGH Pin(5):HIGH, startTime&endTime = new Date(), history = bunch of object list", () => {
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.gpioState[3] = 1;
      gpioController.gpioState[5] = 0;
      gpioController.startTime = new Date();
      gpioController.endTime = new Date()
      gpioController.history = [
        { port: '3', state: 1, date: 2020 },
        { port: '5', state: 1, date: 2019 },
        { port: '3', state: 0, date: 2018 },
        { port: '3', state: 1, date: 2017 },
        { port: '3', state: 0, date: 2016 },
        { port: '3', state: 1, date: 2015 },
        { port: '5', state: 0, date: 2014 },
        { port: '5', state: 1, date: 2013 },
        { port: '3', state: 0, date: 2012 },
        { port: '5', state: 1, date: 2011 }
      ]
      let obj = {}
      gpioController.appendData(obj);
      expect(obj.gpio).toStrictEqual({
        state: gpioController.gpioState,
        startTime: gpioController.startTime,
        endTime: gpioController.endTime,
        history: gpioController.history,
      });
    });
  });

  describe("handleMessage", () => {
    it("Parameters passing to handleMessage = {gpio: {port: '3',state: false}}", () => {
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: { port: '3', state: false } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 0, '5': 1 });
    });

    it("Parameters passing to handleMessage = {gpio: {port: '5',state: false}}", () => {
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: { port: '5', state: false } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 0 });
    });

    it("Parameters passing to handleMessage = {gpio: {port: '3',state: true}}", () => {
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: { port: '3', state: true } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 1 });
    });

    it("Parameters passing to handleMessage = {gpio: {port: '5',state: true}}", () => {
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.init();
      gpioController.handleMessage({ gpio: { port: '5', state: true } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 1 });
    });
  });

  describe("setGPIOPort", () => {
    it("Parameters passing to setGPIOPort = ('3', 1)", () => {
      let handler, obj;
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        handler = h;
        obj = o;
      });
      gpioController.init();
      gpioController.setGPIOPort('3', 1);
      expect(obj.gpio.state).toStrictEqual({ '3': 1, '5': 1 });
    });

    it("Parameters passing to setGPIOPort = ('5', 1)", () => {
      let handler, obj;
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        handler = h;
        obj = o;
      });
      gpioController.init();
      gpioController.setGPIOPort('5', 1);
      expect(obj.gpio.state).toStrictEqual({ '3': 1, '5': 1 });
    });

    it("Parameters passing to setGPIOPort = ('3', 0)", () => {
      let handler, obj;
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        handler = h;
        obj = o;
      });
      gpioController.init(); 
      gpioController.setGPIOPort('3', 0);
      expect(obj.gpio.state).toStrictEqual({ '3': 0, '5': 1 });
    });

    it("Parameters passing to setGPIOPort = ('5', 0)", () => {
      let handler, obj;
      let gpioController = new GPIOController();
      gpioController.registerPlatformObjects(platformObjects);
      gpioController.registerSendMessageCallback((h, o) => {
        handler = h;
        obj = o;
      });
      gpioController.init(); 
      gpioController.setGPIOPort('5', 0);
      expect(obj.gpio.state).toStrictEqual({ '3': 1, '5': 0 });
    });
  });
});