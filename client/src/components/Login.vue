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
        <button @click="login" class="btn btn-primary" style="margin-top:13px" >Login</button>
        <b-alert :show="authStatus == 'login-error'" variant="danger">Error ocurred on login</b-alert>
      </div>
      <b-table striped hover :items="eventItems" :fields="eventFields" style = "margin-top: 17px" class="login-container__table"></b-table>
    </b-card>
  </div>
</template>

<script>
import store from '../store/store';

import { mapActions, mapState } from "vuex";
const cloneDeep = require('clone-deep');

export default {
  name: "Login",
  data() {
    return {
      username: "",
      pass: "",
      displayErrorMessage: false,
      eventFields: ['username', 'date', 'activityDate'],
    };
  },
  computed: {
    ...mapState(["user", "authStatus", "token", "receivedData"]),

    eventItems() {
      if(!this.receivedData.member) {
        return [];
      }

      let history = cloneDeep(this.receivedData.member.history);
      history.forEach(item => {
        item.username;
        item.date
        item.activityDate
      });
      console.log(history)
      return history;
    }    
  },
  methods: {
    ...mapActions(["loginUser", "logout"]),
    login() {
      localStorage.token
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
        if(store.state.token){
        localStorage.token = store.state.token;
        }
        this.$router.push({ path: "/" });
      }
    }
  }
};
</script>