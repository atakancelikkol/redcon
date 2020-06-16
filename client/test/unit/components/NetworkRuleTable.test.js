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
    wrapper.setData({ currentRuleName: 'testRule' });
    wrapper.setData({ currentOption1: '2000' });
    wrapper.setData({ currentOption2: '10.32.0.0' });
    wrapper.setData({ currentOption3: '3000' });

    const button = wrapper.findComponent({ ref: 'addRule' });
    button.trigger('click');
    expect(wrapper.emitted().addRule).toStrictEqual([['testRule', '2000', '10.32.0.0', '3000']]);
    wrapper.destroy();
  });

  it('addRule button invalid port', () => {
    const wrapper = mount(componentNetworkRuleTable, {
      localVue,
    });
    wrapper.setData({ currentRuleName: 'testRule' });
    wrapper.setData({ currentOption1: 'invalidPort' });
    wrapper.setData({ currentOption2: '10.32.0.0' });
    wrapper.setData({ currentOption3: '3000' });

    const button = wrapper.findComponent({ ref: 'addRule' });
    button.trigger('click');
    expect(wrapper.emitted().addRule).toStrictEqual(undefined);
    wrapper.destroy();
  });

  it('addRule button invalid ıp', () => {
    const wrapper = mount(componentNetworkRuleTable, {
      localVue,
    });
    wrapper.setData({ currentRuleName: 'testRule' });
    wrapper.setData({ currentOption1: '2000' });
    wrapper.setData({ currentOption2: '10.asd.0.0' });
    wrapper.setData({ currentOption3: '3000' });

    const button = wrapper.findComponent({ ref: 'addRule' });
    button.trigger('click');
    expect(wrapper.emitted().addRule).toStrictEqual(undefined);

    wrapper.setData({ currentOption2: '10.32.0.0.0' });
    const anotherbutton = wrapper.findComponent({ ref: 'addRule' });
    anotherbutton.trigger('click');
    expect(wrapper.emitted().addRule).toStrictEqual(undefined);
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

describe('component NetworkRuleTable paramcheck', () => {
   it('normalizeString ', () => {
    const wrapper = mount(componentNetworkRuleTable, {
        localVue,
    });
    const notString = 5;
    expect(wrapper.vm.normalizeString(notString)).toStrictEqual('');
    let testString = 't/[/e[\_s]+/\+t' // eslint-disable-line
    expect(wrapper.vm.normalizeString(testString)).toStrictEqual('t e s t');
    testString = 'tooLongTestStringOverThirtyCharacters';
    expect(wrapper.vm.normalizeString(testString)).toStrictEqual('tooLongTestStringOverThirtyCha');
    wrapper.destroy();
  });
});