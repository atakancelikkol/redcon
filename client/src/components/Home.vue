<template>
  <div class="home-container">
    <b-card title="Home" style="flex:1">
        Display information about device's current state.<br>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Home",
  data() {
      return {
        user: "",
        pass: ""
      }
  },
  methods: {
    ...mapActions(["logoutUser"]),

    logout() {
      console.log("logout as" ,this.user);
      this.logoutUser({ user: this.user});
    }
  }
}
</script>

<style>
.home-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
