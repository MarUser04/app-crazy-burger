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
        :loading="ordersLoader"
        :headers="headers"
        :items="orders"
        class="elevation-1"
        :page.sync="currentPage"
        @page-count="pageCount = $event"
        :server-items-length="ordersTotal"
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
              v-if="isAdminUser"
            >
              Nueva Orden
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

        <template #[`item.status`]="{ item }">
          {{ getStatus(item.status) }}
        </template>

        <template #[`item.verDetalles`]="{ item }">
          <v-icon
            v-if="isAdminUser && getStatus(item.status) === 'Finalizada'"
            size="16"
            class="ml-2 mr-1"
            @click="handlePayment(item)"
          >
            mdi-cash-clock
          </v-icon>
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
            @click="handleDeleteOrder(item)"
            v-if="isAdminUser"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import debounce from 'lodash.debounce'

export default {
  name: 'OrdenesView',
  props: {
    title: {
      type: String,
      default: 'Ordenes'
    }
  },
  created () {
    /**
     * Calling debounce here because Each instance needs its own debounce function if they are supposed to act independently.
     */
    this.debounceSearchOrders = debounce(this.fetchOrdersWithParams, 500)
  },
  data () {
    return {
      headers: [
        {
          text: 'Cliente',
          align: 'start',
          sortable: true,
          value: 'clientName',
          class: 'primary--text'
        },
        {
          text: 'Estado',
          align: 'start',
          sortable: true,
          value: 'status',
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
      currentPage: 1,
      status: [
        { text: 'Cancelada', value: -1 },
        { text: 'En Espera', value: 0 },
        { text: 'En Proceso', value: 1 },
        { text: 'Finalizada', value: 2 },
        { text: 'Entregada', value: 3 }
      ]
    }
  },
  methods: {
    ...mapActions('orders', ['fetchOrders', 'deleteOrder']),
    openCreate () {
      this.$router.push({ path: '/ordenes/form' })
    },
    openEdit (item) {
      this.$router.push({ path: `/ordenes/form/${item.id}` })
    },
    fetchOrdersWithParams (searchFromDebounce) {
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

      this.fetchOrders({ vm: this, payload: params })
    },
    handleDeleteOrder (item) {
      this.idItemToDelete = item.id
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      if (this.idItemToDelete) {
        this.deleteOrder({
          vm: this,
          payload: { id: this.idItemToDelete }
        })
          .then(() => {
            if (this.currentPage === 1) {
              this.fetchOrdersWithParams()
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
    },
    getStatus (status) {
      return this.status.filter(option => option.value === status)[0]?.text
    },
    handlePayment (item) {
      this.$router.push({ path: `/pagos/form/${item.id}` })
    }
  },
  watch: {
    tableOptions: {
      handler () {
        this.fetchOrdersWithParams()
      },
      deep: true
    },
    search: {
      handler (search) {
        this.debounceSearchOrders(search)
      }
    }
  },
  computed: {
    ...mapState('orders', ['orders', 'ordersLoader', 'ordersTotal']),
    ...mapGetters('auth', ['isAdminUser'])
  }
}
</script>
