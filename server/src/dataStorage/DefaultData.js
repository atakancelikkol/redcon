const DefaultData = {
  networkConfiguration: {
    interfaceConfiguration: {
      internalInterfaceName: '',
      externalInterfaceName: '',
      internalInterfaceSubnet: '10.32.0.0/16',
    },
    udpIntToExtRules: [],
    udpExtToIntRules: [],
    tcpIntToExtRules: [],
    tcpExtToIntRules: [],
  },
};

module.exports = DefaultData;
