<template>
  <div class="register-container">
    <b-card
      title="Register"
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
          <label
            for="password"
            style="margin-top:15px"
          >Enter Password Again</label>
          <b-input
            id="text-password2"
            ref="pass2Form"
            v-model="pass2"
            type="password"
            style="max-width: 300px;"
            @keydown="onEnterKey"
          />
          <b-alert
            v-if="!flag"
            :show="errorMsg"
            variant="danger"
            style="margin-top: 10px"
            dismissible
          >
            {{ errorMsg }}
          </b-alert>
          <b-alert
            v-if="flag"
            :show="errorMsg"
            variant="success"
            style="margin-top: 10px"
            dismissible
          >
            {{ errorMsg }}
          </b-alert>
        </b-form>
      </div>
      <div>
        <button
          ref="register"
          class="btn btn-primary"
          style="margin-top:13px"
          :disabled="!flag"
          @click="register"
        >
          Register
        </button>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      pass: '',
      pass2: '',
      errorMsg: null,
      flag: null,
      displayErrorMessage: false,
    };
  },
  computed: {
  },
  watch: {
    pass() {
      if (this.pass === this.pass2) {
        this.errorMsg = 'passwords are same';
        this.flag = true;
      }
      if (this.pass !== this.pass2) {
        this.errorMsg = 'passwords are not same';
        this.flag = false;
      }
    },
    pass2() {
      if (this.pass === this.pass2) {
        this.errorMsg = 'passwords are same';
        this.flag = true;
      }
      if (this.pass !== this.pass2) {
        this.errorMsg = 'passwords are not same';
        this.flag = false;
      }
    },
  },
  methods: {
    ...mapActions(['logoutUser', 'loginUser']),
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
