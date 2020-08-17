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
        <router-link
          to="/login"
          style="margin-left:20px"
        >
          Cancel
        </router-link>
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
      usernameReg: '',
      passReg: '',
      passReg2: '',
      errorMsg: null,
      flag: null,
      displayErrorMessage: false,
    };
  },
  computed: {
  },
  watch: {
    passReg() {
      if (this.passReg === this.passReg2) {
        this.errorMsg = 'passwords are same';
        this.flag = true;
      }
      if (this.passReg !== this.passReg2) {
        this.errorMsg = 'passwords are not same';
        this.flag = false;
      }
    },
    passReg2() {
      if (this.passReg === this.passReg2) {
        this.errorMsg = 'passwords are same';
        this.flag = true;
      }
      if (this.passReg !== this.passReg2) {
        this.errorMsg = 'passwords are not same';
        this.flag = false;
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
