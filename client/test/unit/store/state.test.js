import store from '../../../src/store/store';

describe("store", () => {
  it("state of store", () => {
    expect({}).toStrictEqual(store.state.receivedData);
    expect({}).toStrictEqual(store.state.serialData);
    expect(true).toStrictEqual(store.state.isConnected);
    expect(null).toStrictEqual(store.state.user);
    expect('').toStrictEqual(store.state.authStatus);
    expect('').toStrictEqual(store.state.token);
  });
});