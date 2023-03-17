export default {
  SET_ORDERS (state, { data = [], count = 0 }) {
    state.orders = data
    state.ordersTotal = count
  },
  SET_ORDERS_LOADER (state, status) {
    state.ordersLoader = status
  },
  SET_ORDER (state, { id, originalAmount, clientName = '', status, orderDetails = [], paidAmount = 0 }) {
    state.order = {
      id,
      clientName,
      status,
      orderDetails,
      originalAmount,
      paidAmount
    }
  },
  SET_ORDER_LOADER (state, status) {
    state.ordersLoader = status
  }
}
