<template>
  <v-layout justify-center row class="mt-5">
    <v-flex xs10 sm8 md6 lg4 xl3 >
      <div>
        <v-card class="gray4 pb-4">
          <v-toolbar color="blueDarker" flat dense>
            <v-toolbar-title>Create Channel</v-toolbar-title>
          </v-toolbar>
          <form @submit.prevent="writeToFirestore"
          class="mx-4"
          prepend-icon="radio"
          >
            <v-text-field
            v-model="label"
            :error-messages="labelErrors"
            :counter="20"
            label="Channel Name"
            ref="label"
            required
            autofocus
            class="mt-3"
            @input="$v.label.$touch()"
            @blur="$v.label.$touch()"
            ></v-text-field>
            <v-textarea
            v-model="description"
            :error-messages="descriptionErrors"
            maxlength="200"
            auto-grow
            rows="3"
            box
            :counter="200"
            label="Description"
            required
            @input="$v.description.$touch()"
            @blur="$v.description.$touch()"
            ></v-textarea>
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
              @click="date = $moment().format('Y-M-D-HH-mm-SS')"
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
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength } from "vuelidate/lib/validators"
import {fireDb} from '~/plugins/firebase.js'

  export default {
    name: 'create-channel',
    mixins: [validationMixin],
    data: () => ({
      label: '',
      type: 'all-to-all',
      description: '',
      date: undefined,
      connected: false,
      status: undefined,
      submitStatus: null,
      channel: {}
    }),
    validations: {
        label: {
          required,
          maxLength: maxLength(20)
        },
        description: {
          required,
          minLength: minLength(20),
          maxLength: maxLength(200)
        },
    },
    computed: {
      labelErrors () {
        const errors = []
        if (!this.$v.label.$dirty) return errors
        !this.$v.label.maxLength && errors.push('Channel label must be at most 20 characters long')
      !this.$v.label.required && errors.push('Channel label is required.')
      return errors
      },
      descriptionErrors () {
        const errors = []
        if (!this.$v.description.$dirty) return errors
        !this.$v.description.maxLength && errors.push('Description must be at most 200 characters long')
        !this.$v.description.minLength && errors.push('Description must be at least 20 characters long')
      !this.$v.description.required && errors.push('Description is required.')
      return errors
      },
    },
    methods: {
      onCreateChannel () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        } else {
        // this.$store.commit('createChannel', this.channel)
        this.channel = {
          title: this.label,
          to: `/channels/${this.label}`,
          label: this.label,
          uuid: this.$store.state.name,
          type: this.type,
          initiator: true,
          swarm: false,
          description: this.description,
          date: this.date,
          joinedIn: [this.$store.state.name],
          }
        this.$store.commit('setInitiator', true)
        // this.swarm = this.$store.getters.swarm
        // this.$emit('setSwarm', that.swarm)
        // this.$emit('signaling', 'connecting...')
        this.$axios.get(`https://serversignaling.herokuapp.com`)
        .then((response) => {
          this.$store.commit('createChannel', this.channel)
          this.$router.push(this.channel.to)
          // this.$store.dispatch('onCreateSwarm', this.channel)
          // this.$store.state.channel = this.label
        }).catch((error) => {
          that.status = 'An error occurred:' + error
        });
        }
      },
      async writeToFirestore() {
        const ref = fireDb.collection("channels").doc("test")
        const document = {
          text: "This is a test message."
        }
        try {
          await ref.set(document)
        } catch (e) {
          // TODO: error handling
          console.error(e)
        }
        // this.writeSuccessful = true
      }
    },
  }
</script>
