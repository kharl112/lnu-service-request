<script>
import { formatDistanceToNow } from "date-fns";
export default {
  name: "Drafts",
  data: () => ({ selected_id: "" }),
  computed: {
    getLoading() {
      return this.$store.getters["request/getLoading"];
    },
    getAllDraft() {
      return this.$store.getters["request/getAllDraft"];
    },
    selected: {
      get() {
        return this.$store.getters["request/getSelected"];
      },
      set(selected) {
        return this.$store.commit("request/setSelected", selected);
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
    gotoEdit(id) {
      return this.$router.push(`/faculty/home/edit/letter=${id}`);
    },
    gotoCreate() {
      return this.$router.push(`/faculty/home/compose`);
    },
    sendRequest(_id) {
      this.selected_id = _id;
      return this.$store.dispatch("request/sendRequest", { _id });
    },
    limitText(text) {
      return text
        .split("")
        .slice(0, 30)
        .concat("...")
        .join("");
    },
  },
  created() {
    return this.$store.dispatch("request/allDraft");
  },
};
</script>
<template>
  <v-container fluid class="pa-1 pa-sm-3">
    <v-row dense justify="start" v-if="!getLoading.letter_info">
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-if="getAllDraft[0] && !getLoading.all_draft"
      >
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" />
                <th class="text-left">
                  Subject
                </th>
                <th class="text-center">
                  Created
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="draft in getAllDraft" :key="draft.name">
                <td>
                  <v-checkbox v-model="selected" :value="draft._id" />
                </td>
                <td @click="gotoEdit(draft._id)">
                  <v-list-item-subtitle
                    class="pa-0 text-caption text-left text-wrap text-sm-body-2 "
                  >
                    {{ limitText(draft.subject) }}
                  </v-list-item-subtitle>
                </td>
                <td @click="gotoEdit(draft._id)" class="text-center">
                  <v-chip
                    small
                    color="primary"
                    class="pa-0 pr-2 pl-2 text-center text-caption"
                  >
                    {{ getTimeOrDate(draft.date) }}
                  </v-chip>
                </td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        color="success"
                        :disabled="getLoading.send && selected_id === draft._id"
                        @click="sendRequest(draft._id)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>
                          mdi-send
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Send Instantly</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" sm="12" md="8" v-else-if="getLoading.all_draft">
        <v-skeleton-loader type="table" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="8"
        v-else-if="!getAllDraft[0] && !getLoading.all_draft"
      >
        <v-row justify="start">
          <v-col cols="12">
            <v-banner single-line>
              <v-icon slot="icon" color="warning" size="36">
                mdi-exclamation-thick
              </v-icon>
              You have empty drafts
              <template v-slot:actions>
                <v-btn color="primary" @click="gotoCreate" text>
                  create
                </v-btn>
              </template>
            </v-banner>
          </v-col>
        </v-row>
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
                  <v-card-title>
                    Leyte Normal University
                  </v-card-title>
                  <v-subheader class="white--text">
                    Pamantasang Normal ng Leyte
                  </v-subheader>
                </v-img>
                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="4.2"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    />
                    <div class="grey--text ms-4">
                      4.2 (81 reviews)
                    </div>
                  </v-row>
                  <div class="my-4 subtitle-1">
                    Public University
                  </div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-actions>
                  <v-list dense>
                    <v-row justify="start" align="start">
                      <v-col cols="12" class="pa-2 pt-0 pb-0">
                        <v-list-item>
                          <v-icon color="primary">
                            mdi-google-maps
                          </v-icon>
                          <v-subheader>
                            <a
                              href="https://www.google.com/maps/place/Leyte+Normal+University/@11.2380362,124.9995256,17z/data=!4m9!1m2!2m1!1slnu!3m5!1s0x3308772c87c4c367:0xa5e5c080ec6a88ef!8m2!3d11.2381879!4d125.001328!15sCgNsbnWSARFwdWJsaWNfdW5pdmVyc2l0eQ"
                              color="primary"
                            >
                              Paterno St, Downtown, Tacloban City, 6500 Leyte
                            </a>
                          </v-subheader>
                        </v-list-item>
                      </v-col>
                      <v-col cols="12" class="pa-2 pt-0 pb-0">
                        <v-list-item>
                          <v-icon color="primary">
                            mdi-web
                          </v-icon>
                          <v-subheader>
                            <a href="http://www.lnu.edu.ph/" color="primary">
                              lnu.edu.ph
                            </a>
                          </v-subheader>
                        </v-list-item>
                      </v-col>
                      <v-col cols="12" class="pa-2 pt-0 pb-0">
                        <v-list-item>
                          <v-icon color="primary">
                            mdi-phone
                          </v-icon>
                          <v-subheader>
                            +63538880855
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
    <v-row
      id="spinner-container"
      justify="center"
      align="center"
      v-else-if="getLoading.letter_info"
    >
      <v-col cols="12" align="center">
        <v-progress-circular
          :size="50"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>
