<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ getFormTitle }}
            </div>
          </template>
          <v-skeleton-loader
            type="list-item@2, actions"
            v-if="itemLoader"
          />
          <v-form v-model="validForm" v-else>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="itemForm.name"
                    class="purple-input"
                    label="Nombre del Item"
                    :rules="stringRule"
                    :disabled="shouldDisableForm"
                  />
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model.number="itemForm.quantity"
                    class="purple-input"
                    label="Cantidad"
                    type="number"
                    :rules="numberRule"
                  />
                </v-col>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    depressed
                    color="warning"
                    @click="$router.push('/inventario')"
                  >
                    Regresar
                  </v-btn>
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="handleSubmitItem"
                    :disabled="!validForm"
                  >
                    {{ getFormTitle }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'InventarioForm',
  data () {
    return {
      itemForm: {
        name: '',
        quantity: 0
      },
      stringRule: [
        v => !!v || 'Campo requerido',
        v => (v && v.length >= 3) || 'Valor debe ser superior a 3'
      ],
      numberRule: [
        v => (v !== '') || 'Campo requerido',
        v => (v >= 0) || 'Valor debe ser igual o superior a 0'
      ],
      validForm: null
    }
  },
  async created () {
    if (this.isEditForm) {
      await this.fetchItem({ vm: this, payload: { id: this.getFormId } })
    } else {
      this.resetItem()
    }
    this.itemForm = { ...this.item }
  },
  computed: {
    ...mapGetters('auth', ['isAdminUser']),
    ...mapState('items', ['item', 'itemLoader']),
    getFormTitle () {
      return this.isEditForm ? 'Editar Item' : 'Crear Item'
    },
    isEditForm () {
      return !!this.getFormId
    },
    getFormId () {
      return this.$route.params.id
    },
    shouldDisableForm () {
      return !this.isAdminUser
    }
  },
  methods: {
    ...mapActions('items', ['createItem', 'fetchItem', 'resetItem', 'updateItem', 'fetchItems']),
    async handleSubmitItem () {
      const { id, ...payload } = this.itemForm
      try {
        if (this.isEditForm) {
          // Update new Item
          await this.updateItem({
            vm: this,
            payload: {
              id: this.getFormId,
              data: payload
            }
          })
          this.itemForm = { ...this.item }
        } else {
          // Create new Item
          await this.createItem({ vm: this, payload: payload })
        }
      } catch (e) {
        console.error(e)
      }

      this.fetchItems({ vm: this })
    }
  }
}
</script>
