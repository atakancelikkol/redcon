<template>
  <div class="login-container">
    <b-card title="Login" style="flex:1">
      <div>
        <b-form>
          <label for="username" style="margin-top:7px" >Username</label>
          <b-input v-model="username" type="text" id="text-username" style="max-width: 300px;"></b-input>
        </b-form>
      </div>      
      <div>
        <b-form>
          <label for="password" style="margin-top:15px" >Password</label>
          <b-input @keydown="onEnterKey" v-model="pass" type="password" id="text-password" style="max-width: 300px;" ></b-input>
        </b-form>
      </div>
      <div>
        <button @click="login" class="btn btn-primary" style="margin-top:10px" >Login</button>
        <b-alert :show="authStatus == 'login-error'" variant="danger">Error ocurred on login</b-alert>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      pass: "",
      displayErrorMessage: false,
    };
  },
  computed: {
    ...mapState(["user", "authStatus"]),
  },
  methods: {
    ...mapActions(["loginUser", "logout"]),
    login() {
      this.loginUser({username: this.username, password: this.pass});
    },
    onEnterKey(evt){
      if(evt.keyCode == 13 ) {
        this.loginUser({username: this.username, password: this.pass});
      }
    }
  },
  watch: {
    user() {
      if (this.user != null) {
        this.$router.push({ path: "/" });
      }
    }
  }
};
</script>