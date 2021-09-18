<script>
export default {
  name: "Original",
  props: {
    preview: Object,
  },
  methods: {
    fixDate(date) {
      const new_date = new Date(date);
      return `${new_date.getMonth()}/${new_date.getDate()}/${new_date.getFullYear()}`;
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getDepartment({ role, unit }) {
      return `${role[0].name} of ${unit[0].name}`;
    },
    getPersonsInvolved(persons) {
      return persons
        .join(",")
        .split(" ")
        .map((name) => name.replace(/^[a-z]/gi, (first) => first.toUpperCase()))
        .join(" ");
    },
  },
};
</script>
<template>
  <v-col cols="12" class="pa-0">
    <v-col cols="12">
      <v-container fluid class="pa-2">
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-row justify="center">
              <v-col cols="12">
                <v-row justify="center">
                  <span class="black--text text-center body-2">
                    Leyte Normal University
                  </span>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row justify="center">
                  <span class="black--text text-center caption">
                    Tacloban City
                  </span>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row justify="center">
                  <span
                    class="black--text text-center subtitle-2 text-uppercase"
                  >
                    Office of the Administrative Officer
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="mt-0 pb-0">
      <v-container fluid>
        <v-row justify="center">
          <span class="black--text text-uppercase font-weight-bold body-1">
            Request for Services
          </span>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pr-10 pl-10">
        <v-row justify="end">
          <span class="black--text caption">
            Date:
            <span class="text-decoration-underline">
              {{ fixDate(preview.data.date) }}
            </span>
          </span>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pl-7 pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text caption">
              REQUEST FOR:
              <span class="ml-1 text-decoration-underline">
                {{ preview.data.service[0].type }}
              </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pl-15 pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text caption">
              Name of Person/s involved:
              <span
                class="ml-1 text-decoration-underline"
                v-if="preview.data.options.persons_involved[0]"
              >
                {{ getPersonsInvolved(preview.data.options.persons_involved) }}
              </span>
              <span v-else> _______ </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="mt-0 pb-0">
      <v-container fluid class="pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <p class="black--text text-justify caption">
              PURPOSE:
              <span class="ml-1 text-decoration-underline">
                {{ preview.data.body }}
              </span>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="mt-2 pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <span class="black--text text-uppercase caption ">
              Requested By:
              <v-spacer />
              <span class="text-decoration-underline ml-10 text-center">
                {{ getFullname(preview.data.user.profile[0].name) }}
                <v-icon
                  v-if="preview.data.user.signature"
                  small
                  color="success"
                  class="ml-1 mb-1"
                >
                  mdi-check-circle
                </v-icon>
              </span>
            </span>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0 ml-10 mt-n2">
            <small class="black--text caption tex-center text-capitalize">
              (Signature over printed name)
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" v-if="preview.data.service_provider.staff_id">
      <v-container fluid class="mt-2 pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <span class="black--text text-uppercase caption ">
              Job Done By:
              <v-spacer />
              <span class="text-decoration-underline ml-10 text-center">
                {{ getFullname(preview.data.service_provider.profile[0].name) }}
                <v-icon
                  v-if="preview.data.service_provider.signature"
                  small
                  color="success"
                  class="ml-1 mb-1"
                >
                  mdi-check-circle
                </v-icon>
              </span>
            </span>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0 ml-10 mt-n2">
            <small class="black--text caption tex-center text-capitalize">
              {{ getDepartment(preview.data.service_provider.department) }}
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="mt-2 pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <span class="black--text text-uppercase caption ">
              Approved By:
              <v-spacer />
              <span class="text-decoration-underline ml-10 text-center">
                {{ getFullname(preview.data.admin.profile[0].name) }}
                <v-icon
                  v-if="preview.data.admin.signature"
                  small
                  color="success"
                  class="ml-1 mb-1"
                >
                  mdi-check-circle
                </v-icon>
              </span>
            </span>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0 ml-10 mt-n2">
            <small class="black--text caption tex-center text-capitalize">
              Chief Administrative Officer
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-col>
</template>
