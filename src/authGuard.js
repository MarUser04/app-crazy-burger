import store from '@/store'

const authGuard = async (to, from, next) => {
  if (!to.meta.notRequiresAuth) {
    await store.dispatch('auth/fetchUserProfile')
    const userProfile = store.getters['auth/getUserProfile']
    if (userProfile.id === 0) {
      return next({ path: '/login' })
    }

    if (to.meta.requireAdmin) {
      const isAdmin = store.getters['auth/isAdminUser']
      if (isAdmin) {
        return next()
      }
      return next({ path: '/' })
    }

    return next()
  }

  return next()
}

export default authGuard
