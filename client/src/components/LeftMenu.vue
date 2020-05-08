<template>
  <div class="left-menu-container">
    <b-list-group>
      <b-list-group-item>REDCON</b-list-group-item>
      <b-list-group-item>
        <router-link to="/">Home</router-link>
      </b-list-group-item>
      <b-list-group-item>
        <router-link to="/board-control">Board Control</router-link>
      </b-list-group-item>
      <b-list-group-item>
        <router-link to="/port-mapping">Port Mapping</router-link>
      </b-list-group-item>
      <b-list-group-item>
        <router-link to="/serial-console">Serial Console</router-link>
      </b-list-group-item>
      <b-list-group-item>
        <router-link to="/usb-storage">USB Storage</router-link>
      </b-list-group-item>
      <b-list-group-item>
        <router-link to="/utility">Utility</router-link>
      </b-list-group-item>
      <b-list-group-item v-if="this.user">
        <b-link @click="logout">Logout</b-link>
        <span>({{user.username}})</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "LeftMenu",
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions([ "logoutUser"]),
    logout() {
      this.logoutUser({username: this.username,});
      this.$router.push({ path: "/login" });
    },
  },
};
</script>

<style>
.left-menu-container {
}
</style>
