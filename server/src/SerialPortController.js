const serialport = require('serialport');


class SerialPortController {
  constructor() {
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
    /*this.portStatusArray = {
      "COM7": {isOpen: false},
      "COM1": {isOpen: false}
    };*/
    this.portStatusArray = {};
    //this.port1;
  }

  /* ${ports.path} */
  //list currently active serial ports
  async listPorts() {
    this.ports = [];
    let ports = await serialport.list();
    this.ports = ports;

    let statusList = Object.keys(this.portStatusArray);

    // delete removed port items from portStatusArray
    statusList.forEach(port => {
      let devicePort = this.ports.find(item => item.path == port)
      if(devicePort == undefined) {
        delete this.portStatusArray[port];
      }
    })

    // add new items to portStatusArray
    this.ports.forEach(item => {
      if(this.portStatusArray[item.path] == undefined) {
        this.portStatusArray[item.path] = {isOpen: false};
      }
    })
    
    /*console.log(ports)
    this.ports = ports;
    
    console.log(this.ports[0].path)*/
  }
  
  //open serial port console log parsed serial data
  openSerialPort(devicePath, baudRate = 115200) {
    // TODO: add number and string check
    const port = new serialport(devicePath, {baudRate});

    // TODO: handle error case

    port.on('open', this.onPortOpened.bind(this, port));
    port.on('close', this.onPortClosed.bind(this, port));

    // create parser
    let Readline = serialport.parsers.Readline; // make instance of Readline parser
    let parser = new Readline(); // make a new parser to read ASCII lines
    port.pipe(parser);
    parser.on('data', this.onPortDataReceived.bind(this, port));

    /*
    const port1 = new serialport('COM7', {
      baudRate: 57600
    })
    this.port1 = port1;
    port1.on('open', this.showPortOpen);

    //parser
    let Readline = serialport.parsers.Readline; // make instance of Readline parser
    let parser = new Readline(); // make a new parser to read ASCII lines
    port1.pipe(parser);
    parser.on('data', console.log)

    port1.on('close', this.showPortClose);*/
  }

  onPortOpened(port) {
    // Find and update port list item
    // let myItem = this.ports.find(item => item.path == port.path);
    console.log('port1 open.', port);

    // Send data to clients
    // { serialport: { type: "portOpened", portPath: ""  } }
  }

  onPortDataReceived(port, data) {
    // Find and update port list item
    console.log('port data received',port,data);

    // Send data to clients
    // { serialport: { type: "portDataReceived", data: ""  } }
  }

  onPortClosed(port) {
    // Find and update port list
    console.log('port closed.', port);

    // Send data to clients
    // { serialport: { type: "portClosed", portPath: ""  } }
  }

  
}


module.exports = SerialPortController;