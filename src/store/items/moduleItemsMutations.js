export default {
  SET_ITEMS (state, { data = [], count = 0 }) {
    state.items = data
    state.itemsTotal = count
  },
  SET_ITEMS_LOADER (state, status) {
    state.itemsLoader = status
  },
  SET_ITEM (state, { id, name, quantity }) {
    state.item = {
      id: id,
      name: name,
      quantity: quantity
    }
  },
  SET_ITEM_LOADER (state, status) {
    state.itemLoader = status
  }
}
