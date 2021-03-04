import firebase from 'firebase/app'
import Task from './task_help'
export default {
  state: {
    tasks: []
  },
  mutations: {
    LOAD_TASKS (state, payload) {
      state.tasks = payload
    },
    NEW_TASK (state, payload) {
      state.tasks.push(payload)
      console.log(state.tasks)
    },
    EDIT_TASK (state, { id, title, description }) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.title = title
      task.description = description
    }
  },
  actions: {
    async COMPLETED_TASK ({ commit }, { id, completed }) {
      try {
        // Update title & descr
        await firebase.database().ref('tasks').child(id).update({ completed })
        // Send mutation
        commit('COMPLETED_TASK', { id, completed })
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async LOAD_TASKS ({ commit, getters }) {
      try {
        // const newTask = new Task(
        //   payload.title,
        //   payload.description,
        //   payload.whatWatch,
        //   payload.time,
        //   payload.tags,
        //   payload.completed,
        //   payload.editing
        // )
        const task = await firebase.database().ref('tasks').orderByChild('user').equalTo(getters.USER.id).once('value')
        // Get value
        console.log(task)
        const tasks = task.val()
        console.log('ghghjjk', tasks)
        // New array
        const tasksArray = []
        // Get task key (id)
        if (tasks) {
          Object.keys(tasks).forEach(key => {
            const t = tasks[key]
            tasksArray.push(
              new Task(
                t.title,
                t.description,
                t.whatWatch,
                t.time,
                t.tags,
                t.completed,
                t.editing,
                t.user,
                key
              )
            )
          })
        }
        commit('LOAD_TASKS', tasksArray)
      } catch (error) {
        // error logic here
        console.log(error)
        throw error
      }
    },
    async NEW_TASK ({ commit, getters }, payload) {
      try {
        const newTask = new Task(
          payload.title,
          payload.description,
          payload.whatWatch,
          payload.time,
          payload.tags,
          payload.completed,
          payload.editing,
          getters.USER.id
        )
        const task = await firebase.database().ref('tasks').push(newTask)
        commit('NEW_TASK', {
          ...newTask,
          id: task.key
        })
      } catch (error) {
        // error logic here
        console.log(error)
        throw error
      }
    },
    async EDIT_TASK ({ commit }, { id, title, description }) {
      try {
        await firebase.database().ref('tasks').child(id).update({
          title,
          description
        })
        commit('EDIT_TASK', { id, title, description })
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async DELETE_TASK ({ commit }, id) {
      try {
        await firebase.database().ref('tasks').child(id).remove()
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  },
  getters: {
    TASKS (state, getters) {
      return state.tasks
    },
    TASK_COMPLETED (state, getters) {
      return getters.TASKS.filter(task => {
        return task.completed
      })
    },
    TASK_NOT_COMPLETED (state, getters) {
      return getters.TASKS.filter(task => {
        return task.completed === false
      })
    }
  }
}
