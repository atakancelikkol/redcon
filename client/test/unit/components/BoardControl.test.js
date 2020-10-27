import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import BoardControl from '../../../src/components/BoardControl.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';
import { waitNT } from '../../testhelpers/Utils';

const localVue = createLocalVue(); // localVue is a scoped Vue constructor

localVue.use(Vuex); // we tell Vue to use Vuex
localVue.use(BootstrapVue);

describe('BoardControl', () => {
  let store;

  beforeEach(() => { // We’re using beforeEach to ensure we have a clean store before each test
    store = new Vuex.Store({ // we make a mock store with our mock values
      actions, state,
    });
    jest.resetAllMocks();
    state.receivedData.gpio = undefined;
  });

  test('default value', () => {
    const defaultData = BoardControl.data();
    expect(defaultData.eventFields).toStrictEqual(['port', 'state', 'date']);
  });

  test('computed GPIOPorts', () => {
    const wrapper = mount(BoardControl, { store, localVue });
    // fail
    state.receivedData.gpio = undefined;
    expect(wrapper.vm.GPIOPorts).toStrictEqual([]);
    // success
    state.receivedData.gpio = { state: { a: 'somestring', b: 42, c: false }, history: [] };
    expect(wrapper.vm.GPIOPorts).toStrictEqual(['a', 'b', 'c']);
    wrapper.destroy();
  });

  test('computed eventItems', () => {
    const wrapper = mount(BoardControl, { store, localVue });
    // fail
    state.receivedData.gpio = undefined;
    expect(wrapper.vm.eventItems).toStrictEqual([]);
    // success
    state.receivedData.gpio = { state: {}, history: [{ port: 3, state: 0, date: (new Date(0)) }] };
    expect(wrapper.vm.eventItems).toStrictEqual([{ port: 'PORT #3', state: 'ON', date: new Date(0).toTimeString() }]);
    //
    state.receivedData.gpio = { state: {}, history: [{ port: 3, state: 1, date: (new Date(0)) }] };
    expect(wrapper.vm.eventItems).toStrictEqual([{ port: 'PORT #3', state: 'OFF', date: new Date(0).toTimeString() }]);
    wrapper.destroy();
  });

  test('method onSwitchClicked', async () => {
    state.receivedData.gpio = { state: { 3: 1, 5: 1 }, history: [] };
    const wrapper = mount(BoardControl, { store, localVue });
    const div = wrapper.findAll('#switch');
    expect(div.exists()).toBe(true);
    await waitNT(wrapper.vm);
    await div.trigger('click');
    expect(actions.changeGPIOPort).toHaveBeenCalledWith(expect.anything(), { gpioPort: '3', value: false });
    expect(actions.changeGPIOPort).toHaveBeenCalledWith(expect.anything(), { gpioPort: '5', value: false });
    // state did not changed, so expected values will be the same after a click
    await waitNT(wrapper.vm);
    await div.trigger('click');
    expect(actions.changeGPIOPort).toHaveBeenCalledWith(expect.anything(), { gpioPort: '3', value: false });
    expect(actions.changeGPIOPort).toHaveBeenCalledWith(expect.anything(), { gpioPort: '5', value: false });
    // state changed
    state.receivedData.gpio = { state: { 3: 0, 5: 0 }, history: [] };
    await waitNT(wrapper.vm);
    await div.trigger('click');
    expect(actions.changeGPIOPort).toHaveBeenCalledWith(expect.anything(), { gpioPort: '3', value: true });
    expect(actions.changeGPIOPort).toHaveBeenCalledWith(expect.anything(), { gpioPort: '5', value: true });
  });
});
