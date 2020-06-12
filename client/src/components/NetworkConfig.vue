<template>
  <div class="port-mapping-container">
    <b-card
      title="Network Configuration"
      style="flex:1"
    >
      <b-card
        title="Interface Configuration"
        style="flex:1"
      >
        <div class="row">
          <div style="margin-right: 5px; margin-top: 2px; fontSize: 20px ">
            External Interface :
          </div>
          <b-form-select
            v-model="configuration.externalInterfaceName"
            :options="networkInterfaces"
            style="flex: 1; margin-right: 100px; margin-left: 20px"
          />
          <div style="margin-right: 5px; margin-top: 2px; fontSize: 20px ">
            Internal Interface :
          </div>
          <b-form-select
            v-model="configuration.internalInterfaceName"
            :options="networkInterfaces"
            style="flex: 1; margin-right: 100px; margin-left: 20px"
          />
          <div style="margin-right: 5px; margin-top: 2px; fontSize: 20px ">
            Internal Interface Subnet:
          </div>
          <b-form-input
            v-model="configuration.internalInterfaceSubnet"
            style="flex: 1; margin-right: 100px; margin-left: 20px"
          />
          <b-button
            ref="addConf"
            variant="success"
            style="flex: 1; margin-right: 50px; margin-left: 20px"
            @click="acceptConfiguration"
          >
            Apply
          </b-button>
        </div>
      </b-card>
      <div class="row">
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'TCP Rules Internal To External'"
            :fields="fieldsTcpIntToExt"
            :rules="tcpIntToExtRules"
            :rule-keys="{ruleName: 'name', option1: 'deviceInternalPort', option2: 'externalIp', option3: 'externalPort'}"
            @addRule="addTcpIntToExtRule"
            @removeRule="removeTcpIntToExtRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'TCP Rules External To Internal'"
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
            :table-title="'UDP Rules Internal To External'"
            :fields="fieldsUdpIntToExt"
            :rules="udpIntToExtRules"
            :rule-keys="{ruleName: 'name', option1: 'internalPort', option2: 'externalIp', option3: 'externalPort'}"
            @addRule="addUdpIntToExtRule"
            @removeRule="removeUdpIntToExtRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'UDP Rules External To Internal'"
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


      configuration: { internalInterfaceName: null, externalInterfaceName: null, internalInterfaceSubnet: null },
    };
  },
  computed: {
    ...mapState(['receivedData']),
    tcpIntToExtRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.tcpIntToExtRules;
        return receivedRules;
      }
      return [];
    },
    tcpExtToIntRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.tcpExtToIntRules;
        return receivedRules;
      }
      return [];
    },
    udpIntToExtRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.udpIntToExtRules;
        return receivedRules;
      }
      return [];
    },
    udpExtToIntRules() {
      if (this.receivedData.networkConfig) {
        const receivedRules = this.receivedData.networkConfig.udpExtToIntRules;
        return receivedRules;
      }
      return [];
    },
    networkInterfaces() {
      if (this.receivedData.networkConfig) {
        const receivedInterfaces = this.receivedData.networkConfig.networkInterfaces;
        const interfaces = [];
        receivedInterfaces.forEach((item) => {
          const { name } = item;
          interfaces.push(name);
        });
        return interfaces;
      }
      return [];
    },
  },
  watch: {
    networkInterfaces() {
      this.updateNetworkSelection();
    },
  },
  mounted() {
    this.updateNetworkSelection();
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
    acceptConfiguration() {
      this.updateNetworkInterfaceConfiguration(this.configuration);
    },
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
    updateNetworkSelection() {
      if (this.receivedData.networkConfig && this.receivedData.networkConfig.interfaceConfiguration) {
        this.configuration.internalInterfaceName = this.receivedData.networkConfig.interfaceConfiguration.internalInterfaceName;
        this.configuration.externalInterfaceName = this.receivedData.networkConfig.interfaceConfiguration.externalInterfaceName;
        this.configuration.internalInterfaceSubnet = this.receivedData.networkConfig.interfaceConfiguration.internalInterfaceSubnet;
      }
    },
  },

};
</script>
