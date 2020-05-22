import mutations from '../../../src/store/mutations';


describe("store mutations", () => {

  it("receiving auth data should call proper mutations", () => {
    var state = {
      isConnected : false
    }
    var status = true;
    mutations.UPDATE_CONNECTION_STATUS(state, status);
    expect(status).toStrictEqual(state.isConnected);
  });
});

