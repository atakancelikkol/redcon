const { EOL } = require('os');

function generateRouteCommands(interfaces, interfaceConfiguration) {
  const { internalInterfaceSubnet } = interfaceConfiguration;
  const iptableRule = `# ROUTE RULES - Set as a gateway
ip route add ${internalInterfaceSubnet} dev ${interfaces.internal.name}
echo 1 > /proc/sys/net/ipv4/ip_forward
iptables -t nat -A POSTROUTING ! -d ${internalInterfaceSubnet} -o ${interfaces.external.name} -j SNAT --to-source ${interfaces.external.ip}
`;
  return iptableRule;
}

function generateUdpIntToExtRule(interfaces, rule, index) {
  // internalIp, internalPort, externalIp
  const iptableRule = `# rule-${index} "${rule.name}" -- UDP INTERNAL to EXTERNAL network
sudo iptables -t nat -A PREROUTING -i ${interfaces.internal.name} -p udp --dport ${rule.internalPort} -j DNAT --to ${rule.externalIp}
sudo iptables -t nat -A POSTROUTING -o ${interfaces.external.name} -p udp --dport ${rule.internalPort} -j SNAT --to-source ${interfaces.external.ip}
sudo iptables -t nat -A POSTROUTING -p udp --sport ${rule.internalPort} -j SNAT --to-source ${rule.internalIp}
`;
  return iptableRule;
}

function generateUdpExtToIntRule(interfaces, rule, index) {
  // externalIp && externalPort && internalIp
  const iptableRule = `# rule-${index} "${rule.name}" -- UDP EXTERNAL to INTERNAL network
sudo iptables -t nat -A PREROUTING -i ${interfaces.external.name} -p udp --dport ${rule.externalPort} -j DNAT --to ${rule.internalIp}
sudo iptables -t nat -A POSTROUTING -o ${interfaces.internal.name} -p udp --dport ${rule.externalPort} -j SNAT --to-source ${interfaces.internal.ip}
sudo iptables -t nat -A POSTROUTING -p udp --sport ${rule.externalPort} -j SNAT --to-source ${rule.externalIp}
`;
  return iptableRule;
}

function generateTcpExtToIntRule(interfaces, rule, index) {
  // rule -> deviceExternalPort && internalIp && internalPort
  const iptableRule = `# rule-${index} "${rule.name}" -- TCP EXTERNAL to INTERNAL network
sudo iptables -t nat -A PREROUTING -p tcp -i ${interfaces.external.name} --dport ${rule.deviceExternalPort} -j DNAT --to-destination ${rule.internalIp}:${rule.internalIPort}
sudo iptables -A FORWARD -p tcp -d ${rule.internalIp} --dport ${rule.internalPort} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
`;
  return iptableRule;
}

function generateTcpIntToExtRule(interfaces, rule, index) {
  // rule -> deviceInternalPort && externalIp && externalPort
  const iptableRule = `# rule-${index} "${rule.name}" -- TCP EXTERNAL to INTERNAL network
sudo iptables -t nat -A PREROUTING -p tcp -i ${interfaces.internal.name} --dport ${rule.deviceInternalPort} -j DNAT --to-destination ${rule.externalIp}:${rule.externalIPort}
sudo iptables -A FORWARD -p tcp -d ${rule.externalIp} --dport ${rule.externalPort} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
`;
  return iptableRule;
}

function generateScript(config) {
  // device external ip
  const interfaces = {};
  interfaces.external = config.networkInterfaces.find((item) => item.name === config.interfaceConfiguration.externalInterfaceName);
  interfaces.internal = config.networkInterfaces.find((item) => item.name === config.interfaceConfiguration.internalInterfaceName);
  if (!interfaces.external || !interfaces.internal) {
    console.log('can not find external or internal interface!');
    return { error: true, script: '' };
  }

  // create UDP INTERNAL to EXTERNAL rules
  const iptableCommand = {
    routeCommand: '',
    udpIntToExtRules: [],
    udpExtToIntRules: [],
    tcpIntToExtRules: [],
    tcpExtToIntRules: [],
  };

  iptableCommand.routeCommands = generateRouteCommands(interfaces, config.interfaceConfiguration);

  iptableCommand.udpIntToExtRules.push('# UDP | INTERNAL network -> EXTERNAL network');
  config.udpIntToExtRules.forEach((rule, index) => {
    iptableCommand.udpIntToExtRules.push(generateUdpIntToExtRule(interfaces, rule, index));
  });
  iptableCommand.udpIntToExtRules.push(`# -----${EOL}`);

  iptableCommand.udpExtToIntRules.push('# UDP | EXTERNAL network -> INTERNAL network');
  config.udpExtToIntRules.forEach((rule, index) => {
    iptableCommand.udpExtToIntRules.push(generateUdpExtToIntRule(interfaces, rule, index));
  });
  iptableCommand.udpExtToIntRules.push(`# -----${EOL}`);

  iptableCommand.tcpIntToExtRules.push('# TCP | INTERNAL network -> EXTERNAL network');
  config.tcpIntToExtRules.forEach((rule, index) => {
    iptableCommand.tcpIntToExtRules.push(generateTcpIntToExtRule(interfaces, rule, index));
  });
  iptableCommand.tcpIntToExtRules.push(`# -----${EOL}`);

  iptableCommand.tcpExtToIntRules.push('# TCP | EXTERNAL network -> INTERNAL network');
  config.tcpExtToIntRules.forEach((rule, index) => {
    iptableCommand.tcpExtToIntRules.push(generateTcpExtToIntRule(interfaces, rule, index));
  });
  iptableCommand.tcpExtToIntRules.push(`# -----${EOL}`);

  // concat commands
  const udpIntToExtCommand = iptableCommand.udpIntToExtRules.join(EOL);
  const udpExtToIntCommand = iptableCommand.udpExtToIntRules.join(EOL);
  const tcpIntToExtCommand = iptableCommand.tcpIntToExtRules.join(EOL);
  const tcpExtToIntCommand = iptableCommand.tcpExtToIntRules.join(EOL);
  const generatedScript = [iptableCommand.routeCommands, tcpExtToIntCommand, tcpIntToExtCommand, udpExtToIntCommand, udpIntToExtCommand].join(EOL);
  return { error: false, script: generatedScript };
}

module.exports = { generateScript };
