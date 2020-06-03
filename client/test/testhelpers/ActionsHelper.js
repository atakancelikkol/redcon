let actions;
// mapActions
actions = {
  // SerialConsole
  openSerialDevice: jest.fn(),
  closeSerialDevice: jest.fn(),
  listSerialDevices: jest.fn(),
  writeSerialDevice: jest.fn(),
  writeKeySerialDevice: jest.fn(),
  // LeftMenu
  logoutUser: jest.fn(),
  // Login
  loginUser: jest.fn(),
};
export default actions;
