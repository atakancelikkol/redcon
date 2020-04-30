<template>
  <div class="login">
    <h1>Login</h1>
    <div class="form">
      <label for="username">Username</label>
      <input v-model="username" type="text" name="surname" class="input" />
      <label for="password">Password</label>
      <input @keydown="onEnterKey" v-model="pass" type="password" class="input" />
      <button @click="login" class="btn">Login</button>
      <b-alert :show="authStatus == 'login-error'" variant="danger">Error ocurred on login</b-alert>
    </div>
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
    ...mapActions(["loginUser","logout"]),
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
      if(this.user != null) {
        this.$router.push({path: '/'});
      }
    },
  },
};
</script>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}

.input {
  border: 1px solid green;
  padding: 10px;
  margin-bottom: 20px;
}

.btn {
  background-color: green;
  color: white;
  padding: 10px;
}
</style>