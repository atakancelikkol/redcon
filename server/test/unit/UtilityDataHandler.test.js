const UtilityDataHandler = require('../../src/UtilityDataHandler');
const utilityDataHandler = new UtilityDataHandler({});


describe("UtilityDataHandler", () => {
  test("should return true", () => {
    expect(utilityDataHandler.isAuthRequired()).toBe(true);
  });

});