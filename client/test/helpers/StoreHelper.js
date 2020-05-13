import Vuex from "vuex"
import { BootstrapVue } from 'bootstrap-vue'
import { shallowMount, createLocalVue } from "@vue/test-utils"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue);


const store = new Vuex.Store({
  state: {
    //mapState
    receivedData: { serial: { serialFiles: {} } },
    serialData:{}
  },
  actions: {
    //mapActions
    openSerialDevice: jest.fn(),
    closeSerialDevice: jest.fn(),
    listSerialDevices: jest.fn(),
    writeSerialDevice: jest.fn(),
    writeKeySerialDevice: jest.fn(),

  },
})

export default store;