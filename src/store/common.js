// import firebase from 'firebase/app'

// import User from './user_help'

export default {
  state: {
    loading: false,
    error: null
  },
  mutations: {
    SET_LOADING (state, payload) {
      state.loading = payload
    },
    SET_ERROR (state, payload) {
      state.error = payload
    },
    CLEAR_ERROR (state) {
      state.error = null
    }
  },
  actions: {
    SET_LOADING ({ commit }, payload) {
      commit('SET_LOADING', payload)
    },
    SET_ERROR ({ commit }, payload) {
      commit('SET_ERROR', payload)
    },
    CLEAR_ERROR  ({ commit }) {
      commit('CLEAR_ERROR ')
    }
  },
  getters: {
    LOADING (state) { return state.loading },
    ERROR (state) { return state.error }
  }
}
