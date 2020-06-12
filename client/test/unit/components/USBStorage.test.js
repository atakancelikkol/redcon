/* eslint-disable max-classes-per-file */
import { mount, createLocalVue, createWrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import { BootstrapVue } from 'bootstrap-vue';
import USBStorage from '../../../src/components/USBStorage.vue';
import actions from '../../testhelpers/ActionsHelper';
import state from '../../testhelpers/StateHelper';
import { waitNT, waitRAF } from '../../testhelpers/Utils';

const localVue = createLocalVue(); // localVue is a scoped Vue constructor

localVue.use(Vuex); // we tell Vue to use Vuex
localVue.use(BootstrapVue);

describe('USBStorage', () => {
  let store;

  beforeEach(() => { // We’re using beforeEach to ensure we have a clean store before each test
    store = new Vuex.Store({ // we make a mock store with our mock values
      actions, state,
    });
    jest.resetAllMocks();
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

  test('if Toggle USB Device button is clicked, toggleUSBPort should be called', async () => {
    const wrapper = mount(USBStorage, { store, localVue }); // we create a mock Vuex store and then pass it to Vue Test Utils
    const buttonClicked = wrapper.findComponent({ ref: 'buttonToggle' });
    await buttonClicked.trigger('click');
    expect(actions.toggleUSBPort).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('if Detect USB Devices button is clicked, detectUSBDevice should be called ', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    const buttonClicked = wrapper.findComponent({ ref: 'buttonOpen' });
    await buttonClicked.trigger('click');
    expect(actions.detectUSBDevice).toHaveBeenCalled();
    wrapper.destroy();
  });

  test(' of mounted listItemsUSBDevice control', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    expect(actions.listItemsUSBDevice).toHaveBeenCalledTimes(1);
    expect(actions.listItemsUSBDevice.mock.calls[0][1]).toStrictEqual({ path: '.' });
    wrapper.destroy();
  });

  test('of watch isUsbDeviceAvailable', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    wrapper.setData({ currentDirectory: 'mockDirectory' });
    state.receivedData.usb = {
      isAvailable: true,
    };
    expect(actions.listItemsUSBDevice).toHaveBeenCalledTimes(1);

    // const waitNT = (ctx) => new Promise((resolve) => ctx.$nextTick(resolve));
    // await waitNT(wrapper.vm);
    await wrapper.vm.$nextTick();
    expect(actions.listItemsUSBDevice).toHaveBeenCalledTimes(2);
    expect(actions.listItemsUSBDevice.mock.calls[1][1]).toStrictEqual({ path: 'mockDirectory' });
    wrapper.destroy();
  });

  test('if directory link is clicked, selectDirectory method is called', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // fullPath: true
    state.receivedData.usb = { currentItems: [{ name: 'name', isDirectory: true, fullPath: true }] };
    await waitNT(wrapper.vm);
    const linkClicked = wrapper.findComponent({ ref: 'linkDir' });
    await linkClicked.trigger('click');
    expect(wrapper.vm.currentDirectory).toMatch('name');
    // fullPath: false
    state.receivedData.usb = { currentItems: [{ name: 'name', isDirectory: true, fullPath: false }] };
    await waitNT(wrapper.vm);
    await linkClicked.trigger('click');
    expect(wrapper.vm.currentDirectory).toMatch('/name');
    //
    expect(actions.listItemsUSBDevice).toHaveBeenCalledTimes(4);
    wrapper.destroy();
  });

  test('if Info button is clicked, onInfoButtonClicked method is called', async () => {
    state.receivedData.usb = { currentItems: [{ fullPath: false }] };
    const wrapper = mount(USBStorage, { store, localVue });
    const buttonClicked = wrapper.findComponent({ ref: 'buttonInfo' });
    await buttonClicked.trigger('click');
    expect(actions.getItemInfoUSBDevice).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('if Download is clicked, onDownloadFileClicked method is called', async () => {
    state.receivedData.usb = { currentItems: [{ name: 'name', isDirectory: false, fullPath: true }] };
    //
    const mockedOpen = jest.fn();
    const originalOpen = window.open;
    window.open = mockedOpen;
    //
    const wrapper = mount(USBStorage, { store, localVue });
    const buttonClicked = wrapper.findComponent({ ref: 'buttonDownload' });
    await buttonClicked.trigger('click');
    expect(mockedOpen).toHaveBeenCalled();
    //
    window.open = originalOpen;
    wrapper.destroy();
  });

  test('if create folder modal calls createFolderUSBDevice', () => new Promise((done) => {
    const wrapper = mount(USBStorage, { store, localVue });
    const modal = wrapper.findComponent({ ref: 'modal' });
    modal.vm.$emit('ok');
    wrapper.vm.$nextTick(() => {
      try {
        expect(actions.createFolderUSBDevice).toHaveBeenCalled();
        done();
      } catch (error) {
        done(error);
      }
    });
    wrapper.destroy();
  }));

  test('if Upload is clicked, onUploadClicked method is called(fail cases)', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    const buttonClicked = wrapper.findComponent({ ref: 'buttonUpload' });
    // this.isUsbDeviceAvailable === false
    wrapper.vm.showUploadError = true;
    state.receivedData.usb = { isAvailable: false };
    await waitNT(wrapper.vm);
    await buttonClicked.trigger('click');
    expect(wrapper.vm.showUploadError).toBeTruthy();
    // this.selectedFiles.length === 0
    wrapper.vm.showUploadError = true;
    state.receivedData.usb = { isAvailable: true };
    wrapper.vm.selectedFiles = [];
    await waitNT(wrapper.vm);
    await buttonClicked.trigger('click');
    expect(wrapper.vm.showUploadError).toBeTruthy();
    // success
    wrapper.vm.showUploadError = true;
    state.receivedData.usb = { isAvailable: true };
    //
    const file = new File([''], 'fileName');
    wrapper.vm.selectedFiles = [file];
    await waitNT(wrapper.vm);
    await buttonClicked.trigger('click');
    expect(wrapper.vm.showUploadError).toBeFalsy();
    wrapper.destroy();
  });

  test('if Upload is clicked, onUploadClicked method is called(success case)', async () => {
    const mockAppend = jest.fn();
    class MockFormData { // eslint-disable-line
      append(...args) { // eslint-disable-line
        mockAppend(...args); // eslint-disable-line
      } // eslint-disable-line
    } // eslint-disable-line
    global.FormData = MockFormData; // eslint-disable-line

    const mockUploadAddEventListener = jest.fn();
    const mockAddEventListener = jest.fn();
    const mockOpen = jest.fn();
    const mockSend = jest.fn();
    class MockXMLHttpRequest {
      constructor() {
        this.upload = {
          addEventListener(p1, p2) {
            mockUploadAddEventListener(p1, p2);
          },
        };
      }

      addEventListener(p1, p2) {
        mockAddEventListener(p1, p2);
      }

      open(p1, p2) {
        mockOpen(p1, p2);
      }

      send(p1) {
        mockSend(p1);
      }
    }
    global.XMLHttpRequest = MockXMLHttpRequest;

    const wrapper = mount(USBStorage, { store, localVue });
    wrapper.vm.getEndPoint = () => 'mockUri';
    const buttonClicked = wrapper.findComponent({ ref: 'buttonUpload' });
    wrapper.setData({ currentDirectory: 'mockDirectory' });
    state.receivedData.usb = { isAvailable: true };

    const file = new File([''], 'mockFileName');
    wrapper.vm.selectedFiles = [file];
    await waitNT(wrapper.vm);
    await buttonClicked.trigger('click');
    //
    expect(mockAppend).toHaveBeenCalledTimes(2);
    expect(mockAppend).toHaveBeenNthCalledWith(1, 'uploads', file, 'mockFileName');
    expect(mockAppend).toHaveBeenNthCalledWith(2, 'currentDirectory', 'mockDirectory');
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockAddEventListener.mock.calls[0][0]).toBe('load');
    expect(typeof mockAddEventListener.mock.calls[0][1]).toBe('function');
    expect(mockUploadAddEventListener).toHaveBeenCalledTimes(4);
    expect(mockUploadAddEventListener.mock.calls[0][0]).toBe('progress');
    expect(mockUploadAddEventListener.mock.calls[1][0]).toBe('load');
    expect(mockUploadAddEventListener.mock.calls[2][0]).toBe('error');
    expect(mockUploadAddEventListener.mock.calls[3][0]).toBe('abort');
    expect(mockOpen).toHaveBeenCalledWith('POST', 'mockUri/uploadFileToUsbDevice');
    expect(mockSend).toHaveBeenCalledWith(new MockFormData());
    wrapper.destroy();
  });

  test('eventListenerLoad', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // oReq.status !== 200
    wrapper.showUploadError = false;
    let oreq = { status: 300, responseText: 'text' };
    wrapper.vm.eventListenerLoad(oreq);
    expect(wrapper.vm.showUploadError).toBeTruthy();
    expect(wrapper.vm.errorString).toBe('text');
    // else
    oreq = { status: 200, responseText: 'text' };
    wrapper.vm.eventListenerLoad(oreq);
    expect(wrapper.vm.showUploadError).toBeFalsy();
    expect(wrapper.vm.errorString).toBe('');
    wrapper.destroy();
  });

  test('uploadEventListenerProgress', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // mock parseInt
    const tmpParseInt = parseInt;
    parseInt = jest.fn(); // eslint-disable-line
    // evt.lengthComputable
    let evt = { lengthComputable: true, loaded: 10, total: 2 };
    wrapper.vm.uploadEventListenerProgress(evt);
    expect(parseInt).toHaveBeenCalled();
    // else
    evt = { lengthComputable: false, loaded: 10, total: 2 };
    wrapper.vm.uploadEventListenerProgress(evt);
    expect(wrapper.vm.progressValue).toBe(50);
    //
    parseInt = tmpParseInt; // eslint-disable-line
    wrapper.destroy();
  });

  test('uploadEventListenerLoad ', () => {
    const wrapper = mount(USBStorage, {
      store,
      localVue,
    });
    wrapper.setData({ progressValue: 100 });
    expect(wrapper.vm.progressValue).toBe(100);
    wrapper.vm.uploadEventListenerLoad();
    expect(wrapper.vm.progressValue).toBe(-1);
    wrapper.destroy();
  });

  test('uploadEventListenerError ', () => {
    const wrapper = mount(USBStorage, {
      store,
      localVue,
    });
    wrapper.vm.uploadEventListenerError('error');
    expect(wrapper.vm.showUploadError).toBeTruthy();
    expect(wrapper.vm.progressValue).toBe(-1);
    wrapper.destroy();
  });

  test('uploadEventListenerAbort ', () => {
    const wrapper = mount(USBStorage, {
      store,
      localVue,
    });
    wrapper.vm.uploadEventListenerAbort('error');
    expect(wrapper.vm.showUploadError).toBeTruthy();
    expect(wrapper.vm.progressValue).toBe(-1);
    wrapper.destroy();
  });

  test('onDeleteItemClicked "YES" ', async () => {
    state.receivedData.usb = { currentItems: [{ name: 'mockName', fullPath: false }] };
    const wrapper = mount(USBStorage, {
      store,
      localVue,
    });
    wrapper.setData({ currentDirectory: 'mockDirectory' });
    const deleteButton = wrapper.findComponent({ ref: 'buttonDelete' });
    deleteButton.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#deleteItemModalConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonDanger = $modal.find('.modal-content .btn-danger');
    expect(buttonDanger.text()).toBe('YES');
    await buttonDanger.trigger('click');
    // await waitNT(wrapper.vm);

    expect(actions.deleteItemUSBDevice).toHaveBeenCalledTimes(1);
    expect(actions.deleteItemUSBDevice.mock.calls[0][1]).toStrictEqual({ itemName: 'mockName', path: 'mockDirectory' });
    wrapper.destroy();
  });

  test('onDeleteItemClicked "NO" ', async () => {
    state.receivedData.usb = { currentItems: [{ name: 'mockName', fullPath: false }] };
    const wrapper = mount(USBStorage, {
      store,
      localVue,
    });
    // wrapper.setData({ currentDirectory: 'mockDirectory' });
    const deleteButton = wrapper.findComponent({ ref: 'buttonDelete' });
    deleteButton.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#deleteItemModalConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonSecondary = $modal.find('.modal-content .btn-secondary');
    expect(buttonSecondary.text()).toBe('NO');
    await buttonSecondary.trigger('click');
    // await waitNT(wrapper.vm);

    expect(actions.deleteItemUSBDevice).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  test('onDeleteItemClicked "×" ', async () => {
    state.receivedData.usb = { currentItems: [{ name: 'mockName', fullPath: false }] };
    const wrapper = mount(USBStorage, {
      store,
      localVue,
    });
    // wrapper.setData({ currentDirectory: 'mockDirectory' });
    const deleteButton = wrapper.findComponent({ ref: 'buttonDelete' });
    deleteButton.trigger('click');

    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();
    await waitNT(wrapper.vm);
    await waitRAF();

    const modal = document.querySelector('#deleteItemModalConfirmation');
    expect(modal).toBeDefined();
    const $modal = createWrapper(modal);

    const buttonClose = $modal.find('.modal-content .close');
    expect(buttonClose.text()).toBe('×');
    await buttonClose.trigger('click');
    // await waitNT(wrapper.vm);

    expect(actions.deleteItemUSBDevice).toHaveBeenCalledTimes(0);
    wrapper.destroy();
  });

  test('getEndPoint method', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    // mock window.location
    const originalLoc = window.location;
    delete window.location;
    window.location = {
      protocol: 'http:',
      host: 'testhost',
    };
    // mock process.env.NODE_ENV
    const tmp = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    expect(wrapper.vm.getEndPoint()).toBe('http://testhost');
    // else
    process.env.NODE_ENV = 'debug';
    await waitNT(wrapper.vm);
    expect(wrapper.vm.getEndPoint()).toBe('http://localhost:3000');
    //
    process.env.NODE_ENV = tmp;
    window.location = originalLoc;
    wrapper.destroy();
  });

  test('if Create a Folder is clicked, onCreateFolderClicked method is called', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    wrapper.vm.createdFolderName = 'tmp';
    const buttonClicked = wrapper.findComponent({ ref: 'buttonCreateFolder' });
    await buttonClicked.trigger('click');
    expect(wrapper.vm.createdFolderName).toBe('');
    wrapper.destroy();
  });

  test('getVisibleItemName', async () => {
    const wrapper = mount(USBStorage, { store, localVue });
    expect(wrapper.vm.getVisibleItemName({ name: '.' })).toBe('[ROOT]');
    await waitNT(wrapper.vm);
    expect(wrapper.vm.getVisibleItemName({ name: 'name', fullPath: 'path' })).toBe('[PARENT DIR] name');
    wrapper.destroy();
  });

  test('clearFiles', () => {
    const wrapper = mount(USBStorage, { store, localVue });
    const spyReset = jest.spyOn(wrapper.vm.$refs['file-input'], 'reset');
    wrapper.vm.clearFiles();
    expect(spyReset).toHaveBeenCalled();
    wrapper.destroy();
  });
});
