const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const password = 'redpinetr';
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
const iv = Buffer.alloc(16, 0); // Initialization vector.

const DefaultData = require('./DefaultData');

const DATABASE_FILE = './src/utils/usersDb.json';

class LowDBDataStorage {
  constructor() {
    //this.db = undefined;
    const adapter = new FileSync(DATABASE_FILE, {
      serialize: (data) => this.encrypt(JSON.stringify(data)),
      deserialize: (data) => JSON.parse(this.decrypt(data))
    })
    this.db = low(adapter);
    this.db.defaults(DefaultData).write();
    this.registerNewUser('darco@gmail.com','darco');
  }

  /*async init() {
    const adapter = new FileSync(DATABASE_FILE, {
      serialize: (data) => encrypt(JSON.stringify(data)),
      deserialize: (data) => JSON.parse(decrypt(data))
    })
    this.db = await low(adapter);
    await this.db.defaults(DefaultData).write();
  }*/

  
  registerNewUser(newEmail,newPassword) {
    if(this.findUser(newEmail)){
      console.log('User already exists!');
      return false;
    }
    else{
      this.db.get('users').push({ email: newEmail, password: newPassword, regDate:Date.now() }).write()
      console.log('Added user!');
      return true;
    }
  }
  
  findUser(email) {
    let user = this.db.get('users').find({ email: email }).value();
    if(user)
      return user;
    else
      return false;
  }

  getUsers() {
    return this.db.get('users').value();
  }

  
  removeUser(email) {
    if(this.findUser(email)) {
      this.db.get('users').remove({ email: email }).write()
      console.log('Removed user');
    }
    else{
      console.log('User does not exist!');
      return false;
    }
  }
  
  encrypt(data){
      var cipher = crypto.createCipheriv(algorithm,key,iv)
      var crypted = cipher.update(data,'utf8','hex')
      crypted += cipher.final('hex');
      return crypted;
  }
     
  decrypt(data){
      var decipher = crypto.createDecipheriv(algorithm,key,iv)
      var dec = decipher.update(data,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
  }
  
}

module.exports = LowDBDataStorage;
