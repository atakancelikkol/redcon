const serialport = require('serialport');
const virtualDeviceMode = false;
const mockDevicePath = '/dev/ROBOT';

if (virtualDeviceMode) {
  const SerialPort = require('@serialport/stream')
  const MockBinding = require('@serialport/binding-mock')
  SerialPort.Binding = MockBinding;
  MockBinding.createPort(mockDevicePath, { echo: true, record: true })
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

    // Port objects are stored here
    this.portInstances = {};

    this.virtualDeviceInterval = undefined;
  }

  init() { }

  startVirtualDevice(devicePath) {
    if (this.virtualDeviceInterval) {
      return;
    }

    this.virtualDeviceInterval = setInterval(() => {
      let date = new Date();
      let data = date + ' virtual device \n\r'
      this.portInstances[devicePath].emit('data', data);
    }, 500);
  }

  stopVirtualDevice() {
    if (this.virtualDeviceInterval) {
      clearInterval(this.virtualDeviceInterval);
      this.virtualDeviceInterval = undefined;
    }
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
      } else if (action == 'listDevices') {
        this.listPorts();
      } else if (action == 'closeDevice') {
        this.closeSerialPort(obj["serial"].path);
      } else if (action == 'writeDevice'){
        this.writeSerialPort(obj["serial"].path, obj["serial"].data);
      }
    }
  }

  //list currently active serial ports
  async listPorts() {
    this.ports = [];
    let ports = await serialport.list();
    this.ports = ports;
    let statusList = Object.keys(this.portStatusObj);

    // delete removed port items from portStatusObj
    statusList.forEach(port => {
      let devicePort = this.ports.find(item => item.path == port)
      if (devicePort == undefined) {
        delete this.portStatusObj[port];
      }
    });

    // add new items to portStatusObj
    this.ports.forEach(item => {
      if (this.portStatusObj[item.path] == undefined) {
        this.portStatusObj[item.path] = { isOpen: false };
      }
    })

    this.updatePortStatus();
  }

  //write serial data to device
  writeSerialPort(devicePath, serialCmd) {
    if (typeof serialCmd != 'string') {
      console.log("invalid parameters", serialCmd)
      return
    }
    console.log("Sending to device(",devicePath,") :", serialCmd)

    //TODO:
    /* if(this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];
      port.write(serialCmd);
    } else {
      console.log("port write error! can not find port with the specified path.", devicePath);
    } */

  }


  //close serial port
  closeSerialPort(devicePath) {
    //number and string check
    if (typeof devicePath != 'string') {
      console.log("invalid parameters", devicePath)
      return
    }

    if (this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];
      port.close(this.onPortClosed.bind(this, port));
    } else {
      console.log("port close error! can not find port with the specified path.", devicePath);
    }
  }

  //open serial port console log parsed serial data
  openSerialPort(devicePath, baudRate = 115200) {
    //number and string check
    if (typeof devicePath != 'string' || typeof baudRate != 'number') {
      console.log("invalid parameters", devicePath, baudRate)
      return
    }

    const port = new serialport(devicePath, { baudRate });
    this.portInstances[port.path] = port;
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

    if (virtualDeviceMode) {
      this.startVirtualDevice(devicePath);
    }
  }

  onPortOpened(port) {
    console.log('port open.', port.path);
    this.portStatusObj[port.path].isOpen = true;
    this.updatePortStatus();
  }

  onPortDataReceived(port, data) {
    let obj = {};
    obj["serialData"] = { path: port.path, data: data };
    this.sendMessageCallback(obj);
  }

  onPortClosed(port) {
    console.log('port closed.', port.path);
    this.portStatusObj[port.path].isOpen = false;
    this.updatePortStatus();

    if (virtualDeviceMode) {
      this.stopVirtualDevice();
    }
  }
}


module.exports = SerialPortController;