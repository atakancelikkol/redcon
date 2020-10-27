import mutations from '../../../src/store/mutations';


describe('store mutations', () => {
  it('mutation APPEND_PARTIAL_DATA should append data properly', () => {
    const state = {
      receivedData: {},
    };
    const data = 'test_data';

    mutations.APPEND_PARTIAL_DATA(state, data);
    expect({
      0: 't',
      1: 'e',
      2: 's',
      3: 't',
      4: '_',
      5: 'd',
      6: 'a',
      7: 't',
      8: 'a',
    }).toStrictEqual(state.receivedData);
  });

  it('mutation APPEND_SERIAL_DATA', () => {
    const state = {
      serialData: {
        0: 'data',
        1: undefined,
        3: [...Array(21000)],
      },
    };

    const serialData1 = {
      path: '0',
      data: 'test_data',
    };
    const serialData2 = {
      path: '1',
      data: 'test_data',
    };
    const serialData3 = {
      path: '3',
      data: 'test_data',
    };

    mutations.APPEND_SERIAL_DATA(state, serialData1);
    expect('datatest_data').toStrictEqual(state.serialData[0]);

    mutations.APPEND_SERIAL_DATA(state, serialData2);
    expect('test_data').toStrictEqual(state.serialData[1]);

    mutations.APPEND_SERIAL_DATA(state, serialData3);
    const AppendedData = state.serialData[3].slice(state.serialData[3]
      .length - serialData3.data.length, state.serialData[3].length);
    expect(20000).toStrictEqual(state.serialData[3].length);
    expect('test_data').toStrictEqual(AppendedData);
  });

  it('mutation UPDATE_CONNECTION_STATUS should do proper assignments', () => {
    const state = {
      isConnected: false,
    };
    const status = true;
    mutations.UPDATE_CONNECTION_STATUS(state, status);
    expect(status).toStrictEqual(state.isConnected);
  });

  it('mutation CLEAR_USB_ITEM_INFO should do assign undefined to current item info', () => {
    const state = {
      receivedData: {
        usb: {
          currentItemInfo: 'ready',
        },
      },
    };
    mutations.CLEAR_USB_ITEM_INFO(state);
    expect(undefined).toStrictEqual(state.receivedData.usb.currentItemInfo);
  });

  it('mutation SET_AUTH_DATA should do proper assignments', () => {
    const state = {
      user: 'test_user',
      authStatus: true,
      token: 'test_token',
      regStatus: true,
    };

    const authData = {
      user: 'test_user_auth',
      authStatus: false,
      token: 'test_token_auth',
      regStatus: false,
    };

    mutations.SET_AUTH_DATA(state, authData);
    expect(authData.user).toStrictEqual(state.user);
    expect(authData.token).toStrictEqual(state.token);
    expect(authData.authStatus).toStrictEqual(state.authStatus);
    expect(authData.regStatus).toStrictEqual(state.regStatus);
  });
});
