import {
  createLocalVue, mount, createWrapper,
} from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import componentNetworkRuleTable from '../../../src/components/NetworkRuleTable.vue';
import { waitNT, waitRAF } from '../../testhelpers/Utils';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

describe('componentNetworkRuleTable', () => {
  it('addRule button', () => {
    const wrapper = mount(componentNetworkRuleTable, {
      localVue,
    });
    wrapper.setData({ currentRuleName: 'test' });
    wrapper.setData({ currentOption1: 'testOption1' });
    wrapper.setData({ currentOption2: 'testOption2' });
    wrapper.setData({ currentOption3: 'testOption3' });

    const button = wrapper.findComponent({ ref: 'addRule' });
    button.trigger('click');
    expect(wrapper.emitted().addRule).toStrictEqual([['test', 'testOption1', 'testOption2', 'testOption3']]);
    wrapper.destroy();
  });

  it('removeRule confirm option', async () => {
    const wrapper = mount(componentNetworkRuleTable, {
      localVue,
      propsData: {
        rules: [{
          deviceInternalPort: '3000',
          externalIp: '10.32.0.0',
          externalPort: '2000',
          name: 'test',
        }],
        ruleKeys: {
          ruleName: 'name',
          option1: 'deviceInternalPort',
          option2: 'externalIp',
          option3: 'externalPort',
        },
      },
    });

    const button = wrapper.findComponent({ ref: 'removeRule' });
    button.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#removeRuleConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonDanger = $modal.find('.modal-content .btn-danger');
    expect(buttonDanger.text()).toBe('YES');
    buttonDanger.trigger('click');

    await waitNT(wrapper.vm);

    expect(wrapper.emitted().removeRule).toStrictEqual([['test', '3000', '10.32.0.0', '2000']]);
    wrapper.destroy();
  });

  it('removeRule not confirm option', async () => {
    const wrapper = mount(componentNetworkRuleTable, {
      localVue,
      propsData: {
        rules: [{
          deviceInternalPort: '3000',
          externalIp: '10.32.0.0',
          externalPort: '2000',
          name: 'test',
        }],
        ruleKeys: {
          ruleName: 'name',
          option1: 'deviceInternalPort',
          option2: 'externalIp',
          option3: 'externalPort',
        },
      },
    });

    const button = wrapper.findComponent({ ref: 'removeRule' });
    button.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#removeRuleConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonDanger = $modal.find('.modal-content .btn-secondary');
    expect(buttonDanger.text()).toBe('NO');
    buttonDanger.trigger('click');

    await waitNT(wrapper.vm);

    expect(wrapper.emitted().removeRule).toStrictEqual(undefined);
    wrapper.destroy();
  });
});
