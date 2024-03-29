<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "Drafts",
  data: () => ({ selected_id: "" }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    pendingLength() {
      return this.$store.getters["request/getPendings"].length;
    },
    drafts() {
      return this.$store.getters["request/getDrafts"];
    },
    selected: {
      get() {
        return this.$store.getters["request/getDeleteSelected"];
      },
      set(delete_selected) {
        return this.$store.commit("request/setDeleteSelected", delete_selected);
      },
    },
  },
  methods: {
    getTimeOrDate(date) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        includeSeconds: true,
      }).replace("about ", "");
    },
    goToEdit(_id) {
      this.$router.push(`/faculty/home/edit/${_id}`);
    },
    goToCreate() {
      this.$router.push(`/faculty/home/compose`);
    },
    goPending() {
      this.$router.push(`/faculty/home/pending`);
    },
    send(_id) {
      this.selected_id = _id;
      return this.$store.dispatch("request/Send", _id);
    },
    limitText(text) {
      return text.split("").slice(0, 30).concat("...").join("");
    },
  },
  created() {
    return this.$store.dispatch("request/Drafts");
  },
};
</script>
<template>
  <v-container fluid class="pa-0 pa-sm-3">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="8">
        <v-container fluid class="py-0" v-if="pendingLength">
          <v-alert prominent color="primary" outlined>
            <v-row align="center">
              <v-col class="grow">
                You have
                <strong> {{ pendingLength }} </strong>
                {{
                  pendingLength > 1
                    ? " received pending requests"
                    : " received pending request"
                }}
              </v-col>
              <v-col class="shrink">
                <v-btn color="warning" text @click="goPending()"
                  >View Pendings</v-btn
                >
              </v-col>
            </v-row>
          </v-alert>
        </v-container>
        <v-container fluid v-if="drafts[0] && !getLoading.drafts">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" />
                  <th class="text-left">Service Type</th>
                  <th class="text-left">Description</th>
                  <th class="text-center">Date Created</th>
                  <th class="text-center">Send</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  title="click to view"
                  class="table-row"
                  v-for="draft in drafts"
                  :key="draft.name"
                >
                  <td>
                    <v-checkbox
                      title="Select for deletion"
                      v-model="selected"
                      :value="draft._id"
                    />
                  </td>
                  <td @click="goToEdit(draft._id)">
                    <v-list-item-subtitle>
                      {{ limitText(draft.service[0].type) }}
                    </v-list-item-subtitle>
                  </td>
                  <td @click="goToEdit(draft._id)">
                    <v-list-item-subtitle
                      class="pa-0 text-caption text-left text-wrap text-sm-body-2"
                    >
                      {{ limitText(draft.subject) }}
                    </v-list-item-subtitle>
                  </td>

                  <td @click="goToEdit(draft._id)" class="text-center">
                    <v-chip
                      small
                      color="primary"
                      class="pa-0 pr-2 pl-2 text-center text-caption"
                    >
                      {{ getTimeOrDate(draft.reports.dates.created) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="success"
                          :title="
                            !draft.user.signature
                              ? 'Please sign this document before sending'
                              : ''
                          "
                          :disabled="
                            (getLoading.send && selected_id === draft._id) ||
                            !draft.user.signature
                          "
                          @click="send(draft._id)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon> mdi-send </v-icon>
                        </v-btn>
                      </template>
                      <span>Send Instantly</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
        <v-container fluid v-else-if="getLoading.drafts">
          <v-skeleton-loader type="table" />
        </v-container>
        <v-container
          fluid
          v-else-if="!drafts[0] && !getLoading.drafts && !pendingLength"
        >
          <v-row justify="start">
            <v-col cols="12">
              <v-banner single-line>
                <v-icon slot="icon" color="warning" size="36">
                  mdi-exclamation-thick
                </v-icon>
                You have empty drafts
                <template v-slot:actions>
                  <v-btn color="primary" @click="goToCreate" text>
                    create
                  </v-btn>
                </template>
              </v-banner>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col md="4" class="hidden-sm-and-down">
        <v-row>
          <v-col cols="12">
            <v-container fluid>
              <v-card>
                <v-img
                  src="https://anlantawan.files.wordpress.com/2020/08/ellenyu.jpg?w=720"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  width="720px"
                  height="auto"
                >
                  <v-card-title> Leyte Normal University </v-card-title>
                  <v-subheader class="white--text">
                    Pamantasang Normal ng Leyte
                  </v-subheader>
                </v-img>
                <v-divider class="mx-4"></v-divider>
                <v-card-actions>
                  <v-list dense>
                    <v-row justify="start" align="start">
                      <v-col cols="12" class="pa-2 pt-3 pb-0">
                        <v-list-item class="pa-1 px-4">
                          <v-icon color="primary"> mdi-google-maps </v-icon>
                          <v-subheader>
                            <a
                              href="https://www.google.com/maps/place/Leyte+Normal+University/@11.2380362,124.9995256,17z/data=!4m9!1m2!2m1!1slnu!3m5!1s0x3308772c87c4c367:0xa5e5c080ec6a88ef!8m2!3d11.2381879!4d125.001328!15sCgNsbnWSARFwdWJsaWNfdW5pdmVyc2l0eQ"
                              color="primary"
                              target="__blank"
                            >
                              Paterno St, Downtown, Tacloban City, 6500 Leyte

                              <v-icon right color="primary" size="15">
                                mdi-open-in-new
                              </v-icon>
                            </a>
                          </v-subheader>
                        </v-list-item>
                      </v-col>
                      <v-col cols="12" class="pa-2 pt-0 pb-0">
                        <v-list-item class="pa-1 px-4">
                          <v-icon color="primary"> mdi-web </v-icon>
                          <v-subheader>
                            <a
                              target="__blank"
                              href="http://www.lnu.edu.ph/"
                              color="primary"
                            >
                              lnu.edu.ph
                              <v-icon right color="primary" size="15">
                                mdi-open-in-new
                              </v-icon>
                            </a>
                          </v-subheader>
                        </v-list-item>
                      </v-col>
                    </v-row>
                  </v-list>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.table-row {
  cursor: pointer;
}
</style>
