import Vuex from "vuex"
import { shallowMount, createLocalVue, mount } from "@vue/test-utils"
import ComponentWithVuex from '../../src/components/SerialConsole.vue'
import BootstrapVue, { BButton } from 'bootstrap-vue'
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

  })
})