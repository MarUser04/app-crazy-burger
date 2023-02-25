<template>
  <div>
    <dashboard-core-drawer />

    <dashboard-core-view />
  </div>
</template>

<script>
export default {
  name: 'DashboardIndex',

  components: {
    DashboardCoreDrawer: () => import('./components/core/Drawer'),
    DashboardCoreView: () => import('./components/core/View')
  },

  data: () => ({
    expandOnHover: false
  })
}
</script>
