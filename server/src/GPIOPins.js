const ServerConfig = require('./ServerConfig');

const raspberryPinDef = {
  // definitions for relays
  RELAY_POWER_PIN: 3,
  RELAY_CONTACT_PIN: 5,
  RELAY_WDG_PIN: 7,
  RELAY_FLASH2_PIN: 11,

  // definitions for kvm switch
  KVM_LED_RPI: 29,
  KVM_LED_ECU: 31,
  KVM_TOGGLE_PIN: 33,
};

const otherPinDef = {
  // definitions for relays
  RELAY_POWER_PIN: 100,
  RELAY_CONTACT_PIN: 101,
  RELAY_WDG_PIN: 105,
  RELAY_FLASH2_PIN: 106,
  // definitions for kvm switch
  KVM_LED_RPI: 102,
  KVM_LED_ECU: 103,
  KVM_TOGGLE_PIN: 104,
};

const GPIOPins = { raspberry: raspberryPinDef, other: otherPinDef };

module.exports = GPIOPins[ServerConfig.GPIOPinConfigName];
