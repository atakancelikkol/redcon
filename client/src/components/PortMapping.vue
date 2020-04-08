<template>
  <div class="port-mapping-container">
    <b-card title="Port Mapping" style="flex:1">
      <b-form-textarea
        id="textarea"
        rows="25"
        :value="configContents"
      >
      </b-form-textarea>
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
    ...mapActions(["fetchPortMappingConfiguration"])
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
