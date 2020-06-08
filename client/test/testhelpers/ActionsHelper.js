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
  // USBStorage
  toggleUSBPort: jest.fn(),
  detectUSBDevice: jest.fn(),
  listItemsUSBDevice: jest.fn(),
  deleteItemUSBDevice: jest.fn(),
  getItemInfoUSBDevice: jest.fn(),
  createFolderUSBDevice: jest.fn(),
};
export default actions;
