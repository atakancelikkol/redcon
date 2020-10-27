const { EOL } = require('os');
const logger = require('../../util/Logger');

function generateRouteCommands(iptablesCommand, config) {
  const { internalInterfaceSubnet } = config.interfaceConfiguration;
  const iptableRule = `# ROUTE RULES - Set as a gateway
ip route add ${internalInterfaceSubnet} dev ${config.interfaceConfiguration.internalInterfaceName}
echo 1 > /proc/sys/net/ipv4/ip_forward
${iptablesCommand} -t nat -A POSTROUTING ! -d ${internalInterfaceSubnet} -o ${config.interfaceConfiguration.externalInterfaceName} -j SNAT --to-source ${config.interfaceConfiguration.externalInterfaceIP}
${iptablesCommand} -t nat -A POSTROUTING -d ${internalInterfaceSubnet} -o ${config.interfaceConfiguration.internalInterfaceName} -j SNAT --to-source ${config.interfaceConfiguration.internalInterfaceIP}
`;
  return iptableRule;
}

function generateUdpIntToExtRule(iptablesCommand, config, rule, index) {
  // internalIp, internalPort, externalIp
  const iptableRule = `# rule-${index} "${rule.name}" -- UDP INTERNAL to EXTERNAL network
${iptablesCommand} -t nat -A PREROUTING -i ${config.interfaceConfiguration.internalInterfaceName} -p udp --dport ${rule.internalPort} -j DNAT --to ${rule.externalIp}:${rule.externalPort}
${iptablesCommand} -t nat -A POSTROUTING -o ${config.interfaceConfiguration.externalInterfaceName} -p udp --dport ${rule.internalPort} -j SNAT --to-source ${config.interfaceConfiguration.externalInterfaceIP}
${iptablesCommand} -t nat -A POSTROUTING -p udp --sport ${rule.internalPort} -j SNAT --to-source ${config.interfaceConfiguration.internalInterfaceIP}
`;
  return iptableRule;
}

function generateUdpExtToIntRule(iptablesCommand, config, rule, index) {
  // externalIp && externalPort && internalIp
  const iptableRule = `# rule-${index} "${rule.name}" -- UDP EXTERNAL to INTERNAL network
${iptablesCommand} -t nat -A PREROUTING -i ${config.interfaceConfiguration.externalInterfaceName} -p udp --dport ${rule.externalPort} -j DNAT --to ${rule.internalIp}:${rule.internalPort}
${iptablesCommand} -t nat -A POSTROUTING -o ${config.interfaceConfiguration.internalInterfaceName} -p udp --dport ${rule.externalPort} -j SNAT --to-source ${config.interfaceConfiguration.internalInterfaceIP}
${iptablesCommand} -t nat -A POSTROUTING -p udp --sport ${rule.externalPort} -j SNAT --to-source ${config.interfaceConfiguration.externalInterfaceIP}
`;
  return iptableRule;
}

function generateTcpExtToIntRule(iptablesCommand, config, rule, index) {
  // rule -> deviceExternalPort && internalIp && internalPort
  const iptableRule = `# rule-${index} "${rule.name}" -- TCP EXTERNAL to INTERNAL network
${iptablesCommand} -t nat -A PREROUTING -p tcp -i ${config.interfaceConfiguration.externalInterfaceName} --dport ${rule.deviceExternalPort} -j DNAT --to-destination ${rule.internalIp}:${rule.internalPort}
${iptablesCommand} -A FORWARD -p tcp -d ${rule.internalIp} --dport ${rule.internalPort} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
`;
  return iptableRule;
}

function generateTcpIntToExtRule(iptablesCommand, config, rule, index) {
  // rule -> deviceInternalPort && externalIp && externalPort
  const iptableRule = `# rule-${index} "${rule.name}" -- TCP EXTERNAL to INTERNAL network
${iptablesCommand} -t nat -A PREROUTING -p tcp -i ${config.interfaceConfiguration.internalInterfaceName} --dport ${rule.deviceInternalPort} -j DNAT --to-destination ${rule.externalIp}:${rule.externalPort}
${iptablesCommand} -A FORWARD -p tcp -d ${rule.externalIp} --dport ${rule.externalPort} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
`;
  return iptableRule;
}

function generateScript(config, useLegacyIpTables = false) {
  const iptablesCommand = useLegacyIpTables ? 'iptables-legacy' : 'iptables';
  // device external ip
  if (!(config.interfaceConfiguration.externalInterfaceName && config.interfaceConfiguration.externalInterfaceIP) || !(config.interfaceConfiguration.internalInterfaceName && config.interfaceConfiguration.internalInterfaceIP)) {
    logger.error('external or internal interfaces are not configured!');
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

  iptableCommand.routeCommands = generateRouteCommands(iptablesCommand, config);

  iptableCommand.udpIntToExtRules.push('# UDP | INTERNAL network -> EXTERNAL network');
  config.udpIntToExtRules.forEach((rule, index) => {
    iptableCommand.udpIntToExtRules.push(generateUdpIntToExtRule(iptablesCommand, config, rule, index));
  });
  iptableCommand.udpIntToExtRules.push(`# -----${EOL}`);

  iptableCommand.udpExtToIntRules.push('# UDP | EXTERNAL network -> INTERNAL network');
  config.udpExtToIntRules.forEach((rule, index) => {
    iptableCommand.udpExtToIntRules.push(generateUdpExtToIntRule(iptablesCommand, config, rule, index));
  });
  iptableCommand.udpExtToIntRules.push(`# -----${EOL}`);

  iptableCommand.tcpIntToExtRules.push('# TCP | INTERNAL network -> EXTERNAL network');
  config.tcpIntToExtRules.forEach((rule, index) => {
    iptableCommand.tcpIntToExtRules.push(generateTcpIntToExtRule(iptablesCommand, config, rule, index));
  });
  iptableCommand.tcpIntToExtRules.push(`# -----${EOL}`);

  iptableCommand.tcpExtToIntRules.push('# TCP | EXTERNAL network -> INTERNAL network');
  config.tcpExtToIntRules.forEach((rule, index) => {
    iptableCommand.tcpExtToIntRules.push(generateTcpExtToIntRule(iptablesCommand, config, rule, index));
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

function generateRemoveScript(config, useLegacyIpTables = false) {
  const iptablesCommand = useLegacyIpTables ? 'iptables-legacy' : 'iptables';

  if (!(config.interfaceConfiguration.externalInterfaceName && config.interfaceConfiguration.externalInterfaceIP) || !(config.interfaceConfiguration.internalInterfaceName && config.interfaceConfiguration.internalInterfaceIP)) {
    logger.error('external or internal interfaces are not configured!');
    return { error: true, script: '' };
  }

  const iptableCommand = {
    routeCommand: '',
    clearNatCommand: '',
    clearForwardCommand: '',
  };

  // remove static route
  const { internalInterfaceSubnet } = config.interfaceConfiguration;
  iptableCommand.routeCommands = `# ROUTE RULES - Remove gateway
  ip route del ${internalInterfaceSubnet} dev ${config.interfaceConfiguration.internalInterfaceName}
  echo 1 > /proc/sys/net/ipv4/ip_forward
  ${iptablesCommand} -t nat -D POSTROUTING ! -d ${internalInterfaceSubnet} -o ${config.interfaceConfiguration.externalInterfaceName} -j SNAT --to-source ${config.interfaceConfiguration.externalInterfaceIP}
  `;

  // remove nat rules
  iptableCommand.clearNatCommand = `# NAT Rules - Clear iptables 
  ${iptablesCommand} -t nat -F`;

  iptableCommand.clearForwardCommand = `# FORWARD Rules - Clear iptables 
  ${iptablesCommand} -F`;

  const generatedScript = [iptableCommand.routeCommands, iptableCommand.clearNatCommand, iptableCommand.clearForwardCommand].join(EOL);
  return { error: false, script: generatedScript };
}

module.exports = { generateScript, generateRemoveScript };
