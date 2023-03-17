import Vue from 'vue'
import Vuex from 'vuex'
import moduleItems from '@/store/items/moduleItems'
import moduleProducts from '@/store/products/moduleProducts'
import moduleOrders from '@/store/orders/moduleOrders'
import moduleAuth from '@/store/auth/moduleAuth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: '',
    drawer: null
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    }
  },
  actions: {
  },
  modules: {
    items: moduleItems,
    products: moduleProducts,
    orders: moduleOrders,
    auth: moduleAuth
  }
})
