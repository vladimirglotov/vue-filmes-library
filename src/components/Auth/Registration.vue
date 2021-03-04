<template lang="pug">
.content-wrapper
  section
    .container
      .auth
        .auth__banner
          img(
            src="../../assets/auth.png"
          )
        .auth__form
            span.ui-title-2 Registration
            form(@submit.prevent="onSubmit")
              .form-item(:class="{ errorInput: $v.email.$error }")
                input(
                  type="email"
                  placeholder="Email"
                  v-model="email"
                  :class="{ error: $v.email.$error }"
                  @change="$v.email.$touch()"
                )
                .error(v-if="!$v.email.required") Field is required
                .error(v-if="!$v.email.email") Email is not correct
              .form-item(:class="{ errorInput: $v.password.$error }")
                input(
                  type="password"
                  placeholder="Password"
                  v-model="password"
                  :class="{ error: $v.password.$error }"
                  @change="$v.password.$touch()"
                )
                .error(v-if="!$v.password.required") Password is required.
                .error(v-if="!$v.password.minLength")
                  | Password must have at least {{ $v.password.$params.minLength.min }} letters.
              .form-item(:class="{ errorInput: $v.repeatPassword.$error }")
                input(
                  type="password"
                  placeholder="Repeat your password"
                  v-model="repeatPassword"
                  :class="{ error: $v.repeatPassword.$error }"
                  @change="$v.repeatPassword.$touch()"
                )
                .error(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical.
              .buttons-list
                button.button.button-primary(
                  type="submit"
                )
                  span(v-if="loading") Loading
                  span(v-else) Registration
              .buttons-list.buttons-list--info
                p.typo__p(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
                p.typo__p(v-else) {{ submitStatus }}
              .buttons-list.buttons-list--info
                p Do you have account?
                  router-link(to="/login")  Login here
</template>

<script>
import { sameAs, required, email, minLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Registration',
  props: {
  },
  data: () => ({
    email: '',
    password: '',
    repeatPassword: '',
    submitStatus: null
  }),
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  methods: {
    ...mapActions([
      'REGISTER_USER'
    ]),
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        const user = {
          email: this.email,
          password: this.password
        }
        this.REGISTER_USER(user)
          .then(() => {
            console.log('REGISTER!')
            this.submitStatus = 'OK'
            this.$router.push('/')
          })
          .catch(err => {
            this.submitStatus = err.message
          })
      }
    }
  },
  computed: {
    ...mapGetters([
      'LOADING'
    ]),
    loading () {
      return this.LOADING
    }
  }
}
</script>

<style lang="stylus" scoped>
.auth
  display flex
  .auth__banner,
  .auth__form
    width 50%
  .auth__form
    padding-left 20px
  .auth__banner
    padding-top 14px

input
  &.error
    border-color red
.buttons-list
  text-align right
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &last-child
      margin-bottom 0px
a
  color #444ce0
.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13.4px
    color red
  &.errorInput
    .error
      display block
</style>
