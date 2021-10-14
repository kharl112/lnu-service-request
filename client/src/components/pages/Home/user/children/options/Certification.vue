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
        "Not Take Home Pay",
        "Loan Remittances/Payments",
        "Annual Gross Income",
      ],
      records_office: [
        "Service Records",
        "Leave Credits/Balance",
        "No Pending Administrative Case",
        "Employment Certificate",
      ],
    },
    purposes: {
      loans: ["GSIS", "DBP", "LBP", "HDMF"],
      others: ["Travel Abroad", "Employment", "Updates"],
    },
  }),
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
  <v-col cols="12">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid class="py-0">
          <v-subheader class="text-uppercase px-0">
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
          <v-col cols="12" class="pt-0 pb-0">
            <v-subheader class="text-body text-uppercase pt-0">
              To Accounting Section
            </v-subheader>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-row justify="start" align="start">
              <v-col cols="12" class="py-0 px-7">
                <v-radio-group
                  dense
                  row
                  v-model="options.request_for.accounting"
                >
                  <v-radio
                    v-for="item in sections.accounting"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </v-radio-group>
              </v-col>
              <v-col cols="12" class="py-0 pb-4 px-7">
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
          <v-col cols="12" class="py-0">
            <v-subheader class="text-body text-uppercase pt-0">
              Hrm/Records Office
            </v-subheader>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-row justify="start" align="start">
              <v-col cols="12" class="py-0 px-7">
                <v-radio-group dense row v-model="options.request_for.records">
                  <v-radio
                    v-for="item in sections.records_office"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </v-radio-group>
              </v-col>
              <v-col cols="12" class="py-0 pb-4 px-7">
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
        </v-row>
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12" class="py-0">
          <v-subheader class="py-0 font-weight-black text-uppercase">
            Purpose:
          </v-subheader>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-row justify="start" align="start">
            <v-col cols="12" class="py-0 px-7">
              <v-radio-group dense row class="py-0" v-model="options.purpose">
                <v-container class="px-0 py-0" fluid>
                  <v-subheader class="text-body text-uppercase pt-0 px-0">
                    Hrm/Records Office
                  </v-subheader>
                </v-container>
                <v-radio
                  v-for="item in purposes.loans"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </v-radio-group>
            </v-col>

            <v-col cols="12" class="py-0 px-7">
              <v-radio-group dense row class="py-0 my-0" v-model="options.purpose">
                <v-radio
                  v-for="item in purposes.others"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="12" class="py-0 pb-4 px-7">
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
        <v-col cols="12" class="pt-0">
          <v-divider />
        </v-col>
        <v-col cols="12" class="py-0">
          <v-subheader class="py-0 font-weight-black text-uppercase">
            Co Makers
          </v-subheader>
        </v-col>
        <v-col cols="12">
          <v-row justify="start" align="start">
            <v-col cols="12" class="py-0 pb-4 px-7">
              <v-text-field
                v-model="co_makers"
                label="Names"
                hint="comma separated"
                class="py-0"
                dense
              />
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-row>
  </v-col>
</template>
