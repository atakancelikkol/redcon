const FileSync = require('lowdb/adapters/FileSync');
const LowDBDataStorage = require('../../src/dataStorage/LowDBDataStorage');
const DefaultData = require('../../src/dataStorage/DefaultData');

jest.mock('lowdb/adapters/FileSync');

describe('LowDBDataStorage test', () => {
  test('db should be initialized with default data', () => {
    const lowDBDataStorage = new LowDBDataStorage();
    expect(lowDBDataStorage.db).toBe(undefined);

    lowDBDataStorage.init();
    expect(lowDBDataStorage.db).not.toBe(undefined);
    
  });

  test('db should be created with file adapter', () => {
    expect(FileSync).toHaveBeenCalledTimes(0);
    const mockDB = LowDBDataStorage.createAdapter('production');
    expect(mockDB).not.toBe(undefined);
    expect(FileSync).toHaveBeenCalledTimes(1);
  });
});