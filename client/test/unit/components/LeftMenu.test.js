import {
  createLocalVue, mount,
} from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import VueRouter from 'vue-router';
import componentLeftMenu from '../../../src/components/LeftMenu.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';


const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(VueRouter);
const router = new VueRouter();


describe('componentLeftMenu', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
  });

  it('logout button', () => {
    const wrapper = mount(componentLeftMenu, {
      store,
      localVue,
      router,
    });
    const button = wrapper.findComponent({ ref: 'logout' });
    button.trigger('click');
    expect(actions.logoutUser).toHaveBeenCalled();
    wrapper.destroy();
  });
});
