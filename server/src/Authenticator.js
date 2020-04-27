
class Authenticator {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;

    this.username = "";
    this.password = "";


  }

  init() { 
     
  }
  
  
  appendData(obj) {
    obj["auth"] = { username: "asd", password: "asd" };
  }
  updatePortStatus() {
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }

  handleMessage(obj, client) {
   
    if (obj["auth"]) {
      let action = obj["auth"].action;
      if (action == "checkUser") {
        console.log(obj["auth"])
        console.log(obj["auth"].username, obj["auth"].password)
        console.log(client.isAuthenticated)
        client.isAuthenticated=(this.checkUser(obj["auth"].username, obj["auth"].password))
        console.log(client.isAuthenticated)
      }
    }
  }
  checkUser(user, pass){
    //accept every user
    return true
    
  }

}

module.exports = Authenticator;