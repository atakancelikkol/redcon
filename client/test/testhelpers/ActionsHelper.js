const actions = {
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
  //Utility
  rebootDevice: jest.fn(), 
}
export default actions
