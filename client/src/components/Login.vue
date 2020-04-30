<template>
  <div class="login">
    <h1>Login</h1>
    <div class="form">
      <label for="username">Username</label>
      <input v-model="user" type="text" name="surname" class="input" />
      <label for="password">Password</label>
      <input v-model="pass" type="password" class="input" />
      <button @click="login" class="btn">Login</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import store from "../store/store";
export default {
  name: "Login",
  data() {
    return {
      user: "",
      pass: ""
    };
  },

  methods: { 
    ...mapActions(["checkUser","logout"]),
    login() {
      store.state.user = this.user;
      store.state.password = this.pass;
      this.$router.push("/");
      console.log("login as", this.user, this.pass);
      this.checkUser( store.state.user, store.state.password );
    }
  }
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