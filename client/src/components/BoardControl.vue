<template>
  <div class="board-control-container">
    <b-card
      title="Board Control"
      style="flex:1"
    >
      <div
        v-for="(gpioPort, index) in GPIOPorts"
        :key="index"
      >
        <div
          id="switch"
          @click="onSwitchClicked($event, gpioPort)"
        >
          <b-form-checkbox
            :checked="receivedData.gpio.state[gpioPort] == 0"
            name="check-button"
            size="lg"
            switch
          >
            <span v-if="gpioPort == 3">POWER </span>
            <span v-else-if="gpioPort == 5">FLASHMODE (Switch ON means FLASH MODE IS OFF FOR C1 BOARD!! You have to switch ON to operate Normal Mode.) </span>
            <span v-else-if="gpioPort == 7">WDG PIN </span>
            <span>PORT #{{ gpioPort }}</span>
          </b-form-checkbox>
        </div>
      </div>

      <div>
        Total Time:
      </div>

      <b-table
        striped
        hover
        :items="eventItems"
        :fields="eventFields"
        class="board-control-container__table"
      />
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const cloneDeep = require('clone-deep');

export default {
  name: 'BoardControl',
  data() {
    return {
      eventFields: ['port', 'state', 'date'],
    };
  },
  computed: {
    ...mapState(['receivedData']),
    GPIOPorts() {
      if (!this.receivedData.gpio) {
        return [];
      }

      return Object.keys(this.receivedData.gpio.state);
    },
    eventItems() {
      if (!this.receivedData.gpio) {
        return [];
      }

      const history = cloneDeep(this.receivedData.gpio.history);
      history.forEach((item) => {
        item.port = `PORT #${item.port}`;
        item.state = item.state === 0 ? 'ON' : 'OFF'; // LOW_PIN means its on
        item.date = new Date(item.date).toTimeString();
      });

      return history;
    },
  },
  methods: {
    ...mapActions(['changeGPIOPort']),
    onSwitchClicked(event, gpioPort) {
      event.preventDefault();
      event.stopPropagation();
      const value = !(this.receivedData.gpio.state[gpioPort] === 1); // toggle the current value
      this.changeGPIOPort({ gpioPort, value });
      return false;
    },
  },
};
</script>

<style>
.board-control-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.board-control-container__table {
  max-width: 500px;
}
</style>
