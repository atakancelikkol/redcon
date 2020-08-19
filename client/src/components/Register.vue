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
            v-model="usernameReg"
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
            v-model="passReg"
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
            v-model="passReg2"
            type="password"
            style="max-width: 300px;"
            @keydown="onEnterKey"
          />
          <b-alert
            v-if="flag"
            :show="passValidate"
            variant="success"
            style="margin-top: 10px"
            dismissible
          >
            {{ valid }}
          </b-alert>
          <b-alert
            v-if="flag"
            :show="!passValidate"
            variant="danger"
            style="margin-top: 10px"
            dismissible
          >
            {{ notValid }}
          </b-alert>
        </b-form>
      </div>
      <div>
        <button
          ref="register"
          class="btn btn-primary"
          style="margin-top:13px"
          :disabled="!passValidate"
          @click="register"
        >
          Register
        </button>
        <router-link
          to="/login"
          style="margin-left:155px;"
        >
          Cancel
        </router-link>
        <b-alert
          v-if="registerError"
          :show="registerError"
          variant="danger"
          style="margin-top: 10px"
          dismissible
        >
          {{ registerError }}
        </b-alert>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Register',
  data() {
    return {
      usernameReg: '',
      passReg: '',
      passReg2: '',
      errorMsg: null,
      flag: false,
      regErrorFlag: null,
      regError: null,
      displayErrorMessage: false,
      valid: 'Passwords are same.',
      notValid: 'Passwords are not same, try again!',
    };
  },
  computed: {
    ...mapState(['regStatus']),
    registerError() {
      if (this.regStatus === false) {
        return 'This Username Is Already Registered, Please Try Another Username.';
      }
      return this.regStatus;
    },
    passValidate() {
      if (this.passReg === this.passReg2) {
        if (this.passReg === '' && this.passReg2 === '') {
          return null;
        }
        return true;
      }
      return false;
    },
  },
  watch: {
    ...mapState(['regStatus']),
    passReg() {
      this.flag = true;
    },
    regStatus() {
      if (this.regStatus !== null && this.regStatus !== '' && this.regStatus !== undefined) {
        if (this.regStatus === false) {
          if (this.$router.currentRoute.path !== '/register') this.$router.push('/register');
        } else {
          this.$router.push('/login');
        }
      }
    },
  },
  methods: {
    ...mapActions(['registerUser']),
    onEnterKey(evt) {
      if (evt.keyCode === 13) {
        this.registerUser({ username: this.usernameReg, password: this.passReg });
      }
    },
    register() {
      this.registerUser({ username: this.usernameReg, password: this.passReg });
    },
  },
};
</script>
