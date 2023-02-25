export default {
  getMappedItems (state) {
    return state.items.map(({ name, id }) => ({ text: name, value: id }))
  },
  getMappedExtraItems (state) {
    return state.items
      .filter((item) => item.isExtra)
      .map(({ name, id }) => ({ text: name, value: id }))
  }
}
