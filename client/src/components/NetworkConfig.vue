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

            @addRule="addTcpIntToExtNetworkRule"
            @removeRule="removeTcpIntToExtNetworkRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'TCP Rules ExtToInt'"
            :fields="fieldsTcpExtToInt"

            @addRule="addTcpExtToIntNetworkRule"
            @removeRule="removeTcpExtToIntNetworkRule"
          />
        </div>
      </div>
      <div class="row">
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'UDP Rules IntToExt'"
            :field="fieldsUdpIntToExt"

            @addRule="addUdpIntToExtNetworkRule"
            @removeRule="removeUdpIntToExtNetworkRule"
          />
        </div>
        <div class="table-responsive col-md-6">
          <NetworkRuleTable
            :table-title="'UDP Rules ExtToInt'"
            :field="fieldsUdpExtToInt"

            @addRule="addUdpExtToIntNetworkRule"
            @removeRule="removeUdpExtToIntNetworkRule"
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
      fieldsTcpIntToExt: ['ruleName', 'option1', 'option2', 'option3'],
      fieldsTcpExtToInt: ['ruleName', 'option1', 'option2', 'option3'],

      fieldsUdpIntToExt: ['ruleName', 'option1', 'option2', 'option3'],
      fieldsUdpExtToInt: ['ruleName', 'option1', 'option2', 'option3'],

      configuration: { internalInterfaceName: '', externalInterfaceName: '' },
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
    addTcpIntToExtNetworkRule(rules) {
      console.log('hobaley', rules);
    },
    addTcpExtToIntNetworkRule(rules) {
      console.log('hobaleyy', rules);
    },
    addUdpExtToIntNetworkRule(rules) {
      console.log('hobaleyyy', rules);
    },
    addUdpIntToExtNetworkRule(rules) {
      console.log('hobaleyyyy', rules);
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
