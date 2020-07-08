const ServerConfig = require('../../src/ServerConfig');

const tempGPIOConfigName = ServerConfig.GPIOPinConfigName;
ServerConfig.GPIOPinConfigName = 'raspberry';

const GPIOPins = require('../../src/GPIOPins');

describe('GPIOPins for raspberry configuration', () => {
  test('RELAY_POWER_PIN should be equal to 3', () => {
    expect(GPIOPins.RELAY_POWER_PIN).toBe(3);
  });

  test('RELAY_CONTACT_PIN should be equal to 3', () => {
    expect(GPIOPins.RELAY_CONTACT_PIN).toBe(5);
  });

  test('KVM_LED_RPI should be equal to 3', () => {
    expect(GPIOPins.KVM_LED_RPI).toBe(29);
  });

  test('KVM_LED_ECU should be equal to 3', () => {
    expect(GPIOPins.KVM_LED_ECU).toBe(31);
  });

  test('KVM_TOGGLE_PIN should be equal to 3', () => {
    expect(GPIOPins.KVM_TOGGLE_PIN).toBe(33);
  });
});

ServerConfig.GPIOPinConfigName = tempGPIOConfigName;
