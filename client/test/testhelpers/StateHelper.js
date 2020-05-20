let state
state = {
  //mapState
  receivedData: {
    authHistory: {
      history: []
    }, 
    serial: { ports: {}, portStatus: {}, serialFiles: {} }
  },
  serialData: {},
  user: { username: 'testuser' },

}
export default state