import { createLocalVue, mount, createWrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import componentUtility from '../../../src/components/Utility.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';
import { waitNT, waitRAF } from '../../testhelpers/Utils';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

describe('componentUtility', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
  });

  it('default values', () => {
    const defaultData = componentUtility.data();
    expect(defaultData).toStrictEqual({});
  });

  it('reboot operation when clicked to yes option', async () => {
    const wrapper = mount(componentUtility, {
      store,
      localVue,
    });
    const button = wrapper.findComponent({ ref: 'reboot' });
    button.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#rebootModalConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonDanger = $modal.find('.modal-content .btn-danger');
    expect(buttonDanger.text()).toBe('YES');
    buttonDanger.trigger('click');

    await waitNT(wrapper.vm);

    expect(actions.rebootDevice).toHaveBeenCalledTimes(1);
    wrapper.destroy();
  });

  it('reboot operation when clicked to no option', async () => {
    const wrapper = mount(componentUtility, {
      store,
      localVue,
    });
    const button = wrapper.findComponent({ ref: 'reboot' });
    button.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#rebootModalConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonSecondary = $modal.find('.modal-content .btn-secondary');
    expect(buttonSecondary.text()).toBe('NO');
    buttonSecondary.trigger('click');

    await waitNT(wrapper.vm);

    expect(actions.rebootDevice).toHaveBeenCalledTimes(1);
    wrapper.destroy();
  });

  it('reboot operation when clicked to × option', async () => {
    const wrapper = mount(componentUtility, {
      store,
      localVue,
    });
    const button = wrapper.findComponent({ ref: 'reboot' });
    button.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#rebootModalConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonClose = $modal.find('.modal-content .close');
    expect(buttonClose.text()).toBe('×');
    buttonClose.trigger('click');

    await waitNT(wrapper.vm);

    expect(actions.rebootDevice).toHaveBeenCalledTimes(1);
    wrapper.destroy();
  });
});
