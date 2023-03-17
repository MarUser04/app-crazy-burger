/* =========================================================================================
  File Name: moduleReportsActions.js
  Description: Reports Module Actions
========================================================================================== */

import AxiosConfig from '@/config/AxiosConfig.js'

const baseEndpoint = 'order'

export default {

  /**
   * Get Instances
   *
   * @param commit
   * @param payload
   * @param search
   */
  fetchOrders ({ commit }, { vm, payload }) {
    commit('SET_ORDERS_LOADER', true)

    return AxiosConfig.get(`/${baseEndpoint}`, { params: payload })
      .then(response => {
        commit('SET_ORDERS', response.data)
      })
      .catch(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al listar las Ordenes'
        })
      })
      .finally(() => {
        commit('SET_ORDERS_LOADER', false)
      })
  },

  fetchOrder ({ commit, dispatch }, { vm, payload }) {
    commit('SET_ORDER_LOADER', false)
    return AxiosConfig.get(`/${baseEndpoint}/${payload.id}`)
      .then((response) => {
        commit('SET_ORDER', response.data)
      })
      .catch(() => {
        dispatch('resetOrder')
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al consultar la Orden'
        })
      })
      .finally(() => {
        commit('SET_ORDER_LOADER', false)
      })
  },

  newOrder ({ commit }) {
    commit('SET_ORDER', {})
  },

  createOrder ({ commit }, { vm, payload }) {
    commit('SET_ORDER_LOADER', true)
    return AxiosConfig.post(`/${baseEndpoint}`, payload)
      .then((response) => {
        if (response.data.id) {
          vm.$router.push(`/ordenes/form/${response.data.id}`)

          vm.$root.$emit('showToastMessage', {
            type: 'success',
            message: 'Orden creada exitosamente'
          })
        }
      })
      .catch((e) => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: e.response.data.message
        })
        throw new Error(e)
      })
      .finally(() => {
        commit('SET_ORDER_LOADER', false)
      })
  },

  updateOrder ({ commit }, { vm, payload }) {
    commit('SET_ORDER_LOADER', true)
    return AxiosConfig.patch(`/${baseEndpoint}/${payload.id}`, payload.data)
      .then((response) => {
        if (response.data.id) {
          commit('SET_ORDER', response.data)
          vm.$root.$emit('showToastMessage', {
            type: 'success',
            message: 'Orden actualizada exitosamente'
          })
        }
      })
      .catch((e) => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al actualizar la Orden'
        })
        throw new Error(e)
      })
      .finally(() => {
        commit('SET_ORDER_LOADER', false)
      })
  },

  resetOrder ({ commit }) {
    commit('SET_ORDER', {
      id: null,
      client_name: '',
      status: 0,
      products: [
        {
          id: 0,
          quantity: 0
        }
      ]
    })
  },

  deleteOrder ({ commit }, { vm, payload }) {
    commit('SET_ORDER_LOADER', true)
    return AxiosConfig.delete(`/${baseEndpoint}/${payload.id}`)
      .then(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'success',
          message: 'Order borrada exitosamente'
        })
      })
      .catch(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al borrar la Orden'
        })
      })
      .finally(() => {
        commit('SET_ORDER_LOADER', false)
      })
  },

  submitPayment ({ commit }, { vm, payload }) {
    commit('SET_ORDER_LOADER', true)
    return AxiosConfig.patch(`/${baseEndpoint}/${payload.id}/pay`, payload.data)
      .then((response) => {
        if (response.data.id) {
          vm.$root.$emit('showToastMessage', {
            type: 'success',
            message: 'Se realizo el pago correctamente.'
          })
        }
      })
      .catch(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al realizar el pago'
        })
      })
      .finally(() => {
        commit('SET_ORDER_LOADER', false)
      })
  }
}
