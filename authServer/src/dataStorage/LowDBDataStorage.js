const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const password = 'redpinetr';
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);

const iv = Buffer.alloc(16, 0); // Initialization vector.

const DefaultData = require('./DefaultData');
const logger = require('../../../server/src/util/Logger');

const DATABASE_FILE = './src/utils/usersDb.json';

class LowDBDataStorage {
  constructor() {
    // this.db = undefined;
    const adapter = new FileSync(DATABASE_FILE, {
      serialize: (data) => this.encrypt(JSON.stringify(data)),
      deserialize: (data) => JSON.parse(this.decrypt(data)),
    });
    this.db = low(adapter);
    this.db.defaults(DefaultData).write();
    // this.registerNewUser('boraks0135@gmail.com', 'bora123');
  }

  /* async init() {
    const adapter = new FileSync(DATABASE_FILE, {
      serialize: (data) => encrypt(JSON.stringify(data)),
      deserialize: (data) => JSON.parse(decrypt(data))
    })
    this.db = await low(adapter);
    await this.db.defaults(DefaultData).write();
  } */

  registerNewUser(newEmail, newPassword) {
    if (this.findUser(newEmail)) {
      logger.info('User already exists!');
      return false;
    }

    this.db.get('users').push({ email: newEmail, password: newPassword, regDate: Date.now() }).write();
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

  encrypt(data) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(data) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let dec = decipher.update(data, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}

module.exports = LowDBDataStorage;
