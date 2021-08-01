<script>
export default {
  name: "PassSlip",
  props: {
    preview: Object,
  },
  methods: {
    fixDate(date) {
      const new_date = new Date(date);
      return `   ${new_date.getMonth()}/${new_date.getDate()}/${new_date.getFullYear()}   `;
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
  },
};
</script>
<template>
  <v-col cols="12" class="pa-0 content">
    <v-col cols="12">
      <v-container fluid class="pa-2">
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-row justify="center">
              <v-col cols="12" class="ml-2">
                <v-row justify="center">
                  <span class="black--text text-center caption">
                    Republic of the Philippines
                  </span>
                </v-row>
              </v-col>
              <v-col cols="12" class="ml-2">
                <v-row justify="center">
                  <span
                    class="black--text text-center subtitle-2 text-uppercase"
                  >
                    Leyte Normal University
                  </span>
                </v-row>
              </v-col>
              <v-col cols="12" class="ml-2">
                <v-row justify="center">
                  <span class="black--text text-center caption">
                    Tacloban City
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="mt-0 pt-0 pb-0">
      <v-container fluid>
        <v-row justify="center">
          <span
            class="black--text text-uppercase text-h6 text-decoration-underline"
          >
            Pass Slip
          </span>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pr-10">
        <v-row justify="end">
          <span class="black--text text-center body-2">
            Date:
            <span class="text-decoration-underline text-center">
              {{ fixDate(preview.data.date) }}
            </span>
          </span>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text font-weight-bold body-2">
              NAME:
              <span class="ml-1 font-weight-regular text-decoration-underline">
                {{ preview.data.options.name }}
              </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pt-1">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text font-weight-bold body-2">
              TIMEOUT:
              <span class="ml-1 font-weight-regular text-decoration-underline">
                {{ preview.data.options.timeout }}
              </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pt-1">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text font-weight-bold body-2">
              PURPOSE:
              <span class="ml-1 font-weight-regular text-decoration-underline">
                {{ preview.data.body }}
              </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pl-0 pt-2">
      <v-container fluid class="mt-2 pb-2">
        <v-row>
          <v-col cols="12">
            <v-row justify="end">
              <span class="black--text text-uppercase text-center caption">
                <span class="text-decoration-underline text-center">
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
                <v-spacer />
                <small class="black--text caption text-center text-capitalize">
                  (signature over printed name)
                </small>
              </span>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" v-if="preview.data.service_provider.staff_id" class="pl-0">
      <v-container fluid class="mt-2 pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <span class="black--text text-uppercase caption ">
              JOB DONE BY:
              <v-spacer />
              <span class="text-decoration-underline text-center">
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
          <v-col cols="12" class="pt-0 pb-0 mt-n2">
            <small class="black--text caption text-center text-capitalize">
              {{ getDepartment(preview.data.service_provider.department) }}
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <span class="text-left black--text caption pb-0 pt-0"> APPROVED BY: </span>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <v-row justify="start">
              <span class="black--text text-uppercase text-center caption ">
                <span class="text-decoration-underline text-center">
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
                <v-spacer />
                <small class="black--text caption text-center text-capitalize">
                  Chief Administrative Officer-Admin
                </small>
              </span>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-col>
</template>
<style scoped>
.footer {
  border-top: 2px dashed black;
}
</style>
