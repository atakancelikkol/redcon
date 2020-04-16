<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1; display:flex">
      <b-button variant="outline-primary" @click="onButtonClicked" class="button_class" style="width: 459px"> Detect USB Devices </b-button>
      <div @click="onSwitchClicked($event)" style="display:flex; flex-direction: row; margin-top:10px">
        <div size="lg" style="margin-top: 5px">
          <b>NONE</b>
        </div>
        <b-form-checkbox :checked="receivedData.usb.pluggedDevice == 'rpi'" name="check-button" size="default" switch style="margin-left: 7px;margin-top:6px">
          <div style="margin-top: 1px"> <b>RPi</b> </div>
        </b-form-checkbox>
      </div>
      <div class="divclass1"> <b><u>Availability:</u> {{usbStatus.availability}}</b> </div>
      <div class="divclass1"> <b><u>Mounted Path:</u> {{usbStatus.mountedpath}}</b> </div>
      <div class="divclass1"> <b><u>USB Name:</u> {{usbStatus.usbname}}</b> </div>
      <div style="margin-top: 25px;"><b><u> STORAGE AREA OF REDCON USB</u></b></div>
      <b-card  style="flex:1">
        <div class="mt-3" style="width: 437px">
        <b-form-file id="browse" v-model="file" :state="Boolean(file)" :disabled="receivedData.usb.isAvailable == false" ref="file-input" 
          placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." > 
        </b-form-file>
        </div>
        <div class="mt-3">
          Selected file: {{ file ? file.name : '' }}
          <b-button id="upload-button" variant="outline-primary" @click="uploadFile" :disabled="receivedData.usb.isAvailable == false">Upload Chosen File</b-button>
          <span style="margin-left: 15px">Reset File:</span>
          <b-button id="reset-button" @click="clearFiles" :disabled="receivedData.usb.isAvailable == false" variant="outline-primary" style="margin-left: 5px"> Reset File </b-button>
          <b-popover target="reset-button" :disabled="(receivedData.usb.pluggedDevice == 'rpi')&&(receivedData.usb.isAvailable==true)" triggers="hover" placement="top">
            <template v-slot:title>Popover Title</template>
            Plugged Device is {{receivedData.usb.pluggedDevice}} !
          </b-popover>
          <b-popover target="upload-button" :disabled="(receivedData.usb.pluggedDevice == 'rpi')&&(receivedData.usb.isAvailable==true)" triggers="hover" placement="top">
            <template v-slot:title>Popover Title</template>
            Plugged Device is {{receivedData.usb.pluggedDevice}} !
          </b-popover>
          <b-popover target="browse" :disabled="(receivedData.usb.pluggedDevice == 'rpi')&&(receivedData.usb.isAvailable==true)" triggers="hover" placement="top">
            <template v-slot:title>Popover Title</template>
            Plugged Device is {{receivedData.usb.pluggedDevice}} !
          </b-popover>
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
      file: [],
    };
  },
  computed: {
    ...mapState(["receivedData"]),
    usbStatus() {
      let status={};
      if (this.receivedData.usb.isAvailable == true) {
        status.usbname = this.receivedData.usb.usbName;
        status.availability = status.usbname + " is ready to be used";
        status.mountedpath = this.receivedData.usb.mountedPath;
        
        return status;
      }  
      else {
        status.usbname = "----------------";
        status.availability = "USB is not ready";
        status.mountedpath = "----------------";
        return status;
      }
    }
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
    uploadFile() {
      // Upload method
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
.divclass1 {
  margin-top: 18px;
}
</style>