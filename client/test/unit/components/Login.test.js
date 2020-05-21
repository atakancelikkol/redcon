import { shallowMount, createLocalVue, mount, createWrapper } from "@vue/test-utils"
import Vuex from "vuex"
import componentWithVuex from '../../../src/components/Login.vue'
import { BootstrapVue } from 'bootstrap-vue'
import actions from '../../testhelpers/ActionsHelper.js'
import state from '../../testhelpers/StateHelper.js'

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
    expect(defaultData.username).toBe('')
    expect(defaultData.pass).toBe('')
    expect(defaultData.displayErrorMessage).toBe(false)
    expect(defaultData.eventFields).toMatchObject([
      { key: 'username', label: 'User Name' },
      { key: 'date', label: 'Login Date' },
      { key: 'activityDate', label: 'Last Activity Date' },

    ])
  })
  it('onEnterkey return', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    })
    const form = wrapper.findComponent({ ref: 'passForm' })
    form.trigger('keydown.up')
    expect(actions.loginUser).toHaveBeenCalledTimes(0)
    wrapper.destroy();
  })

  it('login button', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    })
    const button = wrapper.findComponent({ ref: 'login' })
    button.trigger('click')
    expect(actions.loginUser).toHaveBeenCalled()
    wrapper.destroy();
  })

  it('login on enter key', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    })
    const form = wrapper.findComponent({ ref: 'passForm' })
    form.trigger('keydown.enter')
    expect(actions.loginUser).toHaveBeenCalled()
    wrapper.destroy();
  })
  
  it('computed eventItems return []', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    })
    let tmp = state.receivedData.authHistory
    state.receivedData.authHistory = undefined
    expect(wrapper.vm.eventItems).toMatchObject([])
    state.receivedData.authHistory = tmp
    wrapper.destroy();
  })

  it('computed eventItems ', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    })
    let testHistory = [{
      username: "testUser",
      date:   new Date().toLocaleString()+" ( just now )",
      activityDate:  new Date().toLocaleString()+" ( just now )"
    }]

    state.receivedData.authHistory.history=[{
      username: "testUser",
      date: new Date(),
      activityDate: new Date()
    }]

    expect(wrapper.vm.eventItems).toMatchObject(testHistory)
    wrapper.destroy();
  })
})

