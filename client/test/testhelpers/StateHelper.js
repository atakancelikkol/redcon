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
    gpio: {
      state: { 3: 1, 5: 1 },
      history: [{ port: {}, state: {}, date: {} }],
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
