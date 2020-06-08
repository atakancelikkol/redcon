/* eslint-disable */
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import componentWithVuex from '../../../src/components/Utility.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';
import { BootstrapVue, BModal } from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

export const createContainer = (tag = 'div') => {
  const container = document.createElement(tag)
  document.body.appendChild(container)
  return container
}

//export const waitNT = ctx => new Promise(resolve => ctx.$nextTick(resolve))
//export const waitRAF = () => new Promise(resolve => requestAnimationFrame(resolve))

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

  it('reboot button when value is equal to true', () =>  {

    const wrapper = mount(componentWithVuex, {
      attachTo: createContainer(),
      propsData: {
        static: true,
      },
      store,
      localVue,
    });

    const button = wrapper.findComponent({ref: "reboot"});
    button.trigger('click');

    const button2 = wrapper.find('.modal-content .btn-danger');
    button2.trigger('click');
  
    expect(button2.text()).toBe('YES');
  
    expect(actions.rebootDevice).toHaveBeenCalledTimes(1);

    wrapper.destroy();
  });
});

/*it('reboot button when value is equal to true', () =>  {

  const wrapper = mount(BModal, {
    attachTo: createContainer(),
    propsData: {
      static: true,
      id: '__BVID__140___BV_modal_footer_t'
    },
    store,
    localVue,
  });

  const button = wrapper.find('.modal-content .btn');
  button.trigger('click');

  //expect(button.text()).toBe('YES');

  expect(actions.rebootDevice).toHaveBeenCalledTimes(1);

  wrapper.destroy();
}); */
