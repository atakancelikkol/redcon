<template>
  <div class="app-container">
    <div class="app-reconnect-warning">
      <b-alert
        :show="!isConnected"
        variant="warning"
        style="margin: auto; text-align: center"
      >
        Connection is lost! It will try to connect automatically.
      </b-alert>
    </div>
    <div class="app-timeOut-warning">
      <b-alert
        :show="timeOut"
        variant="danger"
        style="margin: auto; text-align: center"
      >
        TimeOut !! Please Refresh The Page.
      </b-alert>
    </div>
    <div
      :class="{'app-left-menu-blur': timeOut, 'app-left-menu': !timeOut}"
    >
      <LeftMenu />
    </div>
    <div
      :class="{'app-main-container-blur': timeOut, 'app-main-container': !timeOut}"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from './components/LeftMenu.vue';

export default {
  name: 'App',
  components: {
    LeftMenu,
  },
  computed: {
    ...mapState(['user', 'authStatus', 'isConnected', 'timeOut']),
  },
  watch: {
    ...mapState(['timeOut']),
    user() {
      if (this.user == null) {
        if (this.$router.currentRoute.path !== '/login') this.$router.push({ path: '/login' });
      }
    },
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.app-reconnect-warning {
  position: fixed;
  width: 100%;
  left:0;
  top: 0;
  display: flex;
  font-size: 10pt;
  z-index: 1;
}

.app-timeOut-warning {
  position: fixed;
  width: 100%;
  left:0;
  top: 50%;
  display: flex;
  font-size: 20pt;
  z-index: 1;
}

.app-left-menu {
  width: 200px;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
}

.app-main-container {
  flex: 1;
  padding: 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.app-left-menu-blur {
  width: 200px;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  filter: blur(5px);
}

.app-main-container-blur {
  flex: 1;
  padding: 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  filter: blur(5px);
}
</style>
