<template>
  <v-app>
    <v-main class="login">
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            class="login__flex-wrapper"
          >
            <v-card
              class="elevation-12"
              :loading="isLoading"
            >
              <template slot="progress">
                <v-progress-linear
                  color="lighten"
                  height="10"
                  indeterminate
                />
              </template>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Inicio de Sesión</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form
                  ref="loginForm"
                  v-model="validForm"
                  lazy-validation
                  @keyup.native.enter="handleLogin($event)"
                >
                  <v-card-text>
                    <v-text-field
                      v-model="username"
                      prepend-icon="mdi-account"
                      label="Username"
                      :rules="inputRules"
                      hide-details="auto"
                    />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      :type="showPassword ? 'text' : 'password'"
                      :rules="inputRules"
                      hide-details="auto"
                      prepend-icon="mdi-lock"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                    />
                  </v-card-text>
                  <v-alert
                    v-if="errorMessage"
                    dense
                    prominent
                    text
                    dismissible
                    type="error"
                  >
                    {{ errorMessage }}
                  </v-alert>
                </v-form>
              </v-card-text>
              <v-card-actions class="login__actions">
                <v-btn
                  color="primary"
                  :disabled="isLoading"
                  @click="handleLogin"
                >
                  Iniciar Sesión
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UserLogin',
  data () {
    return {
      username: '',
      password: '',
      errorMessage: '',
      validForm: true,
      isLoading: false,
      showPassword: false,
      inputRules: [
        value => !!value || 'Campo Requerido'
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    isValidLoginForm () {
      return this.$refs.loginForm.validate()
    },
    async handleLogin () {
      this.errorMessage = ''

      if (!this.isValidLoginForm()) {
        return false
      }

      try {
        this.isLoading = true
        await this.login({ username: this.username, password: this.password })
        await this.$router.push('/')
      } catch (e) {
        this.errorMessage = e.response.data.message
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="sass">
.login
  &__flex-wrapper
    max-width: 600px

  &__actions
    display: flex
    flex-wrap: wrap
    gap: 6px
    justify-content: center
</style>
