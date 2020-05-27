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
          <b-input ref='passForm' @keydown="onEnterKey" v-model="pass" type="password" id="text-password" style="max-width: 300px;" ></b-input>
        </b-form>
      </div>
      <div>
        <button ref='login' @click="login" class="btn btn-primary" style="margin-top:13px" >Login</button>
        <b-alert :show="authStatus == 'login-error'" variant="danger">Error ocurred on login</b-alert>
      </div>
      <b-table striped hover :items="eventItems" :fields="eventFields" style = "margin-top: 17px" class="login-container__table"></b-table>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
const cloneDeep = require('clone-deep');
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

export default {
  name: "Login",
  data() {
    return {
      username: "",
      pass: "",
      displayErrorMessage: false,
      eventFields: [
        {key: 'username', label: 'User Name'},
        {key: 'date', label: 'Login Date'},
        {key: 'activityDate', label: 'Last Activity Date'},
      ],
    };
  },
  computed: {
    ...mapState(["user", "authStatus", "token", "receivedData"]),
    eventItems() {
      if(!this.receivedData.authHistory) {
        return [];
      }
  
      let history = cloneDeep(this.receivedData.authHistory.history);
      const timeAgo = new TimeAgo('en-US');
      history.forEach(item => {
        const itemDate = new Date(item.date);
        const itemActivityDate = new Date(item.activityDate);
        item.date = itemDate.toLocaleString() + " (" +  timeAgo.format(itemDate) + ")";
        item.date = `${itemDate.toLocaleString()} ( ${timeAgo.format(itemDate)} )`;
        item.activityDate = `${itemActivityDate.toLocaleString()} ( ${timeAgo.format(itemActivityDate)} )`;
      });
      return history;
    }    
  },
  methods: {
    ...mapActions(["loginUser"]),
    login() {
      this.loginUser({username: this.username, password: this.pass});
    },
    onEnterKey(evt){
      if(evt.keyCode == 13) {
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