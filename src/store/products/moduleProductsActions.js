/* =========================================================================================
  File Name: moduleReportsActions.js
  Description: Reports Module Actions
========================================================================================== */

import AxiosConfig from '@/config/AxiosConfig.js'

const baseEndpoint = 'product'

export default {

  /**
   * Get Instances
   *
   * @param commit
   * @param payload
   * @param search
   */
  fetchProducts ({ commit }, { vm, payload }) {
    commit('SET_PRODUCTS_LOADER', true)

    return AxiosConfig.get(`/${baseEndpoint}`, { params: payload })
      .then(response => {
        commit('SET_PRODUCTS', response.data)
      })
      .catch(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al listar los Productos'
        })
      })
      .finally(() => {
        commit('SET_PRODUCTS_LOADER', false)
      })
  },
  fetchProduct ({ commit, dispatch }, { vm, payload }) {
    commit('SET_PRODUCT_LOADER', false)
    return AxiosConfig.get(`/${baseEndpoint}/${payload.id}`)
      .then((response) => {
        commit('SET_PRODUCT', response.data)
      })
      .catch(() => {
        dispatch('resetProduct')
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al consultar el Producto'
        })
      })
      .finally(() => {
        commit('SET_PRODUCT_LOADER', false)
      })
  },

  resetProduct ({ commit }) {
    commit('SET_PRODUCT', {
      id: null,
      name: '',
      price: 0,
      items: [
        {
          id: 0,
          quantity: 0
        }
      ]
    })
  },

  createProduct ({ commit }, { vm, payload }) {
    commit('SET_PRODUCT_LOADER', true)
    return AxiosConfig.post(`/${baseEndpoint}`, payload)
      .then((response) => {
        if (response.data.id) {
          vm.$router.push('/productos')

          vm.$root.$emit('showToastMessage', {
            type: 'success',
            message: 'Producto creado exitosamente'
          })
        }
      })
      .catch((e) => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al crear el Producto'
        })
        throw new Error(e)
      })
      .finally(() => {
        commit('SET_PRODUCT_LOADER', false)
      })
  }
}
