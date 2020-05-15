let actions
actions = {
  //mapActions
  openSerialDevice: jest.fn(),
  closeSerialDevice: jest.fn(),
  listSerialDevices: jest.fn(),
  writeSerialDevice: jest.fn(),
  writeKeySerialDevice: jest.fn(),
}
export default actions