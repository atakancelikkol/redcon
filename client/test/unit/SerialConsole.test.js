import { shallowMount, createLocalVue, mount, createWrapper } from "@vue/test-utils"
import Vuex from "vuex"
import componentWithVuex from '../../src/components/SerialConsole.vue'
import { BootstrapVue  } from 'bootstrap-vue'
import actions from '../helpers/ActionsHelper.js'
import state from '../helpers/StateHelper.js'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue);

describe("componentWithVuex", () => {
  let store
  beforeEach(() => {
    store = new Vuex.Store({
      actions, state
    })
  })

  it('default values', () => {

    const defaultData = componentWithVuex.data()
    expect(defaultData.baudRate).toBe(115200)
    expect(defaultData.currentSerialDevice).toBe(null)
    expect(defaultData.serialmsg).toBe('')
    expect(defaultData.selectedLogFile).toBe('')
    expect(defaultData.serialDeviceRate).toMatchObject([
      { value: 1200, text: '1200' },
      { value: 2400, text: '2400' },
      { value: 4800, text: '4800' },
      { value: 9600, text: '9600' },
      { value: 19200, text: '19200' },
      { value: 38400, text: '38400' },
      { value: 57600, text: '57600' },
      { value: 115200, text: '115200' },
      { value: 460800, text: '460800' },
      { value: 921600, text: '921600' },
      { value: 230400, text: '230400' },

    ])
  })

  it("click event for openSelectedDevice", () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    //button click event
    const button = wrapper.findComponent({ ref: 'buttonOpen' })
    button.trigger('click')
    expect(actions.openSerialDevice).toHaveBeenCalled()
    wrapper.destroy();
  })

  it("click event for closeSelectedDevice", () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    //button click event
    const button = wrapper.findComponent({ ref: 'buttonClose' })
    button.trigger('click')
    expect(actions.closeSerialDevice).toHaveBeenCalled()
    wrapper.destroy();
  })

  it("click event for writeSelectedDevice", () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    //button click event
    const button = wrapper.findComponent({ ref: 'buttonWrite' })
    button.trigger('click')
    expect(actions.writeSerialDevice).toHaveBeenCalled()
    expect(wrapper.vm.serialmsg).toBe(null)
    wrapper.destroy();
  })

  it("click event for openLogfile", () => {
    const mockedOpen = jest.fn();
    const originalOpen = window.open;
    window.open = mockedOpen;
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    const button = wrapper.findComponent({ ref: 'buttonOpenlog' })
    button.trigger('click')
    expect(mockedOpen).toHaveBeenCalled()
    const tmp = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    button.trigger('click')
    expect(mockedOpen).toHaveBeenCalled()
    process.env.NODE_ENV = tmp
    window.open = originalOpen;
    wrapper.destroy();
  })

  it("listSerialConsoleFiles", () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    expect(wrapper.vm.listSerialConsoleFiles).toMatchObject(state.receivedData.serial.serialFiles)
    
    const tmpReceivedData = state.receivedData
    state.receivedData = []
    expect(wrapper.vm.listSerialConsoleFiles).toMatchObject([])
    state.receivedData = tmpReceivedData
    wrapper.destroy();
  })

  it("keydown event for onEnterKey", () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    const form = wrapper.findComponent({ ref: 'serialSend' })
    form.trigger('keydown.enter')
    expect(actions.writeSerialDevice).toHaveBeenCalled()
    wrapper.destroy();
  })

  it("keydown event for onKeyDown", () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    const form = wrapper.findComponent({ ref: 'dataArea' })
    form.trigger('keydown.enter')
    expect(actions.writeKeySerialDevice).toHaveBeenCalled()
    wrapper.destroy();
  })
  
  it("updateInitialSelection", () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue
    })
    //there must be no currentSerialDevice
    wrapper.vm.updateInitialSelection()
    expect(wrapper.vm.currentSerialDevice).toBe(null)
    wrapper.destroy();
  })


})