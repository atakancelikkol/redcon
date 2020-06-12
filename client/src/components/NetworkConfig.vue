<template>
  <div class="port-mapping-container">
    <b-card
      title="Network Configration"
      style="flex:1"
    >
      <div class="row">
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'TCP Rules IntToExt'"
            :fields="fieldsTcpIntToExt"
            :rules="tcpIntToExtRules"
            :rule-keys="{ruleName: 'name', option1: 'deviceInternalPort', option2: 'externalIp', option3: 'externalPort'}"
            @addRule="addTcpIntToExtRule"
            @removeRule="removeTcpIntToExtRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'TCP Rules ExtToInt'"
            :fields="fieldsTcpExtToInt"
            :rules="tcpExtToIntRules"
            :rule-keys="{ruleName: 'name', option1: 'deviceExternalPort', option2: 'internalIp', option3: 'internalPort'}"
            @addRule="addTcpExtToIntRule"
            @removeRule="removeTcpExtToIntRule"
          />
        </div>
      </div>
      <div class="row">
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'UDP Rules IntToExt'"
            :fields="fieldsUdpIntToExt"
            :rules="udpIntToExtRules"
            :rule-keys="{ruleName: 'name', option1: 'internalPort', option2: 'externalIp', option3: 'externalPort'}"
            @addRule="addUdpIntToExtRule"
            @removeRule="removeUdpIntToExtRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'UDP Rules ExtToInt'"
            :fields="fieldsUdpExtToInt"
            :rules="udpExtToIntRules"
            :rule-keys="{ruleName: 'name', option1: 'externalPort', option2: 'internalIp', option3: 'externalPort'}"
            @addRule="addUdpExtToIntRule"
            @removeRule="removeUdpExtToIntRule"
          />
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import NetworkRuleTable from './NetworkRuleTable.vue';

export default {
  name: 'NetworkConfig',
  components: {
    NetworkRuleTable,
  },
  data() {
    return {
      fieldsTcpIntToExt: [{ key: 'ruleName', label: 'Rule Name' },
        { key: 'option1', label: 'Device Internal Port' },
        { key: 'option2', label: 'External Ip' },
        { key: 'option3', label: 'External Port' }],

      fieldsTcpExtToInt: [{ key: 'ruleName', label: 'Rule Name' },
        { key: 'option1', label: 'Device External Port' },
        { key: 'option2', label: 'Internal Ip' },
        { key: 'option3', label: 'Internal Port' }],

      fieldsUdpIntToExt: [{ key: 'ruleName', label: 'Rule Name' },
        { key: 'option1', label: 'Internal Port' },
        { key: 'option2', label: 'External Ip' },
        { key: 'option3', label: 'External Port' }],

      fieldsUdpExtToInt: [{ key: 'ruleName', label: 'Rule Name' },
        { key: 'option1', label: 'External Port' },
        { key: 'option2', label: 'Internal Ip' },
        { key: 'option3', label: 'Internal Port' }],


      configuration: { internalInterfaceName: '', externalInterfaceName: '', internalInterfaceSubnet: '' },
    };
  },
  computed: {
    ...mapState(['receivedData']),
    configContents() {
      if (this.receivedData.networkConfig) {
        return this.receivedData.networkConfig;
      }
      return '';
    },
    tcpIntToExtRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.tcpIntToExtRules;
        return receivedRules;
      }
      return '';
    },
    tcpExtToIntRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.tcpExtToIntRules;
        return receivedRules;
      }
      return '';
    },
    udpIntToExtRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.udpIntToExtRules;
        return receivedRules;
      }
      return '';
    },
    udpExtToIntRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.udpExtToIntRules;
        return receivedRules;
      }
      return '';
    },
  },
  watch: {

  },
  mounted() {
    this.updateNetworkInterfaceConfiguration(this.configuration);
  },
  methods: {
    ...mapActions([
      'updateNetworkInterfaceConfiguration',
      'addUdpExtToIntNetworkRule',
      'removeUdpExtToIntNetworkRule',
      'addUdpIntToExtNetworkRule',
      'removeUdpIntToExtNetworkRule',
      'addTcpExtToIntNetworkRule',
      'removeTcpExtToIntNetworkRule',
      'addTcpIntToExtNetworkRule',
      'removeTcpIntToExtNetworkRule',
    ]),
    addTcpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = {
        name: currentRuleName, deviceInternalPort: currentOption1, externalIp: currentOption2, externalPort: currentOption3,
      };
      this.addTcpIntToExtNetworkRule(rule);
    },
    addTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = {
        name: currentRuleName, deviceExternalPort: currentOption1, internalIp: currentOption2, internalPort: currentOption3,
      };
      this.addTcpExtToIntNetworkRule(rule);
    },
    addUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = {
        name: currentRuleName, externalPort: currentOption1, internalIp: currentOption2, internalPort: currentOption3,
      };
      this.addUdpExtToIntNetworkRule(rule);
    },
    addUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = {
        name: currentRuleName, internalPort: currentOption1, externalIp: currentOption2, externalPort: currentOption3,
      };
      this.addUdpIntToExtNetworkRule(rule);
    },
    removeTcpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = { deviceInternalPort: currentOption1, externalIp: currentOption2, externalPort: currentOption3 };
      this.removeTcpIntToExtNetworkRule(rule);
    },
    removeTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = { deviceExternalPort: currentOption1, internalIp: currentOption2, internalPort: currentOption3 };
      this.removeTcpExtToIntNetworkRule(rule);
    },
    removeUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = { internalPort: currentOption1, externalIp: currentOption2, externalPort: currentOption3 };
      this.removeUdpIntToExtNetworkRule(rule);
    },
    removeUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      const rule = { externalPort: currentOption1, internalIp: currentOption2, internalPort: currentOption3 };
      this.removeUdpExtToIntNetworkRule(rule);
    },
  },

};
</script>
