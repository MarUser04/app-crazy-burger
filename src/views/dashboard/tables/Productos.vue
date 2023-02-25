<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-food"
      :title="title"
      class="px-5 py-3"
    >
      <v-data-table
        :loading="productsLoader"
        :headers="headers"
        :items="products"
        class="elevation-1"
        @page-count="pageCount = $event"
        :server-items-length="productsTotal"
        :options.sync="tableOptions"
        :footer-props="{
          'items-per-page-options': [5, 10, 15, 25]
        }"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <!-- Search Bar -->
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <!-- New Button -->
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="openCreate"
            >
              Nuevo Producto
            </v-btn>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">¿Está seguro de que desea eliminar este elemento?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text>Cancelar</v-btn>
                  <v-btn color="blue darken-1" text>Confirmar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template #[`item.Editar`]>
          <v-icon
            size="16"
            class="ml-2 mr-1"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="16"
            class="ml-2 mr-1"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import debounce from 'lodash.debounce'

export default {
  name: 'ProductosView',
  props: {
    title: {
      type: String,
      default: 'Productos'
    }
  },
  computed: {
    ...mapState('products', ['products', 'productsLoader', 'productsTotal'])
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    openCreate () {
      this.$router.push({ path: '/productos/form' })
    },
    ...mapActions('products', ['fetchProducts', 'deleteProduct']),
    fetchProductsWithParams (searchFromDebounce) {
      const params = {}
      const { itemsPerPage, page, sortBy, sortDesc } = this.tableOptions
      if (itemsPerPage > 0) {
        params.limit = itemsPerPage
        params.offset = (page - 1) * itemsPerPage
      }

      if (sortBy.length === 1 && sortDesc.length === 1) {
        const sortColumn = sortBy[0]
        const sortDirection = sortDesc[0] ? 'DESC' : 'ASC'
        params.orderBy = sortColumn
        params.orderDir = sortDirection
      }

      if (this.search) {
        params.search = this.search
      }

      this.fetchProducts({ vm: this, payload: params })
    }
  },
  created () {
    this.debounceSearchProducts = debounce(this.fetchProductsWithParams, 500)
  },
  watch: {
    tableOptions: {
      handler () {
        this.fetchProductsWithParams()
      },
      deep: true
    },
    search: {
      handler (search) {
        this.debounceSearchProducts(search)
      }
    }
  },
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: true,
          value: 'name',
          class: 'primary--text'
        },
        {
          text: 'Precio',
          align: 'start',
          sortable: true,
          value: 'price',
          class: 'primary--text'
        },
        {
          text: 'Ver Detalles',
          align: 'start',
          sortable: false,
          class: 'primary--text',
          value: 'Editar'
        }
      ],
      tableOptions: {},
      page: 1,
      pageCount: 1,
      ProductsPerPage: 10,
      search: '',
      dialogDelete: false,
      idProductToDelete: null,
      currentPage: 1
    }
  }
}
</script>
