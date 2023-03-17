export default {
  getUserProfile (state) {
    return state.user
  },
  isAdminUser (state) {
    return state.user?.role === 'admin'
  },
  getUserFullName (state) {
    const firstName = state.user.firstName ?? ''
    const lastName = state.user.lastName ?? ''

    return `${firstName} ${lastName}`
  }
}
