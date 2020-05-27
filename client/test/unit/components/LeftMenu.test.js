import { shallowMount, createLocalVue, mount, createWrapper } from "@vue/test-utils"
import Vuex from "vuex"
import componentWithVuex from '../../../src/components/LeftMenu.vue'
import { BootstrapVue } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import actions from '../../testhelpers/ActionsHelper.js'
import state from '../../testhelpers/StateHelper.js'


const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue);
localVue.use(VueRouter)
const router = new VueRouter()


describe("componentWithVuex", () => {
  let store
  beforeEach(() => {
    store = new Vuex.Store({
      actions, state
    })
  })

  it('logout button', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
      router
    })
    const button = wrapper.findComponent({ ref: 'logout' })
    button.trigger('click')
    expect(actions.logoutUser).toHaveBeenCalled()
    wrapper.destroy();

  
  })
})







