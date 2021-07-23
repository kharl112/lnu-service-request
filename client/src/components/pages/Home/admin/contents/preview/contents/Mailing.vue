<script>
export default {
  name: "Mailing",
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
  <v-col cols="12" class="pa-0 mt-n7 content">
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
    <v-col cols="12" class="pb-0 pt-0">
      <v-container fluid class="pr-10">
        <v-row justify="end">
          <span class="black--text text-center caption">
            <span class="text-decoration-underline text-center">
              {{ fixDate(preview.data.date) }}
            </span>
            <v-spacer />
            <span>Date</span>
          </span>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pt-0 pb-0">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text caption">
              Records
            </span>
          </v-col>
          <v-col cols="12" class="pa-0 mt-n2">
            <span class="black--text caption">
              FORM #01
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="mt-0 pt-0 pb-0">
      <v-container fluid>
        <v-row justify="center">
          <span
            class="black--text text-uppercase font-weight-bold body-1 text-decoration-underline"
          >
            Request for Mailing
          </span>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pt-2 pb-5">
      <v-row justify="center">
        <div class="ma-2">
          <input
            type="checkbox"
            :value="preview.data.options.postal === 'JRS'"
            disabled
            class="mr-1"
          />
          <span class="black--text body-2">JRS</span>
        </div>
        <div class="ma-2">
          <input
            type="checkbox"
            :checked="preview.data.options.postal === 'PPC'"
            disabled
            class="mr-1"
          />
          <span class="black--text body-2">
            PPC
            <small class="caption ml-1">(Phil. Postal Corp)</small>
          </span>
        </div>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text body-2">
              Mail To:
              <span class="ml-1 text-decoration-underline">
                {{ preview.data.options.recipient }}
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
            <span class="black--text body-2">
              From:
              <span class="ml-1 text-decoration-underline">
                {{ getFullname(preview.data.user.profile[0].name) }}
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
            <span class="black--text body-2">
              Purpose:
              <span class="ml-1 text-decoration-underline">
                {{ preview.data.body }}
              </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pl-0 pt-2">
      <v-container fluid class="mt-2 pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <span class="black--text text-uppercase caption">
              Requested By:
              <v-spacer />
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
            </span>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0 mt-n2">
            <small class="black--text caption tex-center text-capitalize">
              (Print name & signature)
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" v-if="preview.data.service_provider.staff_id" class="pl-0">
      <v-container fluid class="mt-2 pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <span class="black--text text-uppercase caption ">
              Job Done By:
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
            <small class="black--text caption tex-center text-capitalize">
              {{ getDepartment(preview.data.service_provider.department) }}
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pl-0">
      <v-container fluid class="mt-2 pt-0 pb-2">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <span class="black--text text-uppercase caption ">
              Approved By:
              <v-spacer />
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
            </span>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0 mt-n2">
            <small class="black--text caption tex-center text-capitalize">
              Chief Administrative Officer-Admin
            </small>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pa-0 pt-5 footer">
      <v-container fluid>
        <v-row justify="start">
          <v-col cols="12" class="pt-0">
            <v-row justify="start">
              <div class="ma-2">
                <span class="black--text body-2 font-weight-bold">
                  PPC:
                </span>
              </div>
              <div class="ma-2">
                <input
                  type="checkbox"
                  :checked="preview.data.options.type === 'Mailing Envelope'"
                  disabled
                  class="mr-1"
                />
                <span class="black--text caption">
                  Mailing Envelope
                </span>
              </div>
              <div class="ma-2">
                <input
                  type="checkbox"
                  :checked="preview.data.options.type === 'Brown Envelope'"
                  disabled
                  class="mr-1"
                />
                <span class="black--text caption">
                  Brown Envelope
                </span>
              </div>
              <div class="ma-2">
                <input
                  type="checkbox"
                  :checked="preview.data.options.type === 'Box'"
                  disabled
                  class="mr-1"
                />
                <span class="black--text caption">
                  Box
                </span>
              </div>
            </v-row>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-row justify="start">
              <div class="ma-2">
                <span class="black--text body-2 font-weight-bold">
                  JRS:
                </span>
              </div>
              <div class="ma-2">
                <input
                  type="checkbox"
                  :checked="preview.data.options.type === 'Registered'"
                  disabled
                  class="mr-1"
                />
                <span class="black--text caption">
                  Registered
                </span>
              </div>
              <div class="ma-2">
                <input
                  type="checkbox"
                  :checked="preview.data.options.type === 'Speed'"
                  disabled
                  class="mr-1"
                />
                <span class="black--text caption">
                  Speed
                </span>
              </div>
              <div class="ma-2">
                <input
                  type="checkbox"
                  :checked="preview.data.options.type === 'Priority'"
                  disabled
                  class="mr-1"
                />
                <span class="black--text caption">
                  Priority
                </span>
              </div>
              <div class="ma-2">
                <input
                  type="checkbox"
                  :checked="preview.data.options.type === 'International'"
                  disabled
                  class="mr-1"
                />
                <span class="black--text caption">
                  International
                </span>
              </div>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row justify="start">
              <v-col cols="12" sm="6" class="pt-0 pb-0">
                <span class="black--text caption">
                  Released by:
                  <span class="text-decoration-underline text-capitalize">
                    {{ preview.data.options.released_by }}
                  </span>
                </span>
              </v-col>
              <v-col cols="12" sm="6" class="pt-0 pb-0">
                <span class="black--text caption">
                  Released date:
                  <span class="text-decoration-underline text-capitalize">
                    {{ preview.data.options.released_date }}
                  </span>
                </span>
              </v-col>
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
