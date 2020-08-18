const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const DefaultData = require('./DefaultData');
const logger = require('../../../server/src/util/Logger');

const DATABASE_FILE = './src/utils/usersDb.json';

class LowDBDataStorage {
  constructor() {
    const adapter = new FileSync(DATABASE_FILE);
    this.db = low(adapter);
    this.db.defaults(DefaultData).write();
    // this.registerNewUser('boraks0135@gmail.com', 'bora123');
  }

  registerNewUser(newEmail, newPassword) {
    if (this.findUser(newEmail)) {
      logger.info('User already exists!');
      return false;
    }
    const currentDate = new Date();
    this.db.get('users').push({ email: newEmail, password: newPassword, regDate: currentDate }).write();
    logger.info('Added user!');
    return true;
  }

  findUser(email) {
    const user = this.db.get('users').find({ email }).value();
    if (user) return user;
    return false;
  }

  getUsers() {
    return this.db.get('users').value();
  }

  removeUser(email) {
    if (this.findUser(email)) {
      this.db.get('users').remove({ email }).write();
      logger.info('Removed user');
      return true;
    }
    logger.info('User does not exist!');
    return false;
  }
}

module.exports = LowDBDataStorage;
