export default {
  SET_PRODUCTS (state, { data = [], count = 0 }) {
    state.products = data
    state.productsTotal = count
  },
  SET_PRODUCTS_LOADER (state, status) {
    state.productsLoader = status
  },
  SET_PRODUCT (state, { id, name, price, items }) {
    state.product = {
      id,
      name,
      price,
      items
    }
  },
  SET_PRODUCT_LOADER (state, status) {
    state.productLoader = status
  }
}
