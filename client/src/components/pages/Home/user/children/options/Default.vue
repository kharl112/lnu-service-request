<script>
export default {
  name: "Default",
  props: {
    options: Object,
  },
  data: () => ({
    rules: [(v) => !/\d/gi.test(v) || "this field does not require a number"],
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
  <v-col cols="12" sm="12" md="4">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="pt-0 pb-0">
          <v-subheader class="secondary--text">
            <v-icon color="secondary" class="mr-2">mdi-information</v-icon>
            Person/s Involved (Optional)
          </v-subheader>
          <v-divider />

          <v-textarea
            col="12"
            :rules="rules"
            v-model="persons_involved"
            outlined
            hint="comma separated for multiple entities"
          />
        </v-container>
      </v-col>
    </v-row>
  </v-col>
</template>
