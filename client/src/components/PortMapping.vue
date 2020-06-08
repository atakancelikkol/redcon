<template>
  <div class="port-mapping-container">
    <b-card
      title="Port Mapping"
      style="flex:1"
    >
      <b-form-textarea
        ref="configRef"
        v-model="textAreaContent"
        rows="25"
      />
      <b-button
        class="mb1"
        @click="onSaveButtonClicked"
      >
        Save
      </b-button>
      <b-button
        class="mb2"
        @click="onResetButtonClicked"
      >
        Default Config
      </b-button>
      <div style="white-space:pre; margin-top: 5px; color:red">
        {{ shellError }}
      </div>
      <div style="white-space:pre; color:green">
        {{ shellOutput }}
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import logger from '../helpers/Logger';

export default {
  name: 'PortMapping',
  data() {
    return {
      textAreaContent: '',
    };
  },
  computed: {
    ...mapState(['receivedData']),
    configContents() {
      if (this.receivedData.portconfig) {
        return this.receivedData.portconfig.configContents;
      }
      return '';
    },
    shellError() {
      if (this.receivedData.portconfig) {
        return this.receivedData.portconfig.shellError;
      }
      return '';
    },
    shellOutput() {
      if (this.receivedData.portconfig) {
        return this.receivedData.portconfig.shellOutput;
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
    this.fetchPortMappingConfiguration();
    this.textAreaContent = this.configContents;
  },
  methods: {
    ...mapActions([
      'fetchPortMappingConfiguration',
      'setPortMappingConfiguration',
      'resetPortMappingConfiguration',
    ]),

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
          // console.log(err);
          logger.error(err);
        });
    },
    onResetButtonClicked() {
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
          // console.log(err);
          logger.error(err);
        });
    },
  },

};
</script>

<style>
.port-mapping-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

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
