import Vuex from "vuex"
import { shallowMount, createLocalVue, mount, createWrapper } from "@vue/test-utils"
import ComponentWithVuex from '../../src/components/SerialConsole.vue'
import {BootstrapVue, BButton} from 'bootstrap-vue'
import sinon from 'sinon'
import store from '../helpers/StoreHelper.js'


const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue);

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
    const wrapper = mount(ComponentWithVuex, {
      store,
      localVue,
      methods: {
        openSelectedDevice: openSelectedDeviceSpy,
      },
    })
    //click event
    const button = wrapper.findComponent(BButton)
    button.trigger('click')
    expect(openSelectedDeviceSpy.called).toBe(true)
    wrapper.destroy();
  })

  

  it("click event for writeSelectedDevice", () => {
    const writeSelectedDeviceSpy = sinon.spy();
    const wrapper = mount(ComponentWithVuex, {
      store,
      localVue,
      attachToDocument: true,
      methods: {
        writeSelectedDevice: writeSelectedDeviceSpy,
      },
    })

    const defaultData = ComponentWithVuex.data()
        
    //click event, finding button with id
    const writeElement = document.getElementById('button-write');
    expect(writeElement).toBeDefined();
    const writeWrapper = createWrapper(writeElement);
    writeWrapper.trigger('click');
    //const button = wrapper.find('#button-write')
    //button.trigger('click')
    //expect(openSelectedDeviceSpy.called).toBe(true)
    expect(writeSelectedDeviceSpy.called).toBe(true)
    expect(defaultData.serialmsg).toBe("")
  })


})