<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1">
      
      <b-button variant="outline-primary" @click="onButtonClicked">Detect USB Devices</b-button>
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
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "USBStorage",
  data() {
    return {
      eventFields: ["state"]
    };
  },
  computed: {
    ...mapState(["receivedData"])
  },
  methods: {
    ...mapActions(["changeUSBPort"]),
    onSwitchClicked(event) {
      event.preventDefault();
      event.stopPropagation();

      const currentDevice = this.receivedData.usb.pluggedDevice;
      let targetDevice = currentDevice == "none" ? "rpi" : "none";

      this.changeUSBPort({ action: 'changeDirection',device: targetDevice });
      return false;
    },
    onButtonClicked() {
      
      const currentDevice = this.receivedData.usb.pluggedDevice;
      //if currentDevice == 
      this.changeUSBPort({ action: 'detectUsbDevice',device: currentDevice });
      return false;
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
</style>
