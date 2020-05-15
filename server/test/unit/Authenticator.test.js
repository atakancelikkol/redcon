const Authenticator = require('../../src/Authenticator');
const authenticator = new Authenticator({});


describe("Authenticator", () => {
  test("should return false", () => {
    expect(authenticator.isAuthRequired()).toBe(false);
  });

});

