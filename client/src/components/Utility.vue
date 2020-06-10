<template>
  <div class="utility-container">
    <b-card
      title="Utility"
      style="flex:1"
    >
      Click to reboot Raspberry Pi device:<br>
      <b-button
        ref="reboot"
        block
        variant="danger"
        size="lg"
        @click="onRebootClicked"
      >
        Reboot device
      </b-button>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
// import logger from '../helpers/Logger';
// const cloneDeep = require('clone-deep');

export default {
  name: 'Utility',
  data() {
    return {
    };
  },
  computed: {
    ...mapState(['receivedData']),
  },
  methods: {
    ...mapActions([
      'rebootDevice',
    ]),
    onRebootClicked() {
      this.$bvModal
        .msgBoxConfirm('Please confirm that you want to reboot Raspberry Pi device.', {
          id: 'rebootModalConfirmation',
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) this.rebootDevice();
        });
    },
  },
};
</script>

<style>
.utility-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
