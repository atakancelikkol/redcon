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
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "LeftMenu",
};
</script>

<style>
.left-menu-container {
}
</style>
