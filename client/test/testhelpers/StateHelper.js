const state = {
  // mapState
  receivedData: {
    authHistory: {
      history: [],
    },
    serial: { ports: {}, portStatus: {}, serialFiles: {} },
  },
  serialData: {},
  user: {
    username: 'testuser',
    id: 'id',
    ip: '::1',
  },

};
export default state;
