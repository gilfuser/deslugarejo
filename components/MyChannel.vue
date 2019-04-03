<template>
  <div>
    <v-card class="gray4 pb-4">
      <v-toolbar color="blueDarker" flat dense>
        <v-toolbar-title>Create Channel</v-toolbar-title>
      </v-toolbar>
      <form @submit.prevent="onCreateChannel"
      class="mx-4"
      prepend-icon="radio"
      >
        <!-- <v-text-field
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
        -->
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
</template>

<script>
export default {
  name: 'myChannel',
  props: ['label', 'description', 'type', 'date']
}
</script>