/* =========================================================================================
  File Name: moduleReportsActions.js
  Description: Reports Module Actions
========================================================================================== */
import AxiosConfig from '@/config/AxiosConfig'

const basePath = 'auth'

export default {
  login ({ commit }, payload) {
    return AxiosConfig.post(`/${basePath}/login`, {}, { auth: payload })
      .then(response => {
        commit('SET_USER', response.data)
      })
  },
  logout ({ commit }, payload) {
    return AxiosConfig.delete(`/${basePath}/logout`)
      .then(response => {
        commit('SET_USER', {})
      })
  },
  fetchUserProfile ({ commit }, payload) {
    return AxiosConfig.get(`/${basePath}/active`)
      .then(response => {
        commit('SET_USER', response.data)
      }).catch((e) => {
        commit('SET_USER', {})
      })
  }
}
