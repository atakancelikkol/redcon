const GPIOController = require('../../src/GPIOController');
const rpio = require('rpio');

jest.mock('rpio');

describe("GPIOController", () => {
  it("Constructing gpioState of gpioController Instance", () => {
    let gpioController = new GPIOController({});
    expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 1 });
  });

  it("isAuthRequired should return true", () => {
    let gpioController = new GPIOController({});
    expect(gpioController.isAuthRequired()).toBe(true);
  });

  it("init", () => {
    let gpioController = new GPIOController({});
    gpioController.init();
    expect(rpio.open).toHaveBeenCalledTimes(2);
  });

  describe("getCopyState", () => {
    it("", () => {
      let gpioController = new GPIOController({});
      console.log(gpioController);
      gpioController.gpioState[3] = rpio.LOW;
      gpioController.gpioState[5] = rpio.HIGH;
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
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.gpioState[3] = rpio.HIGH;
      gpioController.gpioState[5] = rpio.LOW;
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
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.handleMessage({ gpio: { port: '3', state: false } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 0, '5': 1 });
    });

    it("Parameters passing to handleMessage = {gpio: {port: '5',state: false}}", () => {
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.handleMessage({ gpio: { port: '5', state: false } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 0 });
    });

    it("Parameters passing to handleMessage = {gpio: {port: '3',state: true}}", () => {
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.handleMessage({ gpio: { port: '3', state: true } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 1 });
    });

    it("Parameters passing to handleMessage = {gpio: {port: '5',state: true}}", () => {
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.handleMessage({ gpio: { port: '5', state: true } });
      expect(gpioController.gpioState).toStrictEqual({ '3': 1, '5': 1 });
    });
  });

  describe("setGPIOPort", () => {
    it("Parameters passing to setGPIOPort = ('3', rpio.HIGH)", () => {
      let handler, obj;
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.setGPIOPort('3', rpio.HIGH);
      expect(obj.gpio.state).toStrictEqual({ '3': 1, '5': 1 });
    });

    it("Parameters passing to setGPIOPort = ('5', rpio.HIGH)", () => {
      let handler, obj;
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.setGPIOPort('5', rpio.HIGH);
      expect(obj.gpio.state).toStrictEqual({ '3': 1, '5': 1 });
    });

    it("Parameters passing to setGPIOPort = ('3', rpio.LOW)", () => {
      let handler, obj;
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.setGPIOPort('3', rpio.LOW);
      expect(obj.gpio.state).toStrictEqual({ '3': 0, '5': 1 });
    });

    it("Parameters passing to setGPIOPort = ('5', rpio.LOW)", () => {
      let handler, obj;
      let gpioController = new GPIOController({
        sendMessageCallback: (h, o) => {
          handler = h;
          obj = o;
        }
      });
      gpioController.init(); // Init
      gpioController.setGPIOPort('5', rpio.LOW);
      expect(obj.gpio.state).toStrictEqual({ '3': 1, '5': 0 });
    });
  });
});