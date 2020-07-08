const ServerConfig = require('./ServerConfig')

const raspberryPinDef = {
  // definitions for relays
  RELAY_POWER_PIN: 3,
  RELAY_CONTACT_PIN: 5,

  // definitions for kvm switch
  KVM_LED_RPI: 29,
  KVM_LED_ECU: 31,
  KVM_TOGGLE_PIN: 33,
};

const otherPinDef = {
  // definitions for relays
  RELAY_POWER_PIN: 0,
  RELAY_CONTACT_PIN: 0,

  // definitions for kvm switch
  KVM_LED_RPI: 0,
  KVM_LED_ECU: 0,
  KVM_TOGGLE_PIN: 0,
};

const GPIOPins = { raspberry: raspberryPinDef , other: otherPinDef };

module.exports = GPIOPins[ServerConfig.GPIOPinConfigName];
