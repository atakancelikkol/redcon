import actions from '../../../src/store/actions';

describe("store actions", () => {
  it("receiving auth data should call proper mutations", () => {
    var testAuthData = {
      auth: {
        user: "test user",
        authStatus: true,
        token: "test token"
      }
    }

    /*const mockCommit = (name) => {
      console.log("mutation called", name);
    }*/

    const mockCommit = jest.fn().mockName('mockCommit');

    actions.onDataReceived({ commit: mockCommit, state: {token: '123'} }, testAuthData);
    expect(mockCommit).toHaveBeenCalledWith('SET_AUTH_DATA', testAuthData.auth);
  });

});

