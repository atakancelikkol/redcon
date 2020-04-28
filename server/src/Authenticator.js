
class Authenticator {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;

    this.users = {};
    this.authentication={};
  }

  init() { 
     
  }
  
  isAuthRequired(){
    return false
  }
  
  appendData(obj) {
    obj["auth"] = { username: this.users, authentication: this.authentication};
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
        console.log("login user:", obj["auth"].username, obj["auth"].password)
        client.isAuthenticated=(this.checkUser(obj["auth"].username, obj["auth"].password))
        } else if(action == "logoutUser") {
        console.log ("logout:", obj["auth"].username)
        client.isAuthenticated=false
        this.authentication=false
        this.users=null
        this.updatePortStatus()
        }
    }
  }
  checkUser(user, pass){
  //accept every user
    this.users=user
    this.updatePortStatus()
    this.authentication=true
    return true
  }

}

module.exports = Authenticator;