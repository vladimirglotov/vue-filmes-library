export default {
  state: {
    tags: [
      {
        title: 'Comedy',
        id: 15346,
        use: false
      },
      {
        title: 'Western',
        id: 145678,
        use: false
      },
      {
        title: 'Adventure',
        id: 18765,
        use: false
      }
    ]
  },
  mutations: {
    NEW_TAG (state, payload) {
      payload.id = Math.random()
      state.tags.push(payload)
    },
    DELETE_TAG (state, payload) {
      for (let i = 0; i < state.tags.length; i++) {
        if (state.tags[i].id === payload) {
          state.tags.splice(i, 1)
          console.log(state.tags[i])
          console.log(payload)
        }
        console.log(state.tags)
      }
    }
  },
  actions: {
    NEW_TAG ({ commit }, payload) {
      commit('NEW_TAG', payload)
    },
    DELETE_TAG ({ commit }, payload) {
      commit('DELETE_TAG', payload)
    }
  },
  getters: {
    TAGS (state) {
      return state.tags
    }
  },
  modules: {
  }
}
