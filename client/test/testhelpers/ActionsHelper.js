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
  // Register
  registerUser: jest.fn(),
  // USBStorage
  toggleUSBPort: jest.fn(),
  detectUSBDevice: jest.fn(),
  listItemsUSBDevice: jest.fn(),
  deleteItemUSBDevice: jest.fn(),
  getItemInfoUSBDevice: jest.fn(),
  createFolderUSBDevice: jest.fn(),
  formatUSBDevice: jest.fn(),
  // Utility
  rebootDevice: jest.fn(),
  // BoardControl
  changeGPIOPort: jest.fn(),
  // NetworkConfig
  updateNetworkInterfaceConfiguration: jest.fn(),
  addUdpExtToIntNetworkRule: jest.fn(),
  removeUdpExtToIntNetworkRule: jest.fn(),
  addUdpIntToExtNetworkRule: jest.fn(),
  removeUdpIntToExtNetworkRule: jest.fn(),
  addTcpExtToIntNetworkRule: jest.fn(),
  removeTcpExtToIntNetworkRule: jest.fn(),
  addTcpIntToExtNetworkRule: jest.fn(),
  removeTcpIntToExtNetworkRule: jest.fn(),
};
export default actions;
