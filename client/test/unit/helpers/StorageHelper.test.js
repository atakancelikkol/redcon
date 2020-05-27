
import StorageHelper from '../../../src/helpers/StorageHelper';

describe("GPIOController", () => {

  beforeEach(() => {
    StorageHelper.clearall()
  })

  it("Storage helper getItem", () => {
    localStorage.testTag = 'testItem'
    let item = StorageHelper.getItem('testTag')
    expect(item).toBe('testItem');
  });

  it("Storage helper setItem", () => {
    StorageHelper.setItem('testTag', 'testItem')
    expect(localStorage.testTag).toBe('testItem');
  });

  it("Storage helper removeItem", () => {
    StorageHelper.removeItem('testTag')
    expect(localStorage.testTag).toBe(undefined);
  });

  it("Storage helper clearall", () => {
    StorageHelper.clearall()
    expect(localStorage).toMatchObject({});
  });

});
