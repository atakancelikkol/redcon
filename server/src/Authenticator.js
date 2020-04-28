
class Authenticator {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;

    this.username = "";
    this.password = "";


  }

  init() { 
     
  }
  
  isAuthRequired(){
    return false
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
      console.log( obj["auth"].action)
      if (action == "checkUser") {
        console.log("user", obj["auth"].username, obj["auth"].password)
        client.isAuthenticated=(this.checkUser(obj["auth"].username, obj["auth"].password))
      } else if(action == "logoutUser") {
        console.log ("logout", obj["auth"].username)
        client.isAuthenticated=false
      }
    }
  }
  checkUser(user, pass){
    //accept every user
    return true
  }

}

module.exports = Authenticator;