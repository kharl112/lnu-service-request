<script>
export default {
  name: "RequestForServices",
  props: {
    options: Object,
  },
  data: () => ({
    rules: [
      (v) => !/\d/gi.test(v) || "this field does not require a number",
      (v) => !!v || "this field is required",
    ],
    services_types: ["", "Carpenter", "Plumber", "Electrician", "Janitor/s"],
  }),
  methods: {
    handleCustomInput(event, el_id) {
      const custom_container = document.getElementById(el_id);
      if (!event) return custom_container.classList.remove("d-none");
      return custom_container.classList.add("d-none");
    },
  },
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
      <v-col cols="12">
        <v-container fluid class="py-0 px-0">
          <v-subheader class="px-0 text-subtitle-1 font-weight-bold">
            REQUEST FOR SERVICES OPTIONS
          </v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-container class="px-0 py-0" fluid>
          <v-subheader class="text-body text-uppercase pt-0 px-0">
            Service Type
          </v-subheader>
        </v-container>
        <v-select
          outlined
          dense
          class="py-0"
          v-model="options.type"
          :items="services_types"
          title="Select one item for Service Type"
          @change="handleCustomInput($event, 'custom-service-type')"
        />
      </v-col>
      <v-col cols="12" class="pt-2" id="custom-service-type">
        <v-text-field
          v-model="options.type"
          :rules="rules"
          label="Others/Custom"
          placeholder="pls specify"
          title="Enter Custom Service Type"
          class="py-0"
          dense
        />
      </v-col>
      <!-- <v-col cols="12" class="pb-0">
        <v-divider />
      </v-col>
      <v-col cols="12">
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
            outlined
            hint="comma separated for multiple entities"
            title="Enter each person/s involved name (comma separated)"
          />
        </v-container>
      </v-col> -->
    </v-row>
  </v-col>
</template>
