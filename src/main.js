import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.use(
  Vuelidate,
  Uimini
)
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: 'AIzaSyDA_ceBDEnFC2Ks8QCPs3DTx3V2tVhOY8Q',
  authDomain: 'fir-registration-e29b8.firebaseapp.com',
  databaseURL: 'https://fir-registration-e29b8-default-rtdb.firebaseio.com',
  projectId: 'fir-registration-e29b8',
  storageBucket: 'fir-registration-e29b8.appspot.com',
  messagingSenderId: '142710777786',
  appId: '1:142710777786:web:d9bcc1bd2e23e017fa5f83'
}
firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch('LOGGED_USER', user)
  }
  store.dispatch('LOAD_TASKS')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
