<script>
export default {
  name: "Risograph",
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
    getTotalOutput(docs, type) {
      return docs.reduce((val, node) => val + parseInt(node[type]), 0);
    },
  },
};
</script>
<template>
  <v-col cols="12" class="pa-0 mt-n7 content">
    <v-col cols="12">
      <v-container fluid class="pa-2">
        <v-row justify="center">
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="12">
                <v-row justify="center">
                  <span class="black--text text-center caption">
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
                    class="black--text text-center font-weight-bold caption text-uppercase"
                  >
                    Office of the chief Administrative officer for
                    administration
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid>
        <v-row justify="center">
          <span class="black--text text-uppercase body-2 font-weight-bold">
            Job order for risograph
          </span>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12" class="pb-0 pt-2">
      <v-row justify="space-between">
        <v-col cols="6">
          <span class="black--text caption">
            To: Reproduction Center
          </span>
        </v-col>
        <v-col cols="6">
          <span class="black--text caption">
            Date:
            <span class="text-decoration-underline">
              {{ fixDate(preview.data.date) }}
            </span>
          </span>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-row justify="start">
        <v-col cols="12" class="pb-0">
          <span class="black--text caption">
            Please produce the following request for risograph
          </span>
        </v-col>
        <v-col cols="12" class="pt-0">
          <span class="black--text caption mr-4">
            With Paper:
            <span class="font-weight-bold">
              {{ preview.data.options.with_paper ? "YES" : "NO" }}
            </span>
          </span>
          <span class="black--text caption">
            Back to back:
            <span class="font-weight-bold">
              {{ preview.data.options.back_to_back ? "YES" : "NO" }}
            </span>
          </span>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="pt-0 pb-4">
      <v-simple-table class="table" dense light>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left black--text caption font-weight-bold">
                Document Title
              </th>
              <th class="text-center black--text caption font-weight-bold">
                No. of copies
              </th>
              <th class="text-center black--text caption font-weight-bold">
                No. of page/s
              </th>
              <th class="text-center black--text caption font-weight-bold">
                Total copies produced
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(doc, index) in preview.data.options.documents"
              :key="index"
            >
              <td class="text-left caption">{{ doc.title }}</td>
              <td class="text-center caption">{{ doc.copies }}</td>
              <td class="text-center caption">{{ doc.pages }}</td>
              <td class="text-center caption">{{ doc.produced }}</td>
            </tr>
            <tr>
              <td class="text-left caption">TOTAL OUTPUT</td>
              <td class="text-center caption">
                {{ getTotalOutput(preview.data.options.documents, "copies") }}
              </td>
              <td class="text-center caption">
                {{ getTotalOutput(preview.data.options.documents, "pages") }}
              </td>
              <td class="text-center caption">
                {{ getTotalOutput(preview.data.options.documents, "produced") }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="12" class="pt-1">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <v-col cols="12" class="pa-0">
            <span class="black--text caption">
              PURPOSE:
              <span class="ml-1 font-weight-regular text-decoration-underline">
                {{ preview.data.body }}
              </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <span class="black--text caption text-uppercase mr-2">
            Requested by:
          </span>
          <span class="black--text text-uppercase caption">
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
      </v-container>
    </v-col>
    <v-col cols="12">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <span class="black--text caption text-uppercase mr-2">
            Approved by:
          </span>
          <span class="black--text text-uppercase caption">
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
      </v-container>
    </v-col>
    <v-col cols="12" v-if="preview.data.service_provider.staff_id">
      <v-container fluid class="pt-0">
        <v-row justify="start">
          <span class="black--text caption text-uppercase mr-2">
            Job done by:
          </span>
          <span class="black--text text-uppercase caption">
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
            <v-spacer />
            <small class="black--text caption text-center text-capitalize">
              {{ getDepartment(preview.data.service_provider.department) }}
            </small>
          </span>
        </v-row>
      </v-container>
    </v-col>
  </v-col>
</template>
<style scoped>
.footer {
  border-top: 2px dashed black;
}
.table {
  border: 1px solid #e0e0e0;
  border-radius: 0px;
}
</style>
