<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1">
         <div @click="onSwitchClicked($event)" style="display:flex; flex-direction: row;">
           <div> NONE </div>
            <b-form-checkbox :checked="receivedData.usb.pluggedDevice == 'rpi'" name="check-button" size="lg" switch>
              <span>RPi</span>
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
      let targetDevice = (currentDevice == 'none') ? 'rpi' : 'none';

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
