const state = {
  // mapState
  receivedData: {
    authHistory: {
      history: [],
    },
    serial: { ports: {}, portStatus: {}, serialFiles: {} },
    usb: {
      isAvailable: false,
      kvmLedStateECU: false,
      kvmLedStateRPI: false,
      mountedPath: '',
      usbName: '',
      device: '',
      currentDirectory: '.',
      currentItems: [],
      currentItemInfo: {},
      usbErrorString: '',
    },
  },
  serialData: {},
  user: {
    username: 'testuser',
    id: 'id',
    ip: '::1',
  },

};
export default state;
