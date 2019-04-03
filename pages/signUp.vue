<template>
  <v-layout justify-center row class="mt-5">
    <v-flex xs10 sm8 md6 lg4 xl3 >
      <div>
        <v-card class="gray4 pb-3">
          <v-toolbar color="blueDarker" flat dense>
            <v-toolbar-title class="card-title">
              SignIn
            </v-toolbar-title>
          </v-toolbar>
        <form @submit.prevent="submit"
        min-width="250px"
        class="mx-4"
        >
          <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          :counter="20"
          label="Name"
          ref="name"
          required
          autofocus
          class="mt-3"
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          ></v-text-field>
          <v-spacer style="margin-top: 10px"></v-spacer>
          <v-text-field
          v-model="email"
          :error-messages="emailErrors"
          label="E-mail"
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          ></v-text-field>
          <v-spacer style="margin-top: 10px"></v-spacer>
          <v-text-field
          v-model="password"
          :error-messages="passwordErrors"
          label="Password"
          type="password"
          counter="6"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          ></v-text-field>
          <div>

            <v-spacer class="mt-4"></v-spacer>
            <p class="typo__p success--text" v-if="submitStatus === 'OK'">Welcome!</p>
            <p class="typo__p error--text"
              v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            <p class="typo__p warning--text" v-if="submitStatus === 'PENDING'">Sending...</p>
            </div>
            <v-btn
            @click="submit"
            color="primary"
            depressed
            style="margin-left:-1px"
            >
            submit
            </v-btn>
            <v-btn
            @click="clear"
            depressed
            color="secondary"
            >
              clear
            </v-btn>
          </form>
        </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from "vuelidate";
  import { required, minLength, maxLength, email } from "vuelidate/lib/validators";

  export default {
    mixins: [validationMixin],
    data: () => ({
      name: '',
      email: undefined,
      password: undefined,
      dialog: false,
      form: false,
      isLoading: false,
      showPass: false,
      submitStatus: null
    }),
    validations: {
        name: {
          required,
          maxLength: maxLength(20)
        },
        email: {
          required,
          email
        },
        password: {
          minLength: minLength(6),
          required,
        }
    },
    methods: {
      setName(value) {
        this.name = value
        // this.$v.name.$touch()
        this.$store.commit("setName", this.name)
      },
      setEmail(value) {
        this.email = value
        // this.$v.email.$touch()
      },
      submit() {
        // this.$emit("nextComponent", "CreateChannel");
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        } else {
          // do your submit logic here
          this.submitStatus = 'PENDING';
          (() => {
            // console.log('test')
            this.$store.commit("setName", this.name);
            this.$store.commit("isSignedUp", true);
            this.$store.dispatch("signUserUp", {
              email: this.email,
              password: this.password
            });
            this.submitStatus = 'OK'
          })()
          // setTimeout(() => {
          //   this.submitStatus = 'OK'
          // }, 500)
        }
      },
      clear () {
        this.$v.$reset()
        this.name = ''
        this.email = ''
        this.password = ''
        this.submitStatus = null
      }
    },
    computed: {
      // skip() {
        // return () => {
          // this.$store.commit("setName", this.name);
          // this.$emit('nextComponent', 'CreateChannel')
          // this.$router.push("/");
        // };
      // },
      user() {
        return this.$store.getters.user;
      },
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 20 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.minLength && errors.push('Must have at least 6 characters')
        !this.$v.password.required && errors.push('Password is required')
        return errors
      }
    },
    watch: {
      user (value) {
        if(value) {
          this.$router.push('/')
        }
      }
    },
  };
</script>

<style lang="sass">
</style>