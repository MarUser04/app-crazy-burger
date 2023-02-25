/* =========================================================================================
  File Name: moduleReportsActions.js
  Description: Reports Module Actions
========================================================================================== */

import AxiosConfig from '@/config/AxiosConfig.js'

const baseEndpoint = 'item'

export default {

  /**
   * Get Instances
   *
   * @param commit
   * @param payload
   * @param search
   */
  fetchItems ({ commit }, { vm, payload }) {
    commit('SET_ITEMS_LOADER', true)

    return AxiosConfig.get(`/${baseEndpoint}`, { params: payload })
      .then(response => {
        commit('SET_ITEMS', response.data)
      })
      .catch(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al listar el Inventario'
        })
      })
      .finally(() => {
        commit('SET_ITEMS_LOADER', false)
      })
  },

  fetchItem ({ commit, dispatch }, { vm, payload }) {
    commit('SET_ITEM_LOADER', false)
    return AxiosConfig.get(`/${baseEndpoint}/${payload.id}`)
      .then((response) => {
        commit('SET_ITEM', response.data)
      })
      .catch(() => {
        dispatch('resetItem')
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al consultar el Item'
        })
      })
      .finally(() => {
        commit('SET_ITEM_LOADER', false)
      })
  },

  resetItem ({ commit }) {
    commit('SET_ITEM', {
      id: null,
      name: '',
      quantity: 0
    })
  },

  createItem ({ commit }, { vm, payload }) {
    commit('SET_ITEM_LOADER', true)
    return AxiosConfig.post(`/${baseEndpoint}`, payload)
      .then((response) => {
        if (response.data.id) {
          vm.$router.push(`/inventario/form/${response.data.id}`)

          vm.$root.$emit('showToastMessage', {
            type: 'success',
            message: 'Item creado exitosamente'
          })
        }
      })
      .catch((e) => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al crear el Item'
        })
        throw new Error(e)
      })
      .finally(() => {
        commit('SET_ITEM_LOADER', false)
      })
  },

  updateItem ({ commit }, { vm, payload }) {
    commit('SET_ITEM_LOADER', true)
    return AxiosConfig.patch(`/${baseEndpoint}/${payload.id}`, payload.data)
      .then((response) => {
        if (response.data.id) {
          commit('SET_ITEM', response.data)
          vm.$root.$emit('showToastMessage', {
            type: 'success',
            message: 'Item actualizado exitosamente'
          })
        }
      })
      .catch((e) => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al actualizar el Item'
        })
        throw new Error(e)
      })
      .finally(() => {
        commit('SET_ITEM_LOADER', false)
      })
  },

  deleteItem ({ commit }, { vm, payload }) {
    commit('SET_ITEM_LOADER', true)
    return AxiosConfig.delete(`/${baseEndpoint}/${payload.id}`)
      .then(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'success',
          message: 'Item borrado exitosamente'
        })
      })
      .catch(() => {
        vm.$root.$emit('showToastMessage', {
          type: 'error',
          message: 'Ha ocurrido un error al borrar el Item'
        })
      })
      .finally(() => {
        commit('SET_ITEM_LOADER', false)
      })
  }
}
