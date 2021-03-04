import firebase from 'firebase/app'

import User from './user_help'

export default {
  state: {
    user: null
  },
  mutations: {
    SET_USER (state, payload) {
      state.user = payload
      console.log('111', state.user)
    }
  },
  actions: {
    async REGISTER_USER ({ commit }, { email, password }) {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      try {
        // done logic here
        const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        commit('SET_USER', new User(user.user.uid))
        commit('SET_LOADING', false)
      } catch (error) {
        // error logic here
        commit('SET_LOADING', false)
        commit('SET_ERROR', error.message)
        throw error
      }
    },
    async LOGIN_USER ({ commit }, { email, password }) {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      try {
        // done logic here
        const user = await firebase.auth().signInWithEmailAndPassword(email, password)
        commit('SET_USER', new User(user.user.uid))
        commit('SET_LOADING', false)
      } catch (error) {
        // error logic here
        commit('SET_LOADING', false)
        commit('SET_ERROR', error.message)
        throw error
      }
    },
    LOGGED_USER ({ commit }, payload) {
      commit('SET_USER', new User(payload.uid))
      console.log(payload.uid)
    },
    LOGOUT_USER ({ commit }) {
      firebase.auth().signOut()
      commit('SET_USER', null)
    }
  },
  getters: {
    USER (state) { return state.user },
    CHECK_USER (state) { return state.user !== null }
  }
}
