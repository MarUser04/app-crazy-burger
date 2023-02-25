<template>
  <v-app>
    <base-material-snackbar/>
    <router-view :key="$route.path" />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
    BaseMaterialSnackbar: () => import('@/components/base/MaterialSnackbar')
  }
}
</script>
