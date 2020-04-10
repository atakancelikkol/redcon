const serialport = require('serialport');
const virtualDeviceMode = false;
const virtualPorts = [
  {
    path: 'COM7',
    manufacturer: 'Arduino LLC (www.arduino.cc)',
    serialNumber: '95437313234351105111',
    pnpId: 'USB\\VID_2341&PID_0043\\95437313234351105111',
    locationId: 'Port_#0002.Hub_#0001',
    vendorId: '2341',
    productId: '0043',
    isOpen: false
  }
];
const virtualPortStatusObj = {
  "COM7": { isOpen: false },
}

class SerialPortController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;

    /*[
      {
        path: 'COM7',
        manufacturer: 'Arduino LLC (www.arduino.cc)',
        serialNumber: '95437313234351105111',
        pnpId: 'USB\\VID_2341&PID_0043\\95437313234351105111',
        locationId: 'Port_#0002.Hub_#0001',
        vendorId: '2341',
        productId: '0043',
        isOpen: false
      }
    ]*/
    this.ports = [];

    /*this.portStatusObj = {
      "COM7": {isOpen: false},
      "COM1": {isOpen: false}
    };*/
    this.portStatusObj = {};
    this.virtualStarted = false
  }

  init() { }

  startVirtualDevice() {
    if (this.virtualStarted)
    {return}


    setInterval(() => {
      let date = new Date()
      let data = date + 'virtualdevice\n'
      let obj = {};
      obj["serialData"] = { path: virtualPorts[0].path, data: data };
      this.sendMessageCallback(obj);
    }, 500);
    this.virtualStarted = true
  }

  getCopyState() {
    return {
      ports: { ...this.ports },
      portStatus: { ...this.portStatusObj },
    }
  }

  appendData(obj) {
    // this function returns the initial state
    obj["serial"] = this.getCopyState();
  }

  updatePortStatus() {
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }

  handleMessage(obj) {
    // { serial: { action: "openDevice", path, baudRate } };
    if (obj["serial"]) {
      let action = obj["serial"].action;
      if (action == "openDevice") {
        this.openSerialPort(obj["serial"].path, obj["serial"].baudRate);
      }
      else if (action == 'listDevices') {
        this.listPorts();
      }
    }
  }

  //list currently active serial ports
  async listPorts() {
    this.ports = [];
    if (virtualDeviceMode == true) {
      this.ports = virtualPorts
      this.portStatusObj = virtualPortStatusObj
    }
    else {
      let ports = await serialport.list();
      this.ports = ports;
      let statusList = Object.keys(this.portStatusObj);

      // delete removed port items from portStatusObj
      statusList.forEach(port => {
        let devicePort = this.ports.find(item => item.path == port)
        if (devicePort == undefined) {
          delete this.portStatusObj[port];
        }
      })
      // add new items to portStatusObj
      this.ports.forEach(item => {
        if (this.portStatusObj[item.path] == undefined) {
          this.portStatusObj[item.path] = { isOpen: false };
        }
      })
    }

    this.updatePortStatus()
  }

  //open serial port console log parsed serial data
  openSerialPort(devicePath, baudRate = 115200) {

    //number and string check
    if (typeof devicePath != 'string' || typeof baudRate != 'number') {
      console.log("invalid parameters", devicePath, baudRate)
      return
    }
    if (virtualDeviceMode == true) {

      this.onPortOpened(virtualPorts[0])
      this.startVirtualDevice()
    }
    else {
      const port = new serialport(devicePath, { baudRate });
      console.log(port.path)
      port.on('open', this.onPortOpened.bind(this, port));
      port.on('close', this.onPortClosed.bind(this, port));
      port.on('error', function (err) {
        console.log('Error: ', err.message)
      })

      // create parser
      let Readline = serialport.parsers.Readline; // make instance of Readline parser
      let parser = new Readline(); // make a new parser to read ASCII lines
      port.pipe(parser);
      parser.on('data', this.onPortDataReceived.bind(this, port));
    }
  }

  onPortOpened(port) {
    this.portStatusObj[port.path].isOpen = true;
    console.log('port open.', port.path);
    this.updatePortStatus()
  }

  onPortDataReceived(port, data) {
    // Find and update port list item
    /*this.serialdata = data;
    console.log('port data received', this.serialdata);
    this.updateSerialData()*/

    let obj = {};
    obj["serialData"] = { path: port.path, data: data };
    this.sendMessageCallback(obj);

    // Send data to clients
    // { serialport: { serialdata: {path: "COM7", data: ""}} }
  }

  onPortClosed(port) {
    this.portStatusObj[port.path].isOpen = false;
    console.log('port closed.', port.path);
    this.updatePortStatus()
  }
}


module.exports = SerialPortController;