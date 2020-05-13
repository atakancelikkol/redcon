import Vuex from "vuex"
import { shallowMount, createLocalVue, mount } from "@vue/test-utils"
import ComponentWithVuex from '../../src/components/SerialConsole.vue'
import  BootstrapVue, { BButton } from 'bootstrap-vue'

//import { mapState, mapActions } from "vuex";
import sinon from 'sinon'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue);

const store = new Vuex.Store({
  state: {
    //mapState
    receivedData: { serial: { serialFiles: {} } },

    serialmsg: 'msg',

    serialData: "asdasdasdasd",

    currentSerialDevice: null,

    baudRate: 115200
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

describe("ComponentWithVuex", () => {

 


  it('default baundRate', () => {

    const defaultData = ComponentWithVuex.data()
    expect(defaultData.baudRate).toBe(115200)
  })
  it('default currentSerialDevice', () => {

    const defaultData = ComponentWithVuex.data()
    expect(defaultData.currentSerialDevice).toBe(null)
  })








  it("click event for openSelectedDevice", () => {
    const openSelectedDeviceSpy = sinon.spy();
    const wrapper = mount(ComponentWithVuex,{
      store,
      localVue,
      methods: {
        openSelectedDevice: openSelectedDeviceSpy,
      },
      
    })
    //const methodStub = sinon.spy(wrapper.vm, 'openSelectedDevice');
  
    
    //click event
       const button = wrapper.findComponent(BButton)
       button.trigger('click') 


    //wrapper.vm.openSelectedDevice()
    


    expect(openSelectedDeviceSpy.called).toBe(true)
    //spy.should.have.been.calledWith(currentSerialDevice,baudRate)
  })
})