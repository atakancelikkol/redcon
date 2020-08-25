const FileSync = require('lowdb/adapters/FileSync');
const LowDBDataStorage = require('../../../src/dataStorage/LowDBDataStorage');

jest.mock('lowdb/adapters/FileSync');

describe('LowDBDataStorage Initializing test', () => {
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

describe('LowDBDataStorage Function Tests', () => {
  test('Register User Test ', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    lowDBDataStorage.init();

    const testUser = {
      username: 'test',
      password: 'test',
    };

    const flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(true);

    const checkUser = await lowDBDataStorage.findUser(testUser.username);
    expect(checkUser.email).toStrictEqual(testUser.username);
  });

  test('Register Same User Double Times Test ', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    lowDBDataStorage.init();

    const testUser = {
      username: 'test',
      password: 'test',
    };
    if (lowDBDataStorage.findUser(testUser.username)) lowDBDataStorage.removeUser(testUser.username);
    let flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(true);
    flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(false);
  });

  test('Hascode Control While Registering', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    lowDBDataStorage.init();

    const testUser = {
      username: 'test',
      password: 'test',
    };

    if (lowDBDataStorage.findUser(testUser.username)) lowDBDataStorage.removeUser(testUser.username);
    const flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(true);

    const checkUser = await lowDBDataStorage.findUser(testUser.username);
    expect(checkUser.password).toStrictEqual(testUser.password);
  });

  test('Find User Function ', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    lowDBDataStorage.init();

    const testUser = {
      username: 'test',
      password: 'test',
    };

    if (lowDBDataStorage.findUser(testUser.username)) lowDBDataStorage.removeUser(testUser.username);
    const flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(true);
    const checkUser = await lowDBDataStorage.findUser(testUser.username);
    expect(checkUser.email).toStrictEqual(testUser.username);
  });

  test('Remove User Function ', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    lowDBDataStorage.init();

    const testUser = {
      username: 'test',
      password: 'test',
    };

    if (lowDBDataStorage.findUser(testUser.username)) lowDBDataStorage.removeUser(testUser.username);
    const flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(true);
    let removeFlag = lowDBDataStorage.removeUser(testUser.username);
    expect(removeFlag).toBe(true);
    removeFlag = lowDBDataStorage.removeUser(testUser.username);
    expect(removeFlag).toBe(false);
  });

  test('Get Users Function ', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    lowDBDataStorage.init();

    const testUser = {
      username: 'test',
      password: 'test',
    };

    if (lowDBDataStorage.findUser(testUser.username)) lowDBDataStorage.removeUser(testUser.username);
    let flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(true);
    flag = lowDBDataStorage.registerNewUser('test2', 'test2');
    expect(flag).toBe(true);

    let testUsers = lowDBDataStorage.getUsers();
    expect(testUsers[0].email).toStrictEqual(testUser.username);
    expect(testUsers[0].password).toStrictEqual(testUser.password);
    expect(testUsers[1].email).toStrictEqual('test2');
    expect(testUsers[1].password).toStrictEqual('test2');

    let removeFlag = lowDBDataStorage.removeUser(testUser.username);
    expect(removeFlag).toBe(true);
    removeFlag = lowDBDataStorage.removeUser('test2');
    expect(removeFlag).toBe(true);

    testUsers = lowDBDataStorage.getUsers();
    expect(testUsers).toBe(false);

    const getUsersFlag = lowDBDataStorage.removeUser(testUser.username);
    expect(getUsersFlag).toBe(false);
  });
});
