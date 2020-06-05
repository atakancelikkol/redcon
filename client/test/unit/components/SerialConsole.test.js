import {
  createLocalVue, mount,
} from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import componentWithVuex from '../../../src/components/SerialConsole.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);


describe('componentWithVuex else branchs', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
  });

  it('keydown event for not enter onEnterKey', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const form = wrapper.findComponent({ ref: 'serialSend' });
    form.trigger('keydown.up');
    expect(actions.writeSerialDevice).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('keydown event for ignore ctrl-shift-alt, onKeyDown', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const form = wrapper.findComponent({ ref: 'dataArea' });
    form.trigger('keydown', {
      keyCode: 16,
    });
    expect(actions.writeKeySerialDevice).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  it('computed serialDeviceList return []', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    expect(wrapper.vm.serialDeviceList).toMatchObject([]);
    wrapper.destroy();
  });

  it('computed listSerialConsoleFiles return []', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    state.receivedData.serial = undefined;
    expect(wrapper.vm.listSerialConsoleFiles).toMatchObject([]);
    wrapper.destroy();
  });
});

describe('componentWithVuex', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      actions, state,
    });
  });

  it('default values', () => {
    const defaultData = componentWithVuex.data();
    expect(defaultData.baudRate).toBe(115200);
    expect(defaultData.currentSerialDevice).toBe(null);
    expect(defaultData.serialmsg).toBe('');
    expect(defaultData.selectedLogFile).toBe('');
    expect(defaultData.serialDeviceRate).toMatchObject([
      { value: 1200, text: '1200' },
      { value: 2400, text: '2400' },
      { value: 4800, text: '4800' },
      { value: 9600, text: '9600' },
      { value: 19200, text: '19200' },
      { value: 38400, text: '38400' },
      { value: 57600, text: '57600' },
      { value: 115200, text: '115200' },
      { value: 460800, text: '460800' },
      { value: 921600, text: '921600' },
      { value: 230400, text: '230400' },

    ]);
  });

  it('click event for openSelectedDevice', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const button = wrapper.findComponent({ ref: 'buttonOpen' });
    button.trigger('click');
    expect(actions.openSerialDevice).toHaveBeenCalled();
    wrapper.destroy();
  });

  it('click event for closeSelectedDevice', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const button = wrapper.findComponent({ ref: 'buttonClose' });
    button.trigger('click');
    expect(actions.closeSerialDevice).toHaveBeenCalled();
    wrapper.destroy();
  });

  it('click event for writeSelectedDevice', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    wrapper.vm.serialmsg = 'testmsg';
    const testmsg = wrapper.vm.serialmsg + String.fromCharCode(13);
    const button = wrapper.findComponent({ ref: 'buttonWrite' });
    button.trigger('click');
    expect(actions.writeSerialDevice).toHaveBeenCalledWith(expect.anything(), { devicePath: null, serialCmd: testmsg });
    expect(wrapper.vm.serialmsg).toBe(null);
    wrapper.destroy();
  });

  it('click event for openLogfile', () => {
    const mockedOpen = jest.fn();
    const originalOpen = window.open;
    window.open = mockedOpen;
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const button = wrapper.findComponent({ ref: 'buttonOpenlog' });
    button.trigger('click');
    expect(mockedOpen).toHaveBeenCalled();
    const tmp = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    button.trigger('click');
    expect(mockedOpen).toHaveBeenCalled();
    process.env.NODE_ENV = tmp;
    window.open = originalOpen;
    wrapper.destroy();
  });

  it('keydown event for serialSend onEnterKey', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const form = wrapper.findComponent({ ref: 'serialSend' });
    form.trigger('keydown.enter');
    expect(actions.writeSerialDevice).toHaveBeenCalled();
    wrapper.destroy();
  });

  it('keydown event for printable characters, onKeyDown', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const form = wrapper.findComponent({ ref: 'dataArea' });
    form.trigger('keydown', {
      key: 'a',

    });
    expect(actions.writeKeySerialDevice).toHaveBeenCalledWith(expect.anything(),
      {
        charCode: 97, ctrlKey: false, devicePath: null, keyCode: 0, shiftKey: false,
      });
    wrapper.destroy();
  });


  it('keydown event for dataArea enter, onKeyDown', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const form = wrapper.findComponent({ ref: 'dataArea' });
    form.trigger('keydown.enter');
    expect(actions.writeKeySerialDevice).toHaveBeenCalled();
    wrapper.destroy();
  });

  it('computed serialDeviceList', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    const deviceListTest = [
      {
        text: 'testCom (Test Manuf) [closed]',
        value: 'testCom',
      },
    ];
    state.receivedData.serial = {
      ports: [{ path: 'testCom', manufacturer: 'Test Manufacturer' }],
      portStatus:
      {
        testCom: { isOpen: false },
      },
      serialFiles: {},
    };
    expect(wrapper.vm.serialDeviceList).toMatchObject(deviceListTest);
    wrapper.destroy();
  });

  it('computed listSerialConsoleFiles', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    state.receivedData.serial = { ports: {}, portStatus: {}, serialFiles: 'Test.txt' };
    expect(wrapper.vm.listSerialConsoleFiles).toBe('Test.txt');
    wrapper.destroy();
  });

  it('method updateInitialSelection', () => {
    const wrapper = mount(componentWithVuex, {
      store,
      localVue,
    });
    state.receivedData.serial = {
      ports: [{ path: 'testCom', manufacturer: 'Test Manufacturer' }],
      portStatus:
      {
        testCom: { isOpen: false },
      },
      serialFiles: {},
    };
    wrapper.vm.updateInitialSelection();
    expect(wrapper.vm.currentSerialDevice).toBe('testCom');

    state.receivedData.serial = {
      ports: [{ path: 'testCom', manufacturer: 'Test Manufacturer' }, { path: 'testCom2', manufacturer: 'Test Manufacturer2' }],
      portStatus:
      {
        testCom: { isOpen: false },
        testCom2: { isOpen: true },
      },
      serialFiles: {},
    };
    wrapper.vm.updateInitialSelection();
    expect(wrapper.vm.currentSerialDevice).toBe('testCom2');
  });
});
