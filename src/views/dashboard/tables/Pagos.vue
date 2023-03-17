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
          </v-toolbar>
        </template>

        <template #[`item.status`]="{ item }">
          {{ getStatus(item.status) }}
        </template>

        <template #[`item.currency`]="{ item }">
          <span class="currency-field">{{ getCurrency(item.currency) }}</span>
        </template>

        <template #[`item.updatedAt`]="{ item }">
          {{ item.updatedAt | formatDate }}
        </template>

        <template #[`item.verDetalles`]="{ item }">
          <v-icon
            v-if="getStatus(item.status) === 'Finalizada'"
            size="16"
            class="ml-2 mr-1"
            @click="handlePayment(item)"
          >
            mdi-cash-clock
          </v-icon>
          <v-icon
            size="16"
            class="ml-2 mr-1"
            @click="openDetails(item)"
          >
            mdi-eye
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import debounce from 'lodash.debounce'
import { format } from 'date-fns'

export default {
  name: 'OrdenesView',
  props: {
    title: {
      type: String,
      default: 'Ordenes Pagadas'
    }
  },
  created () {
    /**
     * Calling debounce here because Each instance needs its own debounce function if they are supposed to act independently.
     */
    this.debounceSearchPaidOrders = debounce(this.fetchOrdersWithParams, 500)
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
          text: 'Monto Original',
          align: 'start',
          sortable: true,
          value: 'originalAmount',
          class: 'primary--text'
        },
        {
          text: 'Monto Pagado',
          align: 'start',
          sortable: true,
          value: 'paidAmount',
          class: 'primary--text'
        },
        {
          text: 'Moneda de Pago',
          align: 'start',
          sortable: false,
          value: 'currency',
          class: 'primary--text'
        },
        {
          text: 'Fecha y Hora de Pago',
          align: 'start',
          sortable: true,
          value: 'updatedAt',
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
    ...mapActions('orders', ['fetchOrders']),
    openDetails (item) {
      this.$router.push({ path: `/pagos/form/${item.id}` })
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

      params.paid = true

      this.fetchOrders({ vm: this, payload: params })
    },
    getStatus (status) {
      return this.status.filter(option => option?.value === status)[0]?.text
    },
    getCurrency (currency) {
      return currency?.name
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
        this.debounceSearchPaidOrders(search)
      }
    }
  },
  filters: {
    formatDate: function (value) {
      if (!value) return ''
      console.log(value)
      return format(new Date(value), 'dd/MM//yyyy h:mm a')
    }
  },
  computed: {
    ...mapState('orders', ['orders', 'ordersLoader', 'ordersTotal']),
    ...mapGetters('auth', ['isAdminUser'])
  }
}
</script>

<style scoped lang="scss">
.currency-field {
  text-transform: capitalize;
}
</style>
