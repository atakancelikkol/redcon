import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import USBStorage from '../../../src/components/USBStorage.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';

const localVue = createLocalVue(); // localVue is a scoped Vue constructor

localVue.use(Vuex); // we tell Vue to use Vuex
localVue.use(BootstrapVue);

describe('USBStorage', () => {
  let store;

  beforeEach(() => { // We’re using beforeEach to ensure we have a clean store before each test
    store = new Vuex.Store({ // we make a mock store with our mock values
      actions, state,
    });
  });

  test('default values', () => {
    const defaultData = USBStorage.data();
    expect(defaultData.selectedFiles).toBeNull();
    expect(defaultData.currentDirectory).toBe('.');
    expect(defaultData.progressValue).toBe(-1);
    expect(defaultData.showUploadError).toBeFalsy();
    expect(defaultData.errorString).toBe('');
    expect(defaultData.createdFolderName).toBe('');
  });

  test('computed usbStatus', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    const statusTest = {};
    // is ready to be used
    state.receivedData.usb = { isAvailable: true, usbName: 'REDCON', mountedPath: 'PATH' };
    statusTest.usbName = state.receivedData.usb.usbName;
    statusTest.availability = `${statusTest.usbName} is ready to be used`;
    statusTest.mountedpath = state.receivedData.usb.mountedPath;
    expect(wrapper.vm.usbStatus).toEqual(statusTest);
    // USB is not ready
    state.receivedData.usb = {};
    statusTest.usbName = '----------------';
    statusTest.availability = 'USB is not ready';
    statusTest.mountedpath = '----------------';
    expect(wrapper.vm.usbStatus).toEqual(statusTest);
    wrapper.destroy();
  });

  test('computed isUsbDeviceAvailable', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // success
    state.receivedData.usb = { isAvailable: true };
    expect(wrapper.vm.isUsbDeviceAvailable).toBeTruthy();
    // fail
    state.receivedData.usb = {};
    expect(wrapper.vm.isUsbDeviceAvailable).toBeFalsy();
    wrapper.destroy();
  });

  test('computed ecuLedState', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    expect(wrapper.vm.ecuLedState).toEqual(state.receivedData.usb.kvmLedStateECU);
    wrapper.destroy();
  });

  test('computed rpiLedState', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    expect(wrapper.vm.rpiLedState).toEqual(state.receivedData.usb.rpiLedState);
    wrapper.destroy();
  });

  test('computed itemList', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // success
    state.receivedData.usb = { currentItems: ['item1', 'item2'] };
    expect(wrapper.vm.itemList).toEqual(['item1', 'item2']);
    // fail
    state.receivedData.usb = undefined;
    expect(wrapper.vm.itemList).toEqual([]);
    wrapper.destroy();
  });

  test('computed getDirectory', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // success
    state.receivedData.usb = { currentDirectory: 'dir' };
    expect(wrapper.vm.getDirectory).toEqual('dir');
    // fail
    state.receivedData.usb = undefined;
    expect(wrapper.vm.getDirectory).toEqual('');
    wrapper.destroy();
  });

  test('computed itemInfo', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // true
    state.receivedData.usb = { currentItemInfo: {} };
    expect(wrapper.vm.itemInfo).toEqual({});
    // false
    state.receivedData.usb = undefined;
    expect(wrapper.vm.itemInfo).toBeUndefined();
    wrapper.destroy();
  });

  test('computed usbError', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // true
    state.receivedData.usb = { usbErrorString: 'ERROR' };
    expect(wrapper.vm.usbError).toEqual('ERROR');
    // false
    state.receivedData.usb = undefined;
    expect(wrapper.vm.usbError).toBe('');
    wrapper.destroy();
  });

  test('if Toggle USB Device button is clicked, toggleUSBPort should be called', () => {
    const wrapper = mount(USBStorage, { store, localVue }); // we create a mock Vuex store and then pass it to Vue Test Utils
    const buttonClicked = wrapper.findComponent({ ref: 'buttonToggle' });
    buttonClicked.trigger('click');
    expect(actions.toggleUSBPort).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('if Detect USB Devices button is clicked, detectUSBDevice should be called ', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    const buttonClicked = wrapper.findComponent({ ref: 'buttonOpen' });
    buttonClicked.trigger('click');
    expect(actions.detectUSBDevice).toHaveBeenCalled();
    wrapper.destroy();
  });
});
