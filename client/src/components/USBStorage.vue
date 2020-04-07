<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1">
      <div v-for="(gpioPort, index) in GPIOPorts" :key="index">
          <div @click="onSwitchClicked($event, gpioPort)">
            <b-form-checkbox :checked="receivedData.usb.state[gpioPort] == 0" name="check-button" size="lg" switch>
              <span v-if="gpioPort == 29">Ground </span>
              <span v-else-if="gpioPort == 31">Data + </span>
              <span v-else-if="gpioPort == 33">Data - </span>
              <span v-else-if="gpioPort == 35">Vcc </span>
              <span>Pin #{{gpioPort}}</span>
            </b-form-checkbox>
          </div>
        </div>

        <div>
          Total Time: 
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
      eventFields: ['port', 'state', 'date']
    }
  },
  computed: {
    ...mapState(['receivedData']),
    GPIOPorts() {
      if(!this.receivedData.usb) {
        return [];
      }

      return Object.keys(this.receivedData.usb.state);
    },
    eventItems() {
      if(!this.receivedData.usb) {
        return [];
      }

      let history = cloneDeep(this.receivedData.usb.history);
      history.forEach(item => {
        item.port = "PIN #" + item.port;
        item.state =  item.state == 0 ? 'ON' : 'OFF'; // LOW_PIN means its on
        item.date = new Date(item.date).toTimeString();
      });

      return history;
    }
  },
  methods: {
    ...mapActions(['changeUSBPort']),
    onSwitchClicked(event, gpioPort) {
      event.preventDefault();
      event.stopPropagation();
      let value = !(this.receivedData.usb.state[gpioPort] == 1); // toggle the current value
      this.changeUSBPort({gpioPort, value});
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
