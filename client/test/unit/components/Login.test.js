import {
  createLocalVue, mount,
} from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import componentLogin from '../../../src/components/Login.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

describe('componentLogin', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
  });

  it('default values', () => {
    const defaultData = componentLogin.data();
    expect(defaultData.username).toBe('');
    expect(defaultData.pass).toBe('');
    expect(defaultData.displayErrorMessage).toBe(false);
    expect(defaultData.eventFields).toMatchObject([
      { key: 'username', label: 'User Name' },
      { key: 'date', label: 'Login Date' },
      { key: 'activityDate', label: 'Last Activity Date' },

    ]);
  });

  it('onEnterkey return', () => {
    const wrapper = mount(componentLogin, {
      store,
      localVue,
    });
    const form = wrapper.findComponent({ ref: 'passForm' });
    form.trigger('keydown.up');
    expect(actions.loginUser).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('login button', () => {
    const wrapper = mount(componentLogin, {
      store,
      localVue,
    });
    const button = wrapper.findComponent({ ref: 'login' });
    button.trigger('click');
    expect(actions.loginUser).toHaveBeenCalled();
    wrapper.destroy();
  });

  it('login on enter key', () => {
    const wrapper = mount(componentLogin, {
      store,
      localVue,
    });
    const form = wrapper.findComponent({ ref: 'passForm' });
    form.trigger('keydown.enter');
    expect(actions.loginUser).toHaveBeenCalled();
    wrapper.destroy();
  });

  it('computed eventItems return []', () => {
    const wrapper = mount(componentLogin, {
      store,
      localVue,
    });
    const tmp = state.receivedData.authHistory;
    state.receivedData.authHistory = undefined;
    expect(wrapper.vm.eventItems).toMatchObject([]);
    state.receivedData.authHistory = tmp;
    wrapper.destroy();
  });

  it('computed eventItems ', () => {
    const wrapper = mount(componentLogin, {
      store,
      localVue,
    });
    const newDate = new Date();
    const testHistory = [{
      username: 'testUser',
      date: `${newDate.toLocaleString()} ( just now )`,
      activityDate: `${newDate.toLocaleString()} ( just now )`,
    }];

    state.receivedData.authHistory.history = [{
      username: 'testUser',
      date: newDate,
      activityDate: newDate,
    }];

    expect(wrapper.vm.eventItems).toMatchObject(testHistory);
    wrapper.destroy();
  });

  it('watch user() ', () => new Promise((done) => {
    let routePath = '';
    localVue.prototype.$router = {
      push: (param) => {
        routePath = param.path;
      },
    };
    const wrapper = mount(componentLogin, {
      store,
      localVue,
    });
    state.user = ({
      username: 'testuser2',
      id: 'id',
      ip: '::1',
    });
    wrapper.vm.$nextTick(() => {
      expect(routePath).toBe('/');
      done();
    });
  }));
});
