const IPTableRuleGenerator = require('../../../../src/platform/posix/IPTableRuleGenerator');
const DefaultData = require('../../../../src/dataStorage/DefaultData');

const networkInterfaces = [
  { name: 'eth0', ip: '10.0.0.10', mac: 'xx:xx:xx' },
  { name: 'eth1', ip: '192.168.0.10', mac: 'yy:yy:yy' },
];

const config = {
  ...DefaultData.networkConfiguration,
  networkInterfaces,
};

describe('IPTableRuleGenerator test', () => {
  it('generateScript should fail when interface configuration is not done', () => {
    const script = IPTableRuleGenerator.generateScript(config, false);
    expect(script).toStrictEqual({ error: true, script: '' });
  });

  it('it should success when interface configuration is done', () => {
    config.interfaceConfiguration.externalInterfaceName = 'eth0';
    config.interfaceConfiguration.internalInterfaceName = 'eth1';
    config.interfaceConfiguration.internalInterfaceSubnet = '192.168.0.0/16';
    const script = IPTableRuleGenerator.generateScript(config, false);
    const matchString = 'iptables -t nat -A POSTROUTING ! -d 192.168.0.0/16 -o eth0 -j SNAT --to-source 10.0.0.10';
    expect(script.error).toBe(false);
    expect(script.script).toContain(matchString);
  });

  it('it should success when interface configuration is done in legacy mode', () => {
    config.interfaceConfiguration.externalInterfaceName = 'eth0';
    config.interfaceConfiguration.internalInterfaceName = 'eth1';
    config.interfaceConfiguration.internalInterfaceSubnet = '192.168.0.0/16';
    const script = IPTableRuleGenerator.generateScript(config, true);
    const matchString = 'iptables-legacy -t nat -A POSTROUTING ! -d 192.168.0.0/16 -o eth0 -j SNAT --to-source 10.0.0.10';
    expect(script.error).toBe(false);
    expect(script.script).toContain(matchString);
  });

  it('it should generate script for UDP Int to Ext', () => {
    config.udpIntToExtRules.push({ internalPort: '6000', externalIp: '128.0.0.10', externalPort: '5500' });

    const script = IPTableRuleGenerator.generateScript(config);
    expect(script.error).toBe(false);
    expect(script.script).toContain('iptables -t nat -A PREROUTING -i eth1 -p udp --dport 6000 -j DNAT --to 128.0.0.10:5500');
    expect(script.script).toContain('iptables -t nat -A POSTROUTING -o eth0 -p udp --dport 6000 -j SNAT --to-source 10.0.0.10');
    expect(script.script).toContain('iptables -t nat -A POSTROUTING -p udp --sport 6000 -j SNAT --to-source 192.168.0.10');
  });

  it('it should generate script for UDP Ext to Int', () => {
    config.udpExtToIntRules.push({ externalPort: '7000', internalIp: '128.0.0.20', internalPort: '5600' });

    const script = IPTableRuleGenerator.generateScript(config);
    expect(script.error).toBe(false);
    expect(script.script).toContain('iptables -t nat -A PREROUTING -i eth0 -p udp --dport 7000 -j DNAT --to 128.0.0.20:5600');
    expect(script.script).toContain('iptables -t nat -A POSTROUTING -o eth1 -p udp --dport 7000 -j SNAT --to-source 192.168.0.10');
    expect(script.script).toContain('iptables -t nat -A POSTROUTING -p udp --sport 7000 -j SNAT --to-source 10.0.0.10');
  });

  it('it should generate script for TCP Int to Ext', () => {
    config.tcpIntToExtRules.push({ deviceInternalPort: '2000', externalIp: '192.168.10.50', externalPort: '3000' });

    const script = IPTableRuleGenerator.generateScript(config);
    expect(script.error).toBe(false);
    expect(script.script).toContain('iptables -t nat -A PREROUTING -p tcp -i eth1 --dport 2000 -j DNAT --to-destination 192.168.10.50:3000');
    expect(script.script).toContain('iptables -A FORWARD -p tcp -d 192.168.10.50 --dport 3000 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT');
  });

  it('it should generate script for TCP Ext to Int', () => {
    config.tcpExtToIntRules.push({ deviceExternalPort: '3000', internalIp: '10.0.0.60', internalPort: '8000' });

    const script = IPTableRuleGenerator.generateScript(config);
    expect(script.error).toBe(false);
    expect(script.script).toContain('iptables -t nat -A PREROUTING -p tcp -i eth0 --dport 3000 -j DNAT --to-destination 10.0.0.60:8000');
    expect(script.script).toContain('iptables -A FORWARD -p tcp -d 10.0.0.60 --dport 8000 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT');
  });

  it('generateRemoveScript should fail when interface configuration is not done', () => {
    config.interfaceConfiguration.externalInterfaceName = '';
    const script = IPTableRuleGenerator.generateRemoveScript(config, false);
    expect(script).toStrictEqual({ error: true, script: '' });
  });

  it('it should generate remove script ', () => {
    config.interfaceConfiguration.externalInterfaceName = 'eth0';
    config.interfaceConfiguration.internalInterfaceName = 'eth1';
    config.interfaceConfiguration.internalInterfaceSubnet = '192.168.0.0/16';

    const script = IPTableRuleGenerator.generateRemoveScript(config);
    expect(script.error).toBe(false);
    expect(script.script).toContain('ip route del 192.168.0.0/16 dev eth1');
    expect(script.script).toContain('iptables -t nat -F');
    expect(script.script).toContain('iptables -F');
  });
});
