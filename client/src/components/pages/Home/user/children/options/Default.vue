<script>
export default {
  name: "Default",
  props: {
    options: Object,
  },
  data: () => ({
    rules: [
      (v) => !/\d/gi.test(v) || "this field does not require a number",
      (v) => !!v || "this field is required",
    ],
  }),
  computed: {
    persons_involved: {
      get() {
        return typeof this.options.persons_involved === "object"
          ? this.options.persons_involved.join(",")
          : this.options.persons_involved;
      },

      set(persons) {
        const array_of_persons = persons.split(",");
        return (this.options.persons_involved = array_of_persons);
      },
    },
  },
};
</script>
<template>
  <v-col cols="12" class="py-0">
    <v-row justify="start" align="start">
      <!-- <v-col cols="12">
        <v-container fluid class="px-0 pb-0">
          <v-subheader class="secondary--text px-0">
            <v-icon color="secondary" class="mr-2">mdi-information</v-icon>
            Person/s Involved
          </v-subheader>
          <v-divider />

          <v-textarea
            col="12"
            :rules="rules"
            v-model="persons_involved"
            title="Enter each person/s involved name (comma separated)"
            outlined
            hint="comma separated for multiple entities"
          />
        </v-container>
      </v-col> -->
    </v-row>
  </v-col>
</template>
