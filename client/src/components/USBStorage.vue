<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1; display:flex">
      <b-button variant="outline-primary" @click="onButtonClicked" class="button_class">Detect USB Devices</b-button>
      <div @click="onSwitchClicked($event)" style="display:flex; flex-direction: row;">
        <div size="lg">
          <b>NONE</b>-
        </div>

        <b-form-checkbox
          :checked="receivedData.usb.pluggedDevice == 'rpi'"
          name="check-button"
          size="default"
          switch
        >
          <span>
            <b>RPi</b>
          </span>
        </b-form-checkbox>
      </div>
      <div>File Storage Area of REDCON USB</div>
      <b-card title="File Storage Area of REDCON USB" style="flex:1">
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          ref="file-input"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
        <div class="mt-3">
          Selected file: {{ file ? file.name : '' }}
          <b-button variant="outline-primary" @click="uploadFile">Upload Chosen File</b-button>
          <span style="margin-left: 15px">Reset File:</span>
          <b-button
            @click="clearFiles"
            variant="outline-primary"
            style="margin-left: 5px"
          >Reset File</b-button>
        </div>
      </b-card>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "USBStorage",
  data() {
    return {
      eventFields: ["state"],
      file: null
    };
  },
  computed: {
    ...mapState(["receivedData"])
  },
  methods: {
    ...mapActions(["changeUSBPort"]),
    ...mapActions(["detectUSBDevice"]),
    onSwitchClicked(event) {
      event.preventDefault();
      event.stopPropagation();

      const currentDevice = this.receivedData.usb.pluggedDevice;
      let targetDevice = currentDevice == "none" ? "rpi" : "none";

      this.changeUSBPort({ device: targetDevice });
      return false;
    },
    onButtonClicked() {
      const currentDevice = this.receivedData.usb.pluggedDevice;
      this.detectUSBDevice({ device: currentDevice });
      return false;
    },
    clearFiles() {
      this.$refs["file-input"].reset();
    }
  }
};
</script>

<style>
.usb-storage-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.usb-storage-container > .card > .card-body {
  display: flex;
  flex-direction: column;
}
</style>