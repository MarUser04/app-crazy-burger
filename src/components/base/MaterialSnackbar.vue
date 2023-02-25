<template>
  <v-snackbar
    v-model="showSnackbar"
    class="v-snackbar--material"
    v-bind="{
      ...$attrs,
      'color': 'transparent'
    }"
    top
    right
    :timeout="timer"
  >
    <v-alert
      v-model="showSnackbar"
      :color="$attrs.color"
      :dismissible="dismissible"
      :type="type"
      class="ma-0"
      dark
    >
      {{ message }}
    </v-alert>
  </v-snackbar>
</template>
<script>
export default {
  name: 'BaseMaterialSnackbar',

  data () {
    return {
      dismissible: true,
      internalValue: this.value,
      showSnackbar: false,
      message: '',
      type: 'success',
      timer: 2500
    }
  },

  mounted () {
    this.$root.$on('showToastMessage', this.show)
  },

  methods: {
    show (data) {
      this.message = data.message || 'missing "message".'
      this.type = data.type || 'success'
      this.timer = data.timer || 2500
      this.showSnackbar = true
    }
  }
}
</script>

<style lang="sass">
  .v-snackbar--material
    margin-top: 32px
    margin-bottom: 32px

    .v-alert--material,
    .v-snack__wrapper
      border-radius: 4px
      margin-right: 12px

    .v-snack__content
      overflow: visible
      padding: 0
      flex: 1 0 100%
</style>
