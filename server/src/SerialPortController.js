const serialport = require('serialport');

const virtualDeviceMode = false;
const mockDevicePath = '/dev/ROBOT';
const fs = require('fs');
const KeyMapping = require('./util/KeyMapping');

if (virtualDeviceMode) {
  const SerialPort = require('@serialport/stream');
  const MockBinding = require('@serialport/binding-mock');
  SerialPort.Binding = MockBinding;
  MockBinding.createPort(mockDevicePath, { echo: true, record: true });
}

class SerialPortController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;

    /* [
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
    ] */
    this.ports = [];

    /* this.portStatusObj = {
      "COM7": {isOpen: false},
      "COM1": {isOpen: false}
    }; */
    this.portStatusObj = {};

    // Port objects are stored here
    this.portInstances = {};

    this.virtualDeviceInterval = undefined;

    this.serialFiles = [];

    this.writerInstances = {};
  }

  isAuthRequired() {
    return true;
  }

  init() { }

  readOutputFiles() {
    const serialOutputPath = '../server/public/SerialOut/';
    let files = fs.readdirSync(serialOutputPath);
    files = files.filter((item) => item !== '.gitkeep');
    this.serialFiles = files;
    this.updatePortStatus();
  }

  startVirtualDevice(devicePath) {
    if (this.virtualDeviceInterval) {
      return;
    }

    this.virtualDeviceInterval = setInterval(() => {
      const date = new Date();
      const data = date + ' virtual device \n\r';
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
      serialFiles: { ...this.serialFiles },
    };
  }

  appendData(obj) {
    // this function returns the initial state
    obj.serial = this.getCopyState();
  }

  updatePortStatus() {
    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }


  handleMessage(obj) {
    // { serial: { action: "openDevice", path, baudRate } };
    if (obj.serial) {
      const { action } = obj.serial;
      if (action === 'openDevice') {
        this.openSerialPort(obj.serial.path, obj.serial.baudRate);
      } else if (action === 'listDevices') {
        this.listPorts();
      } else if (action === 'closeDevice') {
        this.closeSerialPort(obj.serial.path);
      } else if (action === 'writeDevice') {
        this.writeSerialPort(obj.serial.path, obj.serial.data);
      } else if (action === 'writeKeyDevice') {
        this.writeKeySerialPort(obj.serial.path, obj.serial.keyCode, obj.serial.charCode, obj.serial.ctrlKey, obj.serial.shiftKey);
      }
    }
  }

  // list currently active serial ports
  async listPorts() {
    this.readOutputFiles();
    this.ports = [];
    const ports = await serialport.list();
    this.ports = ports;
    const statusList = Object.keys(this.portStatusObj);
    // delete removed port items from portStatusObj
    statusList.forEach((port) => {
      const devicePort = this.ports.find((item) => item.path === port);
      if (devicePort === undefined) {
        delete this.portStatusObj[port];
      }
    });

    // add new items to portStatusObj
    this.ports.forEach((item) => {
      if (this.portStatusObj[item.path] === undefined) {
        this.portStatusObj[item.path] = { isOpen: false };
      }
    });
    this.updatePortStatus();
  }

  // write serial data to device
  writeSerialPort(devicePath, serialCmd) {
    if (typeof serialCmd !== 'string') {
      console.log('invalid parameters', serialCmd);
      return;
    }
    // console.log("Sending to device(", devicePath, ") :", serialCmd)
    if (this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];
      port.write(serialCmd);
    } else {
      console.log('port write error! can not find port with the specified path.', devicePath);
    }
  }

  writeKeySerialPort(devicePath, keyCode, charCode, ctrlKey, shiftKey) {
    // console.log("send key to device", keyCode, ctrlKey, shiftKey);
    if (this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];

      const dataToSend = KeyMapping.ConvertKey(keyCode, charCode, ctrlKey, shiftKey);

      // console.log("data to send = ", dataToSend);
      port.write([dataToSend]);
    } else {
      console.log('port write error! can not find port with the specified path.', devicePath);
    }
  }

  // close serial port
  closeSerialPort(devicePath) {
    // number and string check
    if (typeof devicePath !== 'string') {
      console.log('invalid parameters', devicePath);
      return;
    }

    if (this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];
      port.close();
    } else {
      console.log('port close error! can not find port with the specified path.', devicePath);
    }
  }

  openWriteStream(portpath) {
    // export serial stream to txt
    const date = new Date();
    const serialOutputPath = `../server/public/SerialOut/${portpath}_(${date.toISOString().slice(0, 10)}).txt`;
    const writer = fs.createWriteStream(serialOutputPath, {
      flags: 'a',
    });
    this.writerInstances[portpath] = writer;
  }

  // open serial port console log parsed serial data
  openSerialPort(devicePath, baudRate = 115200) {
    // number and string check
    if (typeof devicePath !== 'string' || typeof baudRate !== 'number') {
      console.log('invalid parameters', devicePath, baudRate);
      return;
    }

    const port = new serialport(devicePath, { baudRate });

    port.on('open', this.onPortOpened.bind(this, port));
    port.on('close', this.onPortClosed.bind(this, port));
    port.on('error', function (err) {
      console.log('Error: ', err.message);
    });

    // create parser
    const { Readline } = serialport.parsers; // make instance of Readline parser
    const parser = new Readline(); // make a new parser to read ASCII lines
    port.pipe(parser);
    parser.on('data', this.onPortDataReceived.bind(this, port));

    if (virtualDeviceMode) {
      this.startVirtualDevice(devicePath);
    }
  }

  onPortOpened(port) {
    console.log('port open.', port.path);
    this.portStatusObj[port.path].isOpen = true;
    this.portInstances[port.path] = port;
    this.openWriteStream(port.path);
    this.updatePortStatus();
  }

  onPortDataReceived(port, data) {
    const obj = {};
    obj.serialData = { path: port.path, data: data };
    const writer = this.writerInstances[port.path];
    if (writer !== undefined) {
      writer.write(data);
    }
    this.sendMessageCallback(this, obj);
  }

  onPortClosed(port) {
    console.log('port closed.', port.path);
    this.portStatusObj[port.path].isOpen = false;
    this.updatePortStatus();
    const writer = this.writerInstances[port.path];
    if (writer !== undefined) {
      writer.close();
    }
    if (virtualDeviceMode) {
      this.stopVirtualDevice();
    }
  }

  onExit() {

  }
}


module.exports = SerialPortController;
