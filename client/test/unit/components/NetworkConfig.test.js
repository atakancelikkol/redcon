import {
  createLocalVue, mount, createWrapper,
} from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import componentNetworkConfig from '../../../src/components/NetworkConfig.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

describe('component NetworkConfig add rules', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
    jest.resetAllMocks();
  });


  it('updateNetworkSelection ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });


    wrapper.vm.updateNetworkSelection();
    expect(wrapper.vm.configuration).toStrictEqual({ externalInterfaceName: 'anotherTestInterface', internalInterfaceName: 'testInterface', internalInterfaceSubnet: '10.32.0.0/16' });
    wrapper.destroy();
  });

  it('acceptConfiguration ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });

    wrapper.vm.configuration = { internalInterfaceName: 'testInterface', externalInterfaceName: 'anotherTestInterface', internalInterfaceSubnet: '10.32.0.0/16' };
    wrapper.vm.acceptConfiguration();
    expect(actions.updateNetworkInterfaceConfiguration).toHaveBeenCalledWith(expect.anything(), {
      externalInterfaceName: 'anotherTestInterface',
      internalInterfaceName: 'testInterface',
      internalInterfaceSubnet: '10.32.0.0/16',
    });
    wrapper.destroy();
  });

  it('acceptConfiguration invalid subnet', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    wrapper.vm.configuration = { internalInterfaceName: 'testInterface', externalInterfaceName: 'anotherTestInterface', internalInterfaceSubnet: 'invalidSubnet' };
    wrapper.vm.acceptConfiguration();
    expect(actions.updateNetworkInterfaceConfiguration).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('addTcpIntToExtRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.addTcpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addTcpIntToExtNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      deviceInternalPort: '2000',
      externalIp: '10.32.0.0',
      externalPort: '3000',
      name: 'testRule',
    });
    wrapper.destroy();
  });

  it('addTcpIntToExtRule invalid port ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = 'invalidPort';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.addTcpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addTcpIntToExtNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('addTcpExtToIntRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.addTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addTcpExtToIntNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      deviceExternalPort: '2000',
      internalIp: '10.32.0.0',
      internalPort: '3000',
      name: 'testRule',
    });
    wrapper.destroy();
  });

  it('addTcpExtToIntRule invalid Ip', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = 'invalidIp';
    const currentOption3 = '3000';

    wrapper.vm.addTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addTcpExtToIntNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('addUdpExtToIntRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.addUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addUdpExtToIntNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      externalPort: '2000',
      internalIp: '10.32.0.0',
      internalPort: '3000',
      name: 'testRule',
    });
    wrapper.destroy();
  });

  it('addUdpExtToIntRule invalid Port', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = 'invalidPort';

    wrapper.vm.addUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addUdpExtToIntNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('addUdpIntToExtRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.addUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addUdpIntToExtNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      internalPort: '2000',
      externalIp: '10.32.0.0',
      externalPort: '3000',
      name: 'testRule',
    });
    wrapper.destroy();
  });

  it('addUdpIntToExtRule invalid Port', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = 'invalidPort';

    wrapper.vm.addUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.addUdpIntToExtNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });
});

describe('component NetworkConfig remove rules', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
    jest.resetAllMocks();
  });


  it('removeTcpIntToExtRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeTcpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeTcpIntToExtNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      deviceInternalPort: '2000',
      externalIp: '10.32.0.0',
      externalPort: '3000',
    });
    wrapper.destroy();
  });


  it('removeTcpIntToExtRule invalid port ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = 'invalidPort';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeTcpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeTcpIntToExtNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('removeTcpExtToIntRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeTcpExtToIntNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      deviceExternalPort: '2000',
      internalIp: '10.32.0.0',
      internalPort: '3000',
    });
    wrapper.destroy();
  });


  it('removeTcpExtToIntRule invalid port ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = 'invalidPort';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeTcpExtToIntNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('removeUdpIntToExtRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeUdpIntToExtNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      internalPort: '2000',
      externalIp: '10.32.0.0',
      externalPort: '3000',
    });
    wrapper.destroy();
  });


  it('removeUdpIntToExtRule invalid port ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = 'invalidPort';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeUdpIntToExtNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('removeUdpExtToIntRule ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = '2000';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeUdpExtToIntNetworkRule).toHaveBeenCalledWith(expect.anything(), {
      externalPort: '2000',
      internalIp: '10.32.0.0',
      internalPort: '3000',
    });
    wrapper.destroy();
  });


  it('removeUdpExtToIntRule invalid port ', () => {
    const wrapper = mount(componentNetworkConfig, {
      store,
      localVue,
    });
    const currentRuleName = 'testRule';
    const currentOption1 = 'invalidPort';
    const currentOption2 = '10.32.0.0';
    const currentOption3 = '3000';

    wrapper.vm.removeUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3);
    expect(actions.removeUdpExtToIntNetworkRule).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });
});


describe('component NetworkConfig paramcheck', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
    jest.resetAllMocks();
  });
});
