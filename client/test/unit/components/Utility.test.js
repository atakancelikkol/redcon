import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import componentWithVuex from '../../../src/components/Utility.vue';
import actions from '../../testhelpers/ActionsHelper.js';
import state from '../../testhelpers/StateHelper.js';

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

  it('reboot button when value is equal to true', (done) => {
    
    const $bvModal = {
      msgBoxConfirm: (CommandString, callback) => {
        let msgCommandString = CommandString
        console.log(msgCommandString)
        return new Promise((resolve, reject) => {
          let value = true
          resolve(value) })
      }
    }
    
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
      mocks: {
        $bvModal
      }
    });

    const button = wrapper.findComponent({ ref: 'reboot' });
    button.trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(actions.rebootDevice).toHaveBeenCalled();
      done()
    })
    
  });

  it('reboot button when promise throw exception', (done) => {
    const $bvModal = {
      msgBoxConfirm: (CommandString, callback) => {
        let msgCommandString = CommandString
        console.log(msgCommandString)
        return new Promise((resolve, reject) => {
          let err = 'error'
          reject(err) })
      }
    }
    
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
      mocks: {
        $bvModal
      }
    });

    const button = wrapper.findComponent({ ref: 'reboot' });
    button.trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(actions.rebootDevice).toHaveBeenCalled();
      done()
    })
  });
});

