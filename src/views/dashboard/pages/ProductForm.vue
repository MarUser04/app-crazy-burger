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
            v-if="productLoader"
          />
          <v-form v-else>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="productForm.name"
                    class="purple-input"
                    label="Nombre del Producto"
                    :rules="stringRule"
                    :disabled="shouldDisableForm"
                  />
                </v-col>

                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model.number="productForm.price"
                    class="purple-input"
                    label="Precio"
                    type="number"
                    :rules="numberRule"
                    :disabled="shouldDisableForm"
                  />
                </v-col>
                <v-col
                  cols="12"
                >
                 <v-row align="center" v-for="(item, idx) in productForm.items" :key="idx">
                   <v-col cols="5">
                      <v-select
                        v-model="productForm.items[idx].id"
                        :items="getMappedItems"
                        :menu-props="{ maxHeight: '400' }"
                        label="Agrega item al producto"
                        item-text="text"
                        hint="Items disponibles en el inventario"
                        persistent-hint
                        :disabled="shouldDisableForm"
                      ></v-select>
                   </v-col>
                   <v-col cols="5">
                      <v-text-field
                        v-model.number="productForm.items[idx].quantity"
                        class="purple-input"
                        label="Cantidad del Item"
                        type="number"
                        :rules="numberRule"
                        :disabled="shouldDisableForm"
                      />
                   </v-col>
                   <v-col cols="2">
                    <v-icon
                      size="16"
                      class="ml-2 mr-1"
                      @click="deleteItem(idx)"
                      v-if="isAdminUser"
                    >
                      mdi-delete
                    </v-icon>
                   </v-col>
                 </v-row>
                 <v-btn
                    class="mt-4"
                    depressed
                    small
                    color="success"
                    @click="addNewItem"
                    v-if="isAdminUser"
                  >
                    Agregar más items
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    depressed
                    color="warning"
                    @click="$router.push('/productos')"
                  >
                    Regresar
                  </v-btn>
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="handleSubmitProduct"
                    :disabled="disableSubmit"
                    v-if="isAdminUser"
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
  name: 'ProductoForm',
  data () {
    return {
      productForm: {
        name: '',
        price: 0,
        items: [
          {
            id: 0,
            quantity: 0
          }
        ]
      },
      stringRule: [
        v => !!v || 'Campo requerido',
        v => (v && v.length > 5) || 'Valor debe ser superior a 5'
      ],
      numberRule: [
        v => !!v || 'Campo requerido',
        v => (v && v > 0) || 'Valor debe ser superior a 0'
      ]
    }
  },
  async created () {
    if (this.isEditForm) {
      await this.fetchProduct({ vm: this, payload: { id: this.getFormId } })
    } else {
      this.resetProduct()
    }
    this.populateProduct()

    if (!this.items.length) {
      this.fetchItems({ vm: this })
    }
  },
  computed: {
    ...mapState('products', ['product', 'productLoader']),
    ...mapState('items', ['items']),
    ...mapGetters('items', ['getMappedItems']),
    ...mapGetters('auth', ['isAdminUser']),
    getFormTitle () {
      if (this.isAdminUser) {
        return this.isEditForm ? 'Editar Producto' : 'Crear Producto'
      }
      return 'Producto'
    },
    isEditForm () {
      return !!this.getFormId
    },
    getFormId () {
      return this.$route.params.id
    },
    disableSubmit () {
      return this.productForm.name.length < 5 ||
        this.productForm.precio < 1 ||
        this.productForm.items.filter(item => item.id === 0 || (item.quantity < 1 || !item.quantity)).length > 0 ||
        this.productForm.items.length === 0
    },
    shouldDisableForm () {
      return !this.isAdminUser
    }
  },
  methods: {
    ...mapActions('products', ['createProduct', 'fetchProduct', 'resetProduct', 'updateProduct']),
    ...mapActions('items', ['fetchItems']),
    async handleSubmitProduct () {
      const { id, ...payload } = this.productForm

      try {
        if (this.isEditForm) {
          // Update new Product
          await this.updateProduct({
            vm: this,
            payload: {
              id: this.getFormId,
              data: payload
            }
          })
          this.populateProduct()
        } else {
          // Create new Product
          await this.createProduct({ vm: this, payload: payload })
        }
      } catch (e) {
        console.error(e)
      }
    },
    addNewItem () {
      this.productForm.items.push({
        id: 0,
        quantity: 0
      })
    },
    deleteItem (idx) {
      this.productForm.items.splice(idx, 1)
    },
    populateProduct () {
      this.productForm = JSON.parse(JSON.stringify(this.product))
    }
  }
}
</script>
