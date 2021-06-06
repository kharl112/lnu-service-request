<script>
export default {
  name: "FacultyPermission",
  data: () => ({
    colors: ["primary", "warning", "error", "success"],
    selected: "pending",
    items: [
      { text: "All", value: "all" },
      { text: "Permitted", value: "permitted" },
      { text: "Pending", value: "pending" },
    ],
  }),
  computed: {
    getLoading() {
      return this.$store.getters["faculty/getLoading"];
    },
    getEmailPermissionLoading() {
      return this.$store.getters["admin/getLoading"].email_permission;
    },
    getAllUsers() {
      return this.$store.getters["faculty/getAllUsers"];
    },
    filter: {
      get() {
        return this.selected;
      },
      set(type) {
        return this.$store.dispatch("faculty/allUsers", { type });
      },
    },
  },
  methods: {
    getInitials(name) {
      const { firstname, lastname } = name;
      return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
    },
    getFullname(name) {
      const { firstname, lastname, middle_initial, prefix, suffixes } = name;
      return `${
        prefix ? `${prefix}.` : ""
      } ${firstname} ${middle_initial.toUpperCase()}. ${lastname} ${suffixes.toString()}`;
    },
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    handlePermitAccount(staff_id) {
      return this.$store.dispatch("admin/emailPermission", { staff_id });
    },
  },
  created() {
    this.filter = "pending";
  },
};
</script>
<template>
  <v-container fluid class="pa-0">
    <v-row dense justify="start">
      <v-col cols="12" sm="12" md="8">
        <v-col cols="12">
          <v-container fluid>
            <v-row justify-md="end" align-md="start">
              <v-select
                v-model="filter"
                prepend-inner-icon="mdi-filter"
                default="3"
                :items="items"
                item-value="value"
                item-text="text"
                label="Filter"
                outlined
              />
            </v-row>
          </v-container>
        </v-col>
        <v-col
          cols="12"
          class="pa-0"
          v-if="getAllUsers[0] && !getLoading.all_users"
        >
          <v-container fluid>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr v-for="user in getAllUsers" :key="user.staff_id">
                    <td class="text-left">
                      <v-col cols="2">
                        <v-avatar size="35" :color="getRandomColor()">
                          <span class="white--text text-subtitle-1 text-bold">
                            {{ getInitials(user.name) }}
                          </span>
                        </v-avatar>
                      </v-col>
                    </td>
                    <td class="text-left mb-1">
                      <v-list-item-title
                        class="pa-0 text-caption font-weight-bold"
                      >
                        {{ getFullname(user.name) }}
                        <v-icon
                          class="ml-2"
                          small
                          :color="!user.permitted ? 'error' : 'success'"
                        >
                          {{ !user.permitted ? "mdi-close" : "mdi-check" }}
                        </v-icon>
                      </v-list-item-title>
                      <v-spacer />
                      <v-list-item-subtitle class="pa-0 text-caption">
                        {{
                          `${
                            user.department.unit_role === 1 ? "Member" : "Head"
                          } in ${user.department.unit_name}`
                        }}
                      </v-list-item-subtitle>
                    </td>
                    <td class="text-left">
                      <v-list-item-subtitle class="pa-0 text-caption">
                        {{ user.email }}
                      </v-list-item-subtitle>
                    </td>
                    <td class="text-center">
                      <v-row justify="center" align="center">
                        <v-col cols="12" class="pa-0">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                color="success"
                                class="ml-2"
                                :loading="getEmailPermissionLoading"
                                :disabled="user.permitted"
                                @click="handlePermitAccount(user.staff_id)"
                                large
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon>
                                  mdi-lock-check
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Give permission to this account</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-container>
        </v-col>
        <v-col cols="12" v-else-if="getLoading.all_users">
          <v-skeleton-loader type="table" />
        </v-col>
        <v-col cols="12" v-else-if="!getAllUsers[0] && !getLoading.all_users">
          <v-row justify="start">
            <v-col cols="12">
              <v-banner single-line>
                <v-icon slot="icon" color="warning" size="36">
                  mdi-exclamation-thick
                </v-icon>
                No pending request for permissions
              </v-banner>
            </v-col>
          </v-row>
        </v-col>
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
  </v-container>
</template>
