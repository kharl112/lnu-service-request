<script>
export default {
  name: "Certification",
  props: {
    options: Object,
  },
  data: () => ({
    rules: [(v) => !!v || "this field must not be empty"],
    sections: {
      accounting: [
        "",
        "Not Take Home Pay",
        "Loan Remittances/Payments",
        "Annual Gross Income",
      ],
      records_office: [
        "",
        "Service Records",
        "Leave Credits/Balance",
        "No Pending Administrative Case",
        "Employment Certificate",
      ],
    },
    purposes: {
      loans: ["", "GSIS", "DBP", "LBP", "HDMF"],
      others: ["Travel Abroad", "Employment", "Updates"],
    },
  }),
  methods: {
    handleCustomInput(event, el_id) {
      const custom_container = document.getElementById(el_id);
      if (!event) return custom_container.classList.remove("d-none");
      return custom_container.classList.add("d-none");
    },
  },
  computed: {
    co_makers: {
      get() {
        return typeof this.options.co_makers === "object"
          ? this.options.co_makers.join(",")
          : this.options.co_makers;
      },
      set(co_maker) {
        return (this.options.co_makers = co_maker.split(","));
      },
    },
  },
};
</script>
<template>
  <v-col cols="12" class="px-0">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="py-0">
          <v-subheader
            class="text-uppercase px-0 text-subtitle-1 font-weight-bold"
          >
            Request for Records/Certification
          </v-subheader>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12">
        <v-row justify="start" align="start">
          <v-col cols="12" class="pt-0 pb-0">
            <v-subheader class="pt-0 font-weight-black text-uppercase">
              Request for:
            </v-subheader>
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <v-subheader class="text-body text-uppercase pt-0">
              To Accounting Section
            </v-subheader>
            <v-row justify="start" align="start">
              <v-col cols="12" class="pt-2 px-7">
                <v-select
                  dense
                  outlined
                  v-model="options.request_for.accounting"
                  :items="sections.accounting"
                  @change="handleCustomInput($event, 'custom-accounting')"
                  title="Select one item for Accounting Section (required)"
                  hide-details
                />
              </v-col>
              <v-col cols="12" class="pb-4 px-7" id="custom-accounting">
                <v-text-field
                  v-model="options.request_for.accounting"
                  :rules="rules"
                  label="Others/Custom"
                  placeholder="pls specify"
                  class="py-0"
                  dense
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <v-subheader class="text-body text-uppercase pt-0">
              Hrm/Records Office
            </v-subheader>
            <v-row justify="start" align="start">
              <v-col cols="12" class="pt-2 px-7">
                <v-select
                  dense
                  outlined
                  v-model="options.request_for.records"
                  :items="sections.records_office"
                  @change="handleCustomInput($event, 'custom-records')"
                  title="Select one item for Hrm/Records Office (required)"
                  hide-details
                />
              </v-col>
              <v-col cols="12" class="pb-2 px-7" id="custom-records">
                <v-text-field
                  v-model="options.request_for.records"
                  :rules="rules"
                  label="Others/Custom"
                  placeholder="pls specify"
                  class="py-0"
                  dense
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <v-subheader class="text-body text-uppercase pt-0">
              Purpose
            </v-subheader>

            <v-row justify="start" align="start">
              <v-col cols="12" class="pt-2 px-7">
                <v-select
                  outlined
                  dense
                  class="py-0"
                  v-model="options.purpose"
                  :items="[...purposes.loans, ...purposes.others]"
                  @change="handleCustomInput($event, 'custom-purpose')"
                  title="Select one item for Request Purpose (required)"
                  hide-details
                />
              </v-col>
              <v-col cols="12" class="pt-2 pb-4 px-7" id="custom-purpose">
                <v-text-field
                  v-model="options.purpose"
                  :rules="rules"
                  label="Others/Custom"
                  placeholder="pls specify"
                  class="py-0"
                  dense
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-subheader class="px-0 font-weight-black text-uppercase">
            Co Makers
          </v-subheader>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-row justify="start" align="start">
            <v-col cols="12" class="py-0 pb-4">
              <v-text-field
                v-model="co_makers"
                label="Names"
                hint="comma separated"
                class="py-0"
                dense
                title="Enter Co-makers name (comma separated)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-row>
  </v-col>
</template>
