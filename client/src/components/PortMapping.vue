<template>
  <div class="port-mapping-container">
    <b-card title="Port Mapping" style="flex:1">
      <b-form-textarea
        ref="configRef"
        rows="25"
        :value="configContents"
      >
      </b-form-textarea>
    <b-button @click='onSaveButtonClicked'>Save</b-button>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "PortMapping",
  mounted() {
    this.fetchPortMappingConfiguration();
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
    ...mapActions(["fetchPortMappingConfiguration", "setPortMappingConfiguration"], ),
    onSaveButtonClicked() {
    this.$refs.configRef;
    let setConfigFile = this.receivedData.portconfig.configContents; 
    console.log("Saving..")
    console.log(this.$refs.configRef);
    this.setPortMappingConfiguration({ setConfigFile });
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
