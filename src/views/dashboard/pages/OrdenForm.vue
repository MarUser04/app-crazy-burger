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
            v-if="orderLoader"
          />
          <v-form v-else>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="ordenForm.clientName"
                    class="purple-input"
                    label="Nombre del Cliente"
                    :rules="stringRule"
                    :disabled="shouldDisableForm"
                  />
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-select
                    v-model="ordenForm.status"
                    :items="mapperStatus"
                    :menu-props="{ maxHeight: '400' }"
                    label="Selecciona el estado de la orden"
                    item-text="text"
                    hint="Estados"
                    persistent-hint
                    :disabled="!isEditForm"
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                >
                 <v-row align="center" v-for="(item, idx) in ordenForm.products" :key="idx">
                   <v-col cols="5">
                      <v-select
                        v-model="ordenForm.products[idx].id"
                        :items="getMappedProduct"
                        :menu-props="{ maxHeight: '400' }"
                        label="Agrega Producto a la orden"
                        item-text="text"
                        :disabled="shouldDisableForm"
                      ></v-select>
                   </v-col>
                   <v-col cols="5">
                      <v-text-field
                        v-model.number="ordenForm.products[idx].quantity"
                        class="purple-input"
                        label="Cantidad del Producto"
                        type="number"
                        :rules="numberRule"
                        :disabled="shouldDisableForm"
                      />
                   </v-col>
                   <v-col cols="2">
                    <!--<v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          size="16"
                          class="ml-2 mr-1"
                          @click="addExtras(idx)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-plus-box
                        </v-icon>
                      </template>
                      <span>Agregar Extras</span>
                    </v-tooltip>-->
                    <v-icon
                      size="16"
                      class="ml-2 mr-1"
                      @click="deleteProduct(idx)"
                      v-if="isAdminUser"
                    >
                      mdi-delete
                    </v-icon>
                   </v-col>
                   <!--<div class="ma-4 sub-item" v-if="ordenForm.products[idx].extras.length > 0">
                    <span class="text-h4">Extras</span>
                    <v-row align="center" class="mx-4" v-for="(extra, extraIdx) in ordenForm.products[idx].extras" :key="extraIdx">
                      <v-col cols="5">
                          <v-select
                            v-model="ordenForm.products[idx].extras[extraIdx].id"
                            :items="getMappedItems"
                            :menu-props="{ maxHeight: '400' }"
                            label="Agrega item extra al producto"
                            item-text="text"
                            hint="Items disponibles en el inventario"
                            persistent-hint
                          ></v-select>
                      </v-col>
                      <v-col cols="5">
                          <v-text-field
                            v-model.number="ordenForm.products[idx].extras[extraIdx].quantity"
                            class="purple-input"
                            label="Cantidad del Item"
                            type="number"
                            :rules="numberRule"
                          />
                      </v-col>
                      <v-col cols="2">
                        <v-icon
                          size="16"
                          class="ml-2 mr-1"
                          @click="deleteExtra(idx, extraIdx)"
                        >
                          mdi-delete
                        </v-icon>
                      </v-col>
                    </v-row>
                   </div>-->
                 </v-row>
                 <v-btn
                    class="mt-4"
                    depressed
                    small
                    color="success"
                    @click="addNewOrden"
                    v-if="isAdminUser"
                  >
                    Agregar más productos
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    depressed
                    color="warning"
                    @click="$router.push('/ordenes')"
                  >
                    Regresar
                  </v-btn>
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="handleSubmitProduct"
                    :disabled="disableSubmit"
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

import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'OrdenForm',
  data () {
    return {
      ordenForm: {
        clientName: '',
        status: 0,
        products: [{
          id: 0,
          quantity: 0
        }]
      },
      stringRule: [
        v => !!v || 'Campo requerido',
        v => (v && v.length >= 3) || 'Valor debe ser superior a 3'
      ],
      numberRule: [
        v => !!v || 'Campo requerido',
        v => (v && v > 0) || 'Valor debe ser superior a 0'
      ],
      status: [
        { text: 'Cancelada', value: -1 },
        { text: 'En Espera', value: 0 },
        { text: 'En Proceso', value: 1 },
        { text: 'Finalizada', value: 2 }
      ]
    }
  },
  async created () {
    if (this.isEditForm) {
      await this.fetchOrder({ vm: this, payload: { id: this.getFormId } })
      this.populateOrder()
    } else {
      this.resetOrder()
    }

    if (!this.products.length) {
      this.fetchProducts({ vm: this })
    }

    if (!this.items.length) {
      this.fetchItems({ vm: this })
    }
  },
  computed: {
    ...mapState('orders', ['order', 'orderLoader']),
    ...mapState('products', ['products']),
    ...mapState('items', ['items']),
    ...mapGetters('products', ['getMappedProduct']),
    ...mapGetters('items', ['getMappedItems']),
    ...mapGetters('auth', ['isAdminUser']),
    getFormTitle () {
      return this.isEditForm ? 'Editar Orden' : 'Crear Orden'
    },
    isEditForm () {
      return !!this.getFormId
    },
    getFormId () {
      return this.$route.params.id
    },
    disableSubmit () {
      return this.ordenForm.clientName.length < 3 ||
        this.ordenForm.products.filter(item => item.id === 0 || (item.quantity < 1 || !item.quantity)).length > 0 ||
        this.ordenForm.products.length === 0
    },
    shouldDisableForm () {
      return !this.isAdminUser
    },
    mapperStatus () {
      const { status = '' } = this.order

      switch (status) {
        case -1:
          return [{ text: 'Cancelada', value: -1 }]
        case 2:
          return [
            { text: 'Finalizada', value: 2 }
          ]
        default:
          return this.status
      }
    }
  },
  methods: {
    ...mapActions('orders', ['createOrder', 'fetchOrder', 'resetOrder', 'updateOrder']),
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('items', ['fetchItems']),
    async handleSubmitProduct () {
      const { clientName, status, products } = this.ordenForm
      try {
        if (this.isEditForm) {
          // Update new Product
          await this.updateOrder({
            vm: this,
            payload: {
              id: this.getFormId,
              data: { clientName, status, products }
            }
          })
          this.populateOrder()
        } else {
          // Create new Product
          await this.createOrder({ vm: this, payload: { clientName, products } })
        }
      } catch (e) {
        console.error(e)
      }
    },
    addNewOrden () {
      this.ordenForm.products.push({
        id: 0,
        quantity: 0
      })
    },
    addExtras (idx) {
      const newExtra = {
        id: 0,
        quantity: 0
      }
      this.ordenForm.products[idx].extras.push(newExtra)
    },
    deleteExtra (productId, extraId) {
      this.ordenForm.products[productId].extras.splice(extraId, 1)
    },
    deleteProduct (idx) {
      this.ordenForm.products.splice(idx, 1)
    },
    populateOrder () {
      const { id, clientName, status, orderDetails = [] } = this.order
      const mappedOrder = {
        id,
        clientName,
        status,
        products: orderDetails.map((product) => ({ id: product.productId, quantity: product.quantity }))
      }
      this.ordenForm = JSON.parse(JSON.stringify(mappedOrder))
    }
  }
}
</script>

<style scoped lang="scss">
.sub-item {
  margin-left: 40px !important;
  border-bottom: 1px solid black;
  padding-bottom: 16px;
}
</style>
