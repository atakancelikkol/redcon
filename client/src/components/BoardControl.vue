<template>
  <div class="board-control-container">
    <b-card title="Board Control" style="flex:1">
        <div v-for="(gpioPort, index) in GPIOPorts" :key="index">
          <b-form-checkbox :checked="receivedData.gpio.state[gpioPort] == 1" @input="onPortChanged(gpioPort, $event)" name="check-button" size="lg" switch>
            <span v-if="gpioPort == 3">POWER </span>
            <span v-else-if="gpioPort == 5">CONTACT </span>
            <span>PORT #{{gpioPort}}</span>
          </b-form-checkbox>
        </div>

        <b-table striped hover :items="eventItems" :fields="eventFields"></b-table>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
const cloneDeep = require('clone-deep');

export default {
  name: "BoardControl",
  data() {
    return {
      eventFields: ['port', 'state', 'date'],
    }
  },
  computed: {
    ...mapState(['receivedData']),
    GPIOPorts() {
      if(!this.receivedData.gpio) {
        return [];
      }

      return Object.keys(this.receivedData.gpio.state);
    },
    eventItems() {
      if(!this.receivedData.gpio) {
        return [];
      }

      let history = cloneDeep(this.receivedData.gpio.history);
      history.forEach(item => {
        item.port = "PORT #" + item.port;
        item.state =  item.state ? 'ON' : 'OFF';
        item.date = new Date(item.date).toTimeString();
      });

      return history;
    }
  },
  methods: {
    ...mapActions(['changeGPIOPort']),
    onPortChanged(gpioPort, value) {
      this.changeGPIOPort({gpioPort, value});
    }
  }
};
</script>

<style>
.board-control-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
