const serialport = require('serialport');


class SerialPortController {
  constructor() {
    this.ports;
    this.port1;
  }

  /* ${ports.path} */
  //list currently active serial ports
  async listPorts() {
    let ports = await serialport.list()
    console.log(ports)
    this.ports = ports;
    
    console.log(this.ports[0].path)

  }
  
  //open serial port console log parsed serial data
  OpenSerialPort() {
    
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

    port1.on('close', this.showPortClose);
  }

  showPortClose() {
    console.log('port closed.');

  }

  showPortOpen() {
    console.log('port1 open.');
  }
}


module.exports = SerialPortController;