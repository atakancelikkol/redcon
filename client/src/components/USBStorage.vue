<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1">
         <div @click="onSwitchClicked($event)" style="display:flex; flex-direction: row;">
           <div> RPi </div>
            <b-form-checkbox :checked="receivedData.usb.pluggedDevice == 'ecu'" name="check-button" size="lg" switch>
              <span>ECU</span>
            </b-form-checkbox>
          </div>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "USBStorage",
  data() {
    return {
      eventFields: ['state']
    }
  },
  computed: {
    ...mapState(['receivedData']),
  },
  methods: {
    ...mapActions(['changeUSBPort']),
    onSwitchClicked(event) {
      event.preventDefault();
      event.stopPropagation();

      const currentDevice = this.receivedData.usb.pluggedDevice;
      let targetDevice = currentDevice == 'rpi' ? 'ecu' : 'rpi';

      this.changeUSBPort({device: targetDevice});
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
