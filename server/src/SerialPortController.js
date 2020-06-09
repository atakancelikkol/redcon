const SerialPort = require('serialport');
const SerialPortStream = require('@serialport/stream');
const MockBinding = require('@serialport/binding-mock');
const fs = require('fs');
const logger = require('./util/Logger');

const virtualDeviceMode = false;
const mockDevicePath = '/dev/ROBOT';
const ControllerBase = require('./ControllerBase');
const KeyMapping = require('./util/KeyMapping');

if (virtualDeviceMode) {
  MockBinding.createPort(mockDevicePath, {
    echo: true, record: true,
  });
  SerialPortStream.Binding = MockBinding;
}

class SerialPortController extends ControllerBase {
  constructor() {
    super('SerialPortController');

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
      const data = `${date} virtual device \n\r`;
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
    obj.serial = this.getCopyState(); // eslint-disable-line
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
    const ports = await SerialPort.list();
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
      logger.error('invalid parameters', serialCmd);
      return;
    }
    // logger.debug("Sending to device(", devicePath, ") :", serialCmd);
    if (this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];
      port.write(serialCmd);
    } else {
      logger.error('port write error! can not find port with the specified path.', devicePath);
    }
  }

  writeKeySerialPort(devicePath, keyCode, charCode, ctrlKey, shiftKey) {
    // logger.debug("send key to device", keyCode, ctrlKey, shiftKey);
    if (this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];

      const dataToSend = KeyMapping.ConvertKey(keyCode, charCode, ctrlKey, shiftKey);

      // logger.debug("data to send = ", dataToSend);
      port.write([dataToSend]);
    } else {
      logger.error('port write error! can not find port with the specified path.', devicePath);
    }
  }

  // close serial port
  closeSerialPort(devicePath) {
    // number and string check
    if (typeof devicePath !== 'string') {
      logger.error('invalid parameters', devicePath);
      return;
    }

    if (this.portInstances[devicePath]) {
      const port = this.portInstances[devicePath];
      port.close();
    } else {
      logger.error('port close error! can not find port with the specified path.', devicePath);
    }
  }

  openWriteStream(portpath) {
    // export serial stream to txt
    const date = new Date();
    const serialOutputPath = `../server/public/SerialOut/${portpath}_(${date.toISOString().slice(0, 10)}).txt`;
    const writer = fs.createWriteStream(serialOutputPath, { flags: 'a' });
    this.writerInstances[portpath] = writer;
  }

  // open serial port console log parsed serial data
  openSerialPort(devicePath, baudRate = 115200) {
    // number and string check
    if (typeof devicePath !== 'string' || typeof baudRate !== 'number') {
      logger.error('invalid parameters', devicePath, baudRate);
      return;
    }

    const port = new SerialPort(devicePath, { baudRate });

    port.on('open', this.onPortOpened.bind(this, port));
    port.on('close', this.onPortClosed.bind(this, port));
    port.on('error', (err) => {
      logger.error('Error: ', err.message);
    });

    // create parser
    const { Readline } = SerialPort.parsers; // make instance of Readline parser
    const parser = new Readline(); // make a new parser to read ASCII lines
    port.pipe(parser);
    parser.on('data', this.onPortDataReceived.bind(this, port));

    if (virtualDeviceMode) {
      this.startVirtualDevice(devicePath);
    }
  }

  onPortOpened(port) {
    logger.info('port open.', port.path);
    this.portStatusObj[port.path].isOpen = true;
    this.portInstances[port.path] = port;
    this.openWriteStream(port.path);
    this.updatePortStatus();
  }

  onPortDataReceived(port, data) {
    const obj = {};
    obj.serialData = {
      path: port.path, data,
    };
    const writer = this.writerInstances[port.path];
    if (writer !== undefined) {
      writer.write(data);
    }
    this.sendMessageCallback(this, obj);
  }

  onPortClosed(port) {
    logger.info('port closed.', port.path);
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
}


module.exports = SerialPortController;
