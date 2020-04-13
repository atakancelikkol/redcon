<template>
  <div class="port-mapping-container">
    <b-card title="Port Mapping" style="flex:1">
      <b-form-textarea ref="configRef" rows="25" v-model="textAreaContent"></b-form-textarea>
      <b-button @click="onSaveButtonClicked" class="mb1">Save</b-button>
      <b-button @click="onResetButtonClicked" class="mb2">Default Config</b-button>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "PortMapping",
  data() {
    return {
      textAreaContent: ""
    };
  },
  mounted() {
    this.fetchPortMappingConfiguration();
    this.textAreaContent = this.configContents;
  },
  computed: {
    ...mapState(["receivedData"]),
    configContents() {
      if (this.receivedData.portconfig) {
        return this.receivedData.portconfig.configContents;
      }

      return "";
    }
  },
  methods: {
    ...mapActions([
      "fetchPortMappingConfiguration",
      "setPortMappingConfiguration",
      "resetPortMappingConfiguration"
    ]),

    onSaveButtonClicked() {
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want to save changes.", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value == true)
            this.setPortMappingConfiguration({configContents: this.textAreaContent});
        })
        .catch(err => {
          console.log(err);
        });
    },
      onResetButtonClicked() {
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want default configuration.", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value == true)
            this.resetPortMappingConfiguration();
        })
        .catch(err => {
          console.log(err);
        });
    }  
  },
  watch: {
    configContents() {
      this.textAreaContent = this.configContents;
    }
  }
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
