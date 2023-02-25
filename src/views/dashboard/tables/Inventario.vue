<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-list-box"
      :title="title"
      class="px-5 py-3"
    >
      <v-data-table
        :loading="itemsLoader"
        :headers="headers"
        :items="items"
        class="elevation-1"
        :page.sync="currentPage"
        @page-count="pageCount = $event"
        :server-items-length="itemsTotal"
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
              Nuevo Item
            </v-btn>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">¿Está seguro de que desea eliminar este elemento?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template #[`item.verDetalles`]="{ item }">
          <v-icon
            size="16"
            class="ml-2 mr-1"
            @click="openEdit(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="16"
            class="ml-2 mr-1"
            @click="handleDeleteItem(item)"
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
  name: 'InventarioView',
  props: {
    title: {
      type: String,
      default: 'Inventario'
    }
  },
  created () {
    /**
     * Calling debounce here because Each instance needs its own debounce function if they are supposed to act independently.
     */
    this.debounceSearchItems = debounce(this.fetchItemsWithParams, 500)
  },
  methods: {
    ...mapActions('items', ['fetchItems', 'deleteItem']),
    openCreate () {
      this.$router.push({ path: '/inventario/form' })
    },
    openEdit (item) {
      this.$router.push({ path: `/inventario/form/${item.id}` })
    },
    fetchItemsWithParams (searchFromDebounce) {
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

      this.fetchItems({ vm: this, payload: params })
    },
    handleDeleteItem (item) {
      this.idItemToDelete = item.id
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      if (this.idItemToDelete) {
        this.deleteItem({
          vm: this,
          payload: { id: this.idItemToDelete }
        })
          .then(() => {
            if (this.currentPage === 1) {
              this.fetchItemsWithParams()
            } else {
              this.currentPage = 1
            }
          })
          .finally(() => {
            this.closeDelete()
          })
      }
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.idItemToDelete = null
      })
    }
  },
  watch: {
    tableOptions: {
      handler () {
        this.fetchItemsWithParams()
      },
      deep: true
    },
    search: {
      handler (search) {
        this.debounceSearchItems(search)
      }
    }
  },
  computed: {
    ...mapState('items', ['items', 'itemsLoader', 'itemsTotal'])
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
          text: 'Porciones',
          align: 'start',
          sortable: true,
          value: 'quantity',
          class: 'primary--text'
        },
        {
          text: 'Ver Detalles',
          align: 'start',
          sortable: false,
          class: 'primary--text',
          value: 'verDetalles'
        }
      ],
      tableOptions: {},
      page: 1,
      pageCount: 1,
      itemsPerPage: 10,
      search: '',
      dialogDelete: false,
      idItemToDelete: null,
      currentPage: 1
    }
  }
}
</script>
