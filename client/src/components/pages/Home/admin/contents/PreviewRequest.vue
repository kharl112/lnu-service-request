<script>
export default {
  name: "PreviewRequest",
  props: {
    preview: Object,
    showPreview: Function,
    downloadPDF: Function,
  },
  computed: {
    getPDFLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
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
  },
};
</script>
<template>
  <v-overlay :value="preview.show" :z-index="100">
    <v-sheet
      v-if="preview.data"
      elevation="1"
      max-width="470"
      width="95vw"
      height="99vh"
      color="white"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="pa-6">
            <v-row justify="end">
              <v-btn
                @click="downloadPDF(preview.data._id)"
                :loading="getPDFLoading"
                icon
                color="secondary "
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-btn @click="showPreview()" icon color="error">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-container fluid class="pa-2">
              <v-row justify="center">
                <v-img
                  src="https://upload.wikimedia.org/wikipedia/en/1/17/LNUTaclobanLogo.jpg"
                  max-width="75"
                  min-width="25"
                  class="mr-2 hidden-sm-and-down"
                />
                <v-col cols="12" md="6">
                  <v-row justify="center">
                    <v-col cols="12" class="ml-2">
                      <v-row justify="center" justify-md="start">
                        <span class="black--text text-center body-1">
                          Republic of the Philippines
                        </span>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="ml-2">
                      <v-row justify="center" justify-md="start">
                        <span class="black--text font-weight-bold body-2">
                          Leyte Normal University
                        </span>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="ml-2">
                      <v-row justify="center" justify-md="start">
                        <span class="black--text caption">
                          P. Paterno St., Tacloban City
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
                <span
                  class="black--text text-capitalize font-weight-bold body-1"
                >
                  {{ preview.data.subject }}
                </span>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12">
            <v-container fluid class="pl-7">
              <v-row justify="start">
                <v-col cols="12" class="pa-0">
                  <span class="black--text caption">
                    Service type: {{ preview.data.service[0].type }}
                  </span>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <span class="black--text caption">
                    Date created: {{ fixDate(preview.data.date) }}
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
                    {{ preview.data.body }}
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" class="mt-5">
            <v-container fluid class="pt-0 pb-2">
              <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                  <small
                    class="black--text text-capitalize caption text-decoration-underline"
                  >
                    From: {{ getFullname(preview.data.user.profile[0].name) }}
                    <v-icon
                      v-if="preview.data.user.signature"
                      small
                      color="success"
                      class="ml-1 mb-1"
                    >
                      mdi-check-circle
                    </v-icon>
                  </small>
                </v-col>
                <v-col cols="12" class="pt-0 pb-0 mt-n2">
                  <small class="black--text caption tex-center">
                    {{ getDepartment(preview.data.user.department) }}
                  </small>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col
            cols="12"
            class="mt-0"
            v-if="preview.data.service_provider.staff_id"
          >
            <v-container fluid class="pt-0 pb-2">
              <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                  <small
                    class="black--text text-capitalize caption text-decoration-underline"
                  >
                    To:
                    {{
                      getFullname(preview.data.service_provider.profile[0].name)
                    }}
                    <v-icon
                      v-if="preview.data.service_provider.signature"
                      small
                      color="success"
                      class="ml-1 mb-1"
                    >
                      mdi-check-circle
                    </v-icon>
                  </small>
                </v-col>
                <v-col cols="12" class="pt-0 pb-0 mt-n2">
                  <small class="black--text caption tex-center">
                    {{
                      getDepartment(preview.data.service_provider.department)
                    }}
                  </small>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" class="mt-0">
            <v-container fluid class="pt-0 pb-2">
              <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                  <small
                    class="black--text text-capitalize caption text-decoration-underline"
                  >
                    {{ getFullname(preview.data.admin.profile[0].name) }}
                    <v-icon
                      v-if="preview.data.admin.signature"
                      small
                      color="success"
                      class="ml-1 mb-1"
                    >
                      mdi-check-circle
                    </v-icon>
                  </small>
                </v-col>
                <v-col cols="12" class="pt-0 pb-0 mt-n2">
                  <small class="black--text caption tex-center">
                    Chief Administration Office
                  </small>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-overlay>
</template>
<style scoped>
.pdf-sheet {
  overflow-y: scroll;
}
</style>
