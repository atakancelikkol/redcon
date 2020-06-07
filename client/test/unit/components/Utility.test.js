import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import { BButton, BCard } from 'bootstrap-vue';
import componentWithVuex from '../../../src/components/Utility.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('componentWithVuex', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
  });

  it('default values', () => {
    const defaultData = componentWithVuex.data();
    expect(defaultData).toStrictEqual({});
  });

  it('reboot button when value is equal to true', () => new Promise((done) => {
    const $bvModal = {
      msgBoxConfirm: (CommandString) => {
        const msgCommandString = CommandString;
        console.log(msgCommandString);
        return new Promise((resolve) => {
          const value = true;
          resolve(value);
        });
      },
    };

    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
      mocks: {
        $bvModal,
      },
      stubs: {
        'b-button': BButton,
        'b-card': BCard,
      },
    });

    const button = wrapper.findComponent({ ref: 'reboot' });
    button.trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(actions.rebootDevice).toHaveBeenCalledTimes(1);
      wrapper.destroy();
      done();
    });
  }));

  it('reboot button when promise throw exception', () => new Promise((done) => {
    const $bvModal = {
      msgBoxConfirm: (CommandString) => {
        const msgCommandString = CommandString;
        console.log(msgCommandString);
        return new Promise((resolve, reject) => {
          const value = undefined;
          if (value === true) {
            resolve(value);
          } const err = 'error';
          reject(err);
        });
      },
    };

    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
      mocks: {
        $bvModal,
      },
      stubs: {
        'b-button': BButton,
        'b-card': BCard,
      },
    });

    const button = wrapper.findComponent({ ref: 'reboot' });
    button.trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(actions.rebootDevice).toHaveBeenCalledTimes(1);
      wrapper.destroy();
      done();
    });
  }));
});
