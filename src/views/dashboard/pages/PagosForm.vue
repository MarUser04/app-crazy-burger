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
                    v-model="paymentForm.clientName"
                    class="purple-input"
                    label="Nombre del Cliente"
                    :rules="stringRule"
                    disabled
                  />
                </v-col>
                <v-col
                  cols="12"
                >
                 <v-row align="center" v-for="(item, idx) in paymentForm.products" :key="idx">
                   <v-col cols="4">
                      <v-text-field
                        v-model="paymentForm.products[idx].id"
                        class="purple-input"
                        label="Producto"
                        :rules="stringRule"
                        disabled
                      />
                   </v-col>
                   <v-col cols="4">
                      <v-text-field
                        v-model.number="paymentForm.products[idx].quantity"
                        class="purple-input"
                        label="Cantidad del Producto"
                        type="number"
                        :rules="numberRule"
                        disabled
                      />
                   </v-col>
                   <v-col cols="4">
                      <v-text-field
                        v-model="paymentForm.products[idx].priceTotal"
                        class="purple-input"
                        label="Precio"
                        :rules="stringRule"
                        disabled
                      />
                   </v-col>
                 </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="paymentForm.amount"
                        class="purple-input"
                        label="Total a pagar en $"
                        disabled
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="paymentForm.paidAmount"
                        class="purple-input"
                        :label="getPaidAmountLabel"
                        :disabled="shouldDisableForm"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="paymentForm.currency"
                        :items="currencies"
                        :menu-props="{ maxHeight: '400' }"
                        label="Selecciona la moneda para pagar"
                        item-text="text"
                        hint="Moneda"
                        persistent-hint
                        :disabled="shouldDisableForm"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    depressed
                    color="warning"
                    @click="$router.push('/pagos')"
                  >
                    Regresar
                  </v-btn>
                  <v-btn
                    v-if="!isReadOnlyForm"
                    :disabled="!paymentForm?.paidAmount"
                    depressed
                    color="success"
                    @click="handleSubmitProduct"
                  >
                    Pagar
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
  name: 'PagosForm',
  data () {
    return {
      paymentForm: {
        clientName: '',
        status: 0,
        products: [{
          id: 0,
          quantity: 0
        }],
        paidAmount: 0
      },
      stringRule: [
        v => !!v || 'Campo requerido',
        v => (v && v.length >= 3) || 'Valor debe ser superior a 3'
      ],
      numberRule: [
        v => !!v || 'Campo requerido',
        v => (v && v > 0) || 'Valor debe ser superior a 0'
      ],
      currencies: ['dolares', 'pesos', 'bolivares']
    }
  },
  async created () {
    const id = this.getFormId
    await this.fetchOrder({ vm: this, payload: { id } })
    this.populatePayment()
  },
  computed: {
    ...mapState('orders', ['order', 'orderLoader']),
    ...mapGetters('auth', ['isAdminUser']),
    getFormTitle () {
      return this.isReadOnlyForm ? 'Detalles de Pago' : 'Crear Pago'
    },
    isReadOnlyForm () {
      return this.order.status === 3
    },
    getFormId () {
      return this.$route.params.id
    },
    shouldDisableForm () {
      return !this.isAdminUser || this.isReadOnlyForm
    },
    getPaidAmountLabel () {
      return this.isReadOnlyForm ? 'Total pagado' : 'Total a pagar'
    }
  },
  methods: {
    ...mapActions('orders', ['fetchOrder', 'submitPayment']),
    async handleSubmitProduct () {
      const { id, paidAmount, currency } = this.paymentForm
      try {
        await this.submitPayment({
          vm: this,
          payload: {
            id,
            data: { amount: +paidAmount, currency }
          }
        })
        this.$router.push({ path: '/pagos' })
      } catch (err) {
        console.error(err)
      }
    },
    populatePayment () {
      const { id, clientName, orderDetails = [], originalAmount = 0, paidAmount = 0 } = this.order
      const mappedOrder = {
        id,
        clientName,
        products: orderDetails.map((product) => ({ id: product?.name, priceTotal: product?.quantity * product?.price })),
        amount: originalAmount,
        currency: 'dolares',
        paidAmount
      }
      this.paymentForm = JSON.parse(JSON.stringify(mappedOrder))
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
