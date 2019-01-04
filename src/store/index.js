import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import health from './modules/physical/Health'
import testItem from './modules/physical/TestItem'
import Common from './modules/common'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    health,
    testItem,
    Common
  },
  getters
})

export default store
