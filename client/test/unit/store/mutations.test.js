import mutations from '../../../src/store/mutations';


describe("store mutations", () => {

  it("mutation should do proper assignments", () => {
    var state = {
      isConnected : false
    }
    var status = true;
    mutations.UPDATE_CONNECTION_STATUS(state, status);
    expect(status).toStrictEqual(state.isConnected);
  });
});

