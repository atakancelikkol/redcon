<template>
  <div class="home-container">
    <b-card title="Home" style="flex:1">
        Display information about device's current state.<br>
        Username<br>
     <b-form-input
      id="user"
      v-model="user"
      placeholder="user"
      rows="1"
      max-rows="1"
    ></b-form-input>Password<br>

    
    <b-form-input
      id="pass"
      v-model="pass"
      placeholder="pass"
      rows="1"
      max-rows="1"
    ></b-form-input>

    
     <b-button style="margin-top: 20px" @click="sendUser">Login</b-button>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Home",
  data() {
      return {
        user: '',
        pass: ''
      }
  },
  methods: {
    ...mapActions(["checkUser"]),
    sendUser() {
      console.log("login as" ,this.user,this.pass);
      this.checkUser({ user: this.user, pass: this.pass });
    }
  }
}
</script>

<style>
.home-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
