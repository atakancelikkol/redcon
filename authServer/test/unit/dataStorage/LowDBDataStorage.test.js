const FileSync = require('lowdb/adapters/FileSync');
const crypto = require('crypto');
const LowDBDataStorage = require('../../../src/dataStorage/LowDBDataStorage');
const DefaultData = require('../../../src/dataStorage/DefaultData');

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

    const hash = crypto.createHash('sha256');
    hash.update(testUser.password);
    const hashedPass = hash.digest('hex');

    if (lowDBDataStorage.findUser(testUser.username)) lowDBDataStorage.removeUser(testUser.username);
    const flag = lowDBDataStorage.registerNewUser(testUser.username, testUser.password);
    expect(flag).toBe(true);

    const checkUser = await lowDBDataStorage.findUser(testUser.username);
    expect(checkUser.password).toStrictEqual(hashedPass);
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

    let hash = crypto.createHash('sha256');
    hash.update(testUser.password);
    const hashedPass = hash.digest('hex');

    hash = crypto.createHash('sha256');
    hash.update('test2');
    const hashedPass2 = hash.digest('hex');

    const testUsers = lowDBDataStorage.getUsers();
    expect(testUsers[0].email).toStrictEqual(testUser.username);
    expect(testUsers[0].password).toStrictEqual(hashedPass);
    expect(testUsers[1].email).toStrictEqual('test2');
    expect(testUsers[1].password).toStrictEqual(hashedPass2);

    let removeFlag = lowDBDataStorage.removeUser(testUser.username);
    expect(removeFlag).toBe(true);
    removeFlag = lowDBDataStorage.removeUser('test2');
    expect(removeFlag).toBe(true);

    const getUsersFlag = lowDBDataStorage.removeUser(testUser.username);
    expect(getUsersFlag).toBe(false);
  });
});
