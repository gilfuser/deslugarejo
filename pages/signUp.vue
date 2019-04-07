<template>
  <v-layout justify-center row class="mt-5">
    <v-flex xs10 sm8 md6 lg4 xl3 >
      <div>
        <v-card class="gray4">
          <v-toolbar color="blueDarker" flat dense>
            <v-toolbar-title class="card-title">
              SignIn
            </v-toolbar-title>
          </v-toolbar>
        <form 
        min-width="250px"
        class="mx-4"
        >
          <v-text-field
          :counter="20"
          label="Name"
          required
          autofocus
          class="mt-3 px-5"
          @input="setName"
          id="name"
          @keyup.enter="setName"
          ></v-text-field>
          <v-spacer style="margin-top: 10px"></v-spacer>
          </form>
          <v-flex shrink>

          <v-card class="gray4 pb-3 mt-4">
            <no-ssr>
            <v-expand-transition>
              <firebase-ui v-show="name.length > 0"/>
            </v-expand-transition>
            </no-ssr>
          </v-card>
          </v-flex>
        </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import FirebaseUi from '@/components/FirebaseUi';

  export default {
    components: {
      FirebaseUi
    },
    data: () => ({
      name: '',
      dialog: false,
      form: false,
      isLoading: false,
      submitStatus: null
    }),
    methods: {
      setName(value) {
        this.name = value
        this.$store.commit("setName", value)
      },
    },
  }
</script>


