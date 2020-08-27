<template>
  <div class="left-menu-container">
    <b-list-group>
      <b-list-group-item>REDCON</b-list-group-item>
      <b-list-group-item
        v-for="post in posts"
        :key="post.id"
        action
      >
        <router-link
          :to="post.path"
        >
          {{ post.title }}
        </router-link>
      </b-list-group-item>
      <b-list-group-item v-if="user">
        <b-link
          ref="logout"
          @click="logout"
        >
          Logout
        </b-link>
        <span>({{ user.username }})</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { menuComponents } from '../Components';

export default {
  name: 'LeftMenu',
  data() {
    return {
      posts: menuComponents,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['logoutUser']),
    logout() {
      this.logoutUser({ username: this.username });
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<style>
.left-menu-container {
}
</style>
