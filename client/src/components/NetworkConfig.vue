<template>
  <div class="port-mapping-container">
    <b-card
      title="Network Configration"
      style="flex:1"
    >
      <div class="Rules">
        <NetworkRuleTable
          :table-title="'TCP Rules'"
          :item-ext-to-int="tcpExtToInt"
          :item-int-to-ext="tcpIntToExt"
          :fields-int-to-ext="fieldsTcpIntToExt"
          :fields-ext-to-int="fieldsTcpExtToInt"

          @addInternalToExternal="addTcpIntToExtNetworkRule"
          @addExternalToInternal="addTcpExtToIntNetworkRule"
        />
      </div>
      <div class="Rules">
        <NetworkRuleTable
          :table-title="'UDP Rules'"
          :item-ext-to-int="udpExtToInt"
          :item-int-to-ext="udpIntToExt"
          :fields-int-to-ext="fieldsUdpIntToExt"
          :fields-ext-to-int="fieldsUdpExtToInt"

          @addInternalToExternal="addUdpIntToExtNetworkRule"
          @addExternalToInternal="addUdpExtToIntNetworkRule"
        />
      </div>
      <div class="row" />
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
      fieldsTcpIntToExt: ['optionip1', 'optionip2', 'optionip3', 'optionip4'],
      fieldsTcpExtToInt: ['externalPort', '---------->', 'internalIp', 'internalPort'],

      fieldsUdpIntToExt: ['optionip1', 'optionip2', 'optionip3', 'optionip4'],
      fieldsUdpExtToInt: ['externalIp', 'externalPort', '---------->', 'internalIp'],

      udpExtToInt: ['', '', ''],
      tcpExtToInt: ['', '', ''],
      udpIntToExt: ['', '', ''],
      tcpIntToExt: ['', '', ''],
      configuration: { internalInterfaceName: '', externalInterfaceName: '' },
    };
  },
  computed: {
    ...mapState(['receivedData']),
    configContents() {
      if (this.receivedData.portconfig) {
        return this.receivedData.portconfig;
      }
      return '';
    },
  },
  watch: {
    configContents() {
      this.textAreaContent = this.configContents;
    },
  },
  mounted() {
    this.updateNetworkInterfaceConfiguration(this.configuration);
    this.textAreaContent = this.configContents;
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
    addTcpIntToExtNetworkRule(rules) {
      console.log('hobaley', rules);
    },
    addTcpExtToIntNetworkRule(rules) {
      console.log('hobaleyy', rules);
    },
    addUdpExtToIntNetworkRule() {
    },
    addUdpIntToExtNetworkRule() {
    },

    onSaveButtonClicked() {
      this.$bvModal
        .msgBoxConfirm('Please confirm that you want to save changes.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) this.setPortMappingConfiguration({ configContents: this.textAreaContent });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onResetButtonClicked() {
      console.log('asdasdasdasd', this.receivedData);
      this.$bvModal
        .msgBoxConfirm('Please confirm that you want default configuration.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) this.resetPortMappingConfiguration();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

};
</script>

<style>
.mb1 {
  margin-top: 10px;
}
</style>

<style>
.mb2 {
  margin-top: 10px;
  margin-left: 15px;
}
</style>
