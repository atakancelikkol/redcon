
import StorageHelper from '../../../src/helpers/StorageHelper';

describe('GPIOController', () => {
  it('Storage helper getItem', () => {
    localStorage.testTag = 'testItem';
    const item = StorageHelper.getItem('testTag');
    expect(item).toBe('testItem');
  });

  it('Storage helper setItem', () => {
    StorageHelper.setItem('testTag', 'testItem');
    expect(localStorage.testTag).toBe('testItem');
  });

  it('Storage helper removeItem', () => {
    StorageHelper.removeItem('testTag');
    expect(localStorage.testTag).toBe(undefined);
  });

  it('Storage helper clear', () => {
    StorageHelper.setItem('testTag', 'testItem');
    StorageHelper.clear();
    expect(localStorage).toMatchObject({});
  });
});
