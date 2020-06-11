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
            :rules="configContents.tcpIntToExtRules"
            @addRule="addTcpIntToExtRule"
            @removeRule="removeTcpIntToExtRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'TCP Rules ExtToInt'"
            :fields="fieldsTcpExtToInt"
            :rules="configContents.tcpExtToIntRules"
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
            :rules="configContents.udpIntToExtRules"

            @addRule="addUdpIntToExtRule"
            @removeRule="removeUdpIntToExtRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'UDP Rules ExtToInt'"
            :fields="fieldsUdpExtToInt"
            :rules="configContents.udpExtToIntRules"

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
        { key: 'option1', label: 'Internal Ip' },
        { key: 'option2', label: 'External Ip' },
        { key: 'option3', label: 'External Port' }],

      fieldsUdpExtToInt: [{ key: 'ruleName', label: 'Rule Name' },
        { key: 'option1', label: 'External Ip' },
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
      console.log('hobaley', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.addTcpIntToExtNetworkRule({
        currentRuleName, currentOption1, currentOption2, currentOption3,
      });
    },
    addTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      console.log('hobaleyy', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.addTcpExtToIntNetworkRule({
        currentRuleName, currentOption1, currentOption2, currentOption3,
      });
    },
    addUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      console.log('hobaleyyy', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.addUdpExtToIntNetworkRule({
        currentRuleName, currentOption1, currentOption2, currentOption3,
      });
    },
    addUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      console.log('hobaleyyyy', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.addUdpIntToExtNetworkRule({
        currentRuleName, currentOption1, currentOption2, currentOption3,
      });
    },

    removeTcpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      console.log('hobaley', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.removeTcpIntToExtNetworkRule({ currentOption1, currentOption2, currentOption3 });
    },
    removeTcpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      console.log('hobaleyy', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.removeTcpExtToIntNetworkRule({ currentOption1, currentOption2, currentOption3 });
    },
    removeUdpIntToExtRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      console.log('hobaleyyy', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.removeUdpIntToExtNetworkRule({ currentOption1, currentOption2, currentOption3 });
    },
    removeUdpExtToIntRule(currentRuleName, currentOption1, currentOption2, currentOption3) {
      console.log('hobaleyyyy', currentRuleName, currentOption1, currentOption2, currentOption3);
      this.removeUdpExtToIntNetworkRule({ currentOption1, currentOption2, currentOption3 });
    },
  },

};
</script>
