const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const execSync = require('child_process').execSync;


class RPiController {
  constructor({sendMessageCallback})
  {
    this.sendMessageCallback = sendMessageCallback;
  }

  init()
  {
    console.log("initializing RPiController");
    //this.rebootRPi();
  }

  appendData(obj)
  {
    
  }

  handleMessage(obj)
  {
    // { rpi: { } };
    if (obj["rpi"])
    {
      if(obj.rpi.action == "reboot")
      {
        console.log("reboot command received!")
        this.rebootRPi();
      }
    }
  }

  rebootRPi()
  {
    // rpi terminal -> reboot command
    let cmdToRun;
    if(process.platform == "win32")
    {
      cmdToRun = "dir";//"shutdown /r";
    }
    else
    {
      cmdToRun = "reboot";
    }
    let response = execSync(cmdToRun, (err, stdout, stderr) => {
      if(err)
      {
        console.log("Error executing 'reboot' command");
        return;
      }
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
    });
    let strResp = String.fromCharCode.apply(null, response);
    console.log(strResp);
  }
}

module.exports = RPiController;