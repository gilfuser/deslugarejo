<template>
  <v-layout justify-center row class="mt-5">
    <v-flex xs10 sm8 md6 lg4 xl3 >
      <div>
        <v-card class="gray4 pb-4">
          <v-toolbar color="blueDarker" flat dense>
            <v-toolbar-title>Create Channel</v-toolbar-title>
          </v-toolbar>
          <form @submit.prevent="onCreateChannel"
          class="mx-4"
          prepend-icon="radio"
          >
            <!-- :error-messages="labelErrors" -->
            <v-text-field
            v-model="title"
            :counter="20"
            label="Channel Name"
            ref="title"
            required
            autofocus
            class="mt-3"
            ></v-text-field>
            <!-- @input="$v.title.$touch()"
            @blur="$v.title.$touch()" -->
            <!-- :error-messages="descriptionErrors" -->
            <v-textarea
            v-model="description"
            maxlength="200"
            auto-grow
            rows="3"
            box
            :counter="200"
            label="Description"
            required
            ></v-textarea>
            <!-- @input="$v.description.$touch()"
            @blur="$v.description.$touch()" -->
            <v-radio-group
            label="Channel Type"
            v-model="type"
            >
              <v-layout row align-start mt-2>
                <v-radio
                row
                v-for="n in 2"
                :key="n"
                :label="['all<>all', 'one<>all'][n-1]"
                :value="['all-to-all', 'one-to-all'][n-1]"
                ></v-radio>
              </v-layout>
            </v-radio-group>
            <v-card-actions>
              <v-btn
              color="primary"
              type="submit"
              depressed
              style="margin-left:-5px"
              @click="date = new Date()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </form>
        </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  // import { validationMixin } from "vuelidate"
  // import { required, minLength, maxLength } from "vuelidate/lib/validators"
  import {fireDb} from '../firebase'
  import { /*mapGetters,*/  mapMutations } from 'vuex'

  export default {
    name: 'createChannel',
    // mixins: [validationMixin],
    data: () => ({
      title: null,
      type: 'all-to-all',
      description: null,
      date: null,
      connected: false,
      status: undefined,
      submitStatus: null,
      channel: {}
    }),
    // validations: {
    //     title: {
    //       required,
    //       maxLength: maxLength(20)
    //     },
    //     description: {
    //       required,
    //       minLength: minLength(20),
    //       maxLength: maxLength(200)
    //     },
    // },
    computed: {
      // labelErrors () {
      //   const errors = []
      //   if (!this.$v.title.$dirty) return errors
      //   !this.$v.title.maxLength && errors.push('Channel title must be at most 20 characters long')
      // !this.$v.title.required && errors.push('Channel title is required.')
      // return errors
      // },
      // descriptionErrors () {
      //   const errors = []
      //   if (!this.$v.description.$dirty) return errors
      //   !this.$v.description.maxLength && errors.push('Description must be at most 200 characters long')
      //   !this.$v.description.minLength && errors.push('Description must be at least 20 characters long')
      // !this.$v.description.required && errors.push('Description is required.')
      // return errors
      // },
    },
    methods: {
      onCreateChannel () {
        // this.$v.$touch()
        // if (this.$v.$invalid) {
        //   this.submitStatus = 'ERROR'
        // } else {
        // this.$store.commit('createChannel', this.channel)
        this.channel = {
          title: this.title,
          to: `/channels/${this.title}`,
          uuid: this.$store.getters.name,
          type: this.type,
          initiator: true,
          description: this.description,
          releasedAt: this.date,
          joinedIn: [this.$store.getters.name],
          isJoined: true
          }
          this.$store.commit('channels/setInitiator', true)
          this.writeToFirestore()
          this.$store.commit('channels/add', this.channel)
          this.$router.push(this.channel.to)
      },
      ...mapMutations({
        setInitiator: ('channels/setInitiator', true)
      }),
      async writeToFirestore() {
        let that = this
        const ref = fireDb.collection("channels").doc(this.title)
        try {
          await ref.set(that.channel)
        } catch (e) {
          // TODO: error handling
          console.error(e)
        }
        // this.writeSuccessful = true
      }
    },
  }
</script>
