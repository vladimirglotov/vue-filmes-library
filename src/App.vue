<template lang="pug" id="app">
.wrapper
  header
    .navbar
      .container
        .navbar-content
          router-link.header-logo(
            to="/"
          ) Films library
          .button-burger(
            @click="menuShow = !menuShow"
            :class=" { active: menuShow }"
          )
            span.line.line-1
            span.line.line-2
            span.line.line-3
          .navbar-list__wrapper(
            :class=" { active: menuShow }"
          )
            ul.navbar-list
              li.navbar-item(
                v-for="link of linkMenu"
                :key="link.title"
                @click="menuShow = false"
              )
                router-link.navbar-link(
                  :to="link.url"
                ) {{ link.title }}
              li.navbar-item(
                v-if="checkUser"
                @click="logout"
              )
                span.navbar-link Logout
  router-view
</template>

<script>
export default {
  data: () => ({
    menuShow: false
    // linkMenu: [
    //   { title: 'Home', url: '/' },
    //   { title: 'Tasks', url: '/task' },
    //   { title: 'Login', url: '/login' },
    //   { title: 'Registration', url: '/registration' }
    // ]
  }),
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT_USER')
      this.$store.dispatch('LOAD_TASKS')
      this.$router.push('/login')
    }
  },
  computed: {
    checkUser () {
      return this.$store.getters.CHECK_USER
    },
    linkMenu () {
      if (this.checkUser) {
        return [
          { title: 'Home', url: '/' },
          { title: 'Tasks', url: '/task' }
        ]
      } else {
        return [
          { title: 'Login', url: '/login' },
          { title: 'Registration', url: '/registration' }
        ]
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
