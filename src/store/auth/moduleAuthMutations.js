export default {
  SET_USER (state, { id = 0, username = '', firstName = '', lastName = '', role = '' }) {
    state.user = {
      id,
      username,
      firstName,
      lastName,
      role
    }
  }
}
