<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1">
         <div @click="onSwitchClicked($event)">
            <b-form-checkbox :checked="receivedData.usb.state == 0" name="check-button" size="lg" switch>
              <span>USB Control Switch</span>
            </b-form-checkbox>
          </div>
        <b-table striped hover :items="eventItems" :fields="eventFields" class="usb-storage-container__table"></b-table>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
const cloneDeep = require('clone-deep');

export default {
  name: "USBStorage",
  data() {
    return {
      eventFields: ['state']
    }
  },
  computed: {
    ...mapState(['receivedData']),
    eventItems() {
      if(!this.receivedData.usb) {
        return [];
      }
      
      let history = cloneDeep(this.receivedData.usb.history);
      history.forEach(item => {
        
        item.state =  item.state == 0 ? 'USB Flash Storage has switched to the ECU' : 'USB Flash Storage has switched to the RPi';
        

      });

      return history;
    }
  },
  methods: {
    ...mapActions(['changeUSBPort']),
    onSwitchClicked(event) {
      event.preventDefault();
      event.stopPropagation();
      let value = !(this.receivedData.usb.state == 1); // toggle the current value
      this.changeUSBPort({value});
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

.usb-storage-container__table {
  max-width: 500px;
}
</style>
