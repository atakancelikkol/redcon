<template>
  <div class="serial-console-container">
    <b-card title="Serial Console" style="flex:1">
      <div style="display: flex; flex-direction: row">
        <div style="margin-right: 5px; margin-top: 8px">Serial Device: </div>
        <b-form-select v-model="currentSerialDevice" :options="serialDeviceList" style="flex: 1; margin-right: 5px"></b-form-select>
        <b-form-input id="" type="number" v-model="baudRate" style="max-width: 100px; margin-right: 5px"></b-form-input>
        <b-button @click="openSelectedDevice">Open Selected Device</b-button>
      </div>
      <b-form-textarea
        id="textarea"
        rows="20"
        style="margin-top: 10px;"
      ></b-form-textarea>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "SerialConsole",
  data() {
    return {
      currentSerialDevice: null,
      baudRate: 115200
    }
  },
  computed: {
    ...mapState(['receivedData']), // receivedData.serial.ports  receivedData.serial.portStatus  
    serialDeviceList() {
      if(this.receivedData.serial == undefined ||
         this.receivedData.serial.ports.forEach == undefined) {
        return [];
      }

      let deviceList = [];

      this.receivedData.serial.ports.forEach(item => {
        // { value: "COM7", text: 'Device 1 (open)' }
        let isOpen = this.receivedData.serial.portStatus[item.path].isOpen;
        let deviceItem = {
          value: item.path,
          text: item.path + " (" + item.manufacturer.substring(0, 10) + ") [" + (isOpen ? "opened" : "closed") + "]",
        };
        deviceList.push(deviceItem);
      });

      return deviceList;
    }
  },
  methods: {
    ...mapActions(['openSerialDevice']),
    openSelectedDevice() {
      console.log("open selected device is clicked", this.currentSerialDevice)
      this.openSerialDevice({devicePath: this.currentSerialDevice.value, baudRate: this.baudRate});
    }
  }
};
</script>

<style>
.serial-console-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
