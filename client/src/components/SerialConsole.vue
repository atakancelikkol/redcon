<template>
  <div class="serial-console-container">
    <b-card title="Serial Console" style="flex:1">
      <div style="display: flex; flex-direction: row">
        <div style="margin-right: 5px; margin-top: 8px">Serial Device:</div>
        <b-form-select
          v-model="currentSerialDevice"
          :options="serialDeviceList"
          style="flex: 1; margin-right: 5px"
        ></b-form-select>
        <b-form-select
            v-model="baudRate"
            :options="serialDeviceRate"
            style="max-width: 100px; margin-right: 30px"
          ></b-form-select>
        <b-button @click="openSelectedDevice">Open Selected Device</b-button>
        <b-button style="margin-left: 5px" @click="closeSelectedDevice" variant="danger">Close Selected Device</b-button>
      </div>
      <b-form-textarea id="textarea" rows="20" style="margin-top: 10px;" :value="serialData[currentSerialDevice]" disabled></b-form-textarea>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "SerialConsole",
  data() {
    return {
      currentSerialDevice: null,
      baudRate: 115200,
        serialDeviceRate: [
          { value: 115200, text: '115200' },
          { value: 57600, text: '57600' },
          
        ]
    };
  },
  mounted() {
    this.listSerialDevices();
  },
  computed: {
    ...mapState(["receivedData", "serialData"]), // receivedData.serial.ports  receivedData.serial.portStatus
    serialDeviceList() {
      if (
        this.receivedData.serial == undefined ||
        this.receivedData.serial.ports == undefined
      ) {
        return [];
      }
      let deviceList = [];
      let portkeys = Object.keys(this.receivedData.serial.ports);
      portkeys.forEach(key => {
        let item = this.receivedData.serial.ports[key];
        // { value: "COM7", text: 'Device 1 (open)' }
        let isOpen = this.receivedData.serial.portStatus[item.path].isOpen;
        let deviceItem = {
          value: item.path,
          text:
            item.path +
            " (" +
            item.manufacturer.substring(0, 10) +
            ") [" +
            (isOpen ? "opened" : "closed") +
            "]"
        };
        deviceList.push(deviceItem);
      });
      return deviceList;
    }
  },
  methods: {
    ...mapActions(["openSerialDevice","closeSerialDevice","listSerialDevices"]),
    openSelectedDevice() {
      console.log(this.baudRate)
      console.log("open selected device is clicked", this.currentSerialDevice);
      this.openSerialDevice({
        devicePath: this.currentSerialDevice,
        baudRate: this.baudRate
      });
    },
    closeSelectedDevice() {
      console.log("close selected device is clicked", this.currentSerialDevice);
      this.closeSerialDevice({
        devicePath: this.currentSerialDevice,
      });
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
