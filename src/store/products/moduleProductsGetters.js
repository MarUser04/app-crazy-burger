export default {
  getMappedProduct (state) {
    return state.products.map(({ name, id }) => ({ text: name, value: id }))
  }
}
