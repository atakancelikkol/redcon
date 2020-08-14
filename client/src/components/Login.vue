<template>
  <div class="login-container">
    <b-card
      title="Login"
      style="flex:1"
    >
      <div>
        <b-form>
          <label
            for="username"
            style="margin-top:7px"
          >Username</label>
          <b-input
            id="text-username"
            v-model="username"
            type="text"
            style="max-width: 300px;"
          />
        </b-form>
      </div>
      <div>
        <b-form>
          <label
            for="password"
            style="margin-top:15px"
          >Password</label>
          <b-input
            id="text-password"
            ref="passForm"
            v-model="pass"
            type="password"
            style="max-width: 300px;"
            @keydown="onEnterKey"
          />
        </b-form>
      </div>
      <div>
        <button
          ref="login"
          class="btn btn-primary"
          style="margin-top:13px"
          @click="login"
        >
          Login
        </button>
        <button
          ref="register"
          class="btn btn-primary"
          style="margin-top:13px; margin-left: 150px"
          @click="register"
        >
          Register
        </button>
        <b-alert
          :show="loginError"
          variant="danger"
          style="margin-top: 10px"
          dismissible
        >
          {{ loginError }}
        </b-alert>
      </div>
      <b-table
        striped
        hover
        :items="eventItems"
        :fields="eventFields"
        style="margin-top: 17px"
        class="login-container__table"
      />
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import logger from '../helpers/Logger';

const cloneDeep = require('clone-deep');

TimeAgo.addLocale(en);

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      pass: '',
      displayErrorMessage: false,
      eventFields: [
        { key: 'username', label: 'User Name' },
        { key: 'date', label: 'Login Date' },
        { key: 'activityDate', label: 'Last Activity Date' },
      ],
    };
  },
  computed: {
    ...mapState(['user', 'authStatus', 'token', 'receivedData']),
    eventItems() {
      if (!this.receivedData.authHistory) {
        return [];
      }
      const history = cloneDeep(this.receivedData.authHistory.history);
      const timeAgo = new TimeAgo('en-US');
      history.forEach((item) => {
        const itemDate = new Date(item.date);
        const itemActivityDate = new Date(item.activityDate);
        item.date = `${itemDate.toLocaleString()} ( ${timeAgo.format(itemDate)} )`;
        item.activityDate = `${itemActivityDate.toLocaleString()} ( ${timeAgo.format(itemActivityDate)} )`;
      });
      return history;
    },
    loginError() {
      if (!this.authStatus) {
        return false;
      }
      return this.authStatus;
    },
  },
  watch: {
    ...mapState(['receivedData']),
    ...mapActions(['logoutUser', 'loginUser']),

    user() {
      if (this.user != null) {
        this.$router.push({ path: '/' });
        logger.info('user red if ======', this.receivedData.useAuthentication);
        logger.info('user user if ======', this.user);
        logger.info('user user if ======', this.user.username);
        if (this.receivedData.useAuthentication) {
          if (this.user.username === 'anonim') {
            this.logoutUser({ user: this.user.username });
          }
        }
      }
    },
    receivedData() {
      if (this.receivedData.useAuthentication) {
        this.$router.push({ path: '/login' });
        logger.info('received data if ======', this.receivedData.useAuthentication);
        logger.info('red user if ======', this.user);
        if (this.user != null && this.user.username === 'anonim') {
          this.logoutUser({ user: this.user.username });
        }
      } else {
        this.$router.push({ path: '/' });
        this.loginUser({ username: 'anonim', password: 'anonim' });
        logger.info('received data elsee ======', this.receivedData.useAuthentication);
        logger.info('red user else ======', this.user);
      }
    },
  },
  methods: {
    ...mapActions(['logoutUser', 'loginUser']),
    login() {
      this.loginUser({ username: this.username, password: this.pass });
    },
    onEnterKey(evt) {
      if (evt.keyCode === 13) {
        this.loginUser({ username: this.username, password: this.pass });
      }
    },
    register() {
      this.$router.push({ path: '/register' });
    },
  },
};
</script>
