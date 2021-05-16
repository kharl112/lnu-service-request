<script>
import SetSignature from "../contents/SetSignature";
export default {
  name: "Compose",
  components: {
    SetSignature,
  },
  data: () => ({
    signatureVisibility: false,
    rules: [(v) => !!v || "This field is not allowed to be empty"],
    timeout: 3000,
    form: {
      subject: "",
      greetings: "",
      body: "",
      user: {
        signature: "",
      },
      admin: {
        staff_id: "",
        signature: "",
      },
      head: {
        staff_id: "",
        signature: "",
      },
      save_as: 0,
    },
  }),
  computed: {
    getFacultyProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    getAllHead() {
      return this.$store.getters["faculty/getAllHead"];
    },
    getAllAdmin() {
      return this.$store.getters["admin/getAllAdmin"];
    },
    getLoading() {
      const { getters } = this.$store;
      if (
        !getters["faculty/getLoading"].all_head &&
        !getters["admin/getLoading"].all_admin
      )
        return false;
      return true;
    },
    getComposeLoading() {
      return this.$store.getters["request/getLoading"].compose;
    },
    getComposeError() {
      return this.$store.getters["request/getError"].compose;
    },
    getSnackbar() {
      return this.$store.getters["request/getSnackbar"];
    },
  },
  methods: {
    closeSnackbar() {
      return this.$store.commit("request/setSnackbar", {
        snackbar: false,
        type: "compose",
      });
    },
    showSignature() {
      this.signatureVisibility = !this.signatureVisibility;
    },
    handleSetSignature(signatureId) {
      const signatureElement = document.getElementById(signatureId).innerHTML;
      return (this.form.user.signature = signatureElement.toString());
    },
    handleSubmitForm(e) {
      e.preventDefault();
      return;
    },
    handleSubmitDraft(e) {
      e.preventDefault();
      this.form.save_as = 0;
      if (this.$refs.form.validate()) {
        if (!this.form.user.signature) {
          this.$store.commit("request/setError", {
            message: "You must sign this document to proceed",
            type: "compose",
          });
          return this.$store.commit("request/setSnackbar", {
            snackbar: true,
            type: "compose",
          });
        }
        return this.$store.dispatch("request/createRequest", this.form);
      }
      return console.log("unvalidated");
    },
    handleSubmitSend(e) {
      e.preventDefault();
      this.form.save_as = 1;
      if (this.$refs.form.validate()) {
        if (!this.form.user.signature) {
          this.$store.commit("request/setError", {
            message: "You must sign this document to proceed",
            type: "compose",
          });
          return this.$store.commit("request/setSnackbar", {
            snackbar: true,
            type: "compose",
          });
        }
        return this.$store.dispatch("request/createRequest", this.form);
      }
      return console.log("unvalidated");
    },
  },
  created() {
    this.$store.dispatch("faculty/allHead");
    this.$store.dispatch("admin/allAdmin");
  },
};
</script>
<template>
  <v-container fluid>
    <v-row justify="start" align="start">
      <v-col cols="12" sm="12" md="8">
        <v-form
          ref="form"
          @submit="handleSubmitForm"
          :disabled="getComposeLoading"
          v-if="!getLoading"
        >
          <v-row justify="start" align="start" no-gutters dense>
            <v-col cols="12">
              <v-container fluid>
                <h4 class="text-h6 text-sm-h6 text-md-h5">Compose Request</h4>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid>
                <v-subheader id="subheader">Recipients</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid id="recipients-container">
                <v-row justify="start" align="start" dense>
                  <v-col
                    cols="12"
                    sm="4"
                    md="5"
                    v-if="getFacultyProfile.department.unit_role === 1"
                  >
                    <v-autocomplete
                      v-model="form.head.staff_id"
                      :items="getAllHead"
                      :rules="rules"
                      item-text="name"
                      item-value="staff_id"
                      outlined
                      label="Department Head"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="5">
                    <v-autocomplete
                      v-model="form.admin.staff_id"
                      :rules="rules"
                      :items="getAllAdmin"
                      item-text="name"
                      item-value="staff_id"
                      outlined
                      label="Administration"
                      dense
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid>
                <v-subheader id="subheader">Request Letter</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid>
                <v-row justify="start" dense no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.subject"
                      autofocus
                      outlined
                      :rules="rules"
                      label="Subject"
                      placeholder="Technician for the modification of our faculty"
                      dense
                      counter
                      maxlength="50"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.greetings"
                      outlined
                      :rules="rules"
                      label="Greetings"
                      placeholder="Salutations"
                      counter
                      maxlength="20"
                      dense
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      rows="10"
                      v-model="form.body"
                      outlined
                      :rules="rules"
                      label="Body"
                      auto-grow
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      :disabled="getComposeLoading"
                      color="success"
                      @click="showSignature"
                      type="none"
                      block
                      rounded
                      elevation="0"
                    >
                      sign
                      <v-icon right>
                        mdi-signature
                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-container fluid id="save-banner">
                      <v-subheader id="subheader">Save As</v-subheader>
                      <v-divider />
                    </v-container>
                  </v-col>
                  <v-col cols="12">
                    <v-row justify="start" align="start" dense>
                      <v-col cols="12" sm="5" md="3">
                        <v-btn
                          :disabled="getComposeLoading"
                          color="primary"
                          type="none"
                          @click="handleSubmitSend"
                          rounded
                          outlined
                          block
                          elevation="0"
                        >
                          send
                          <v-icon right>
                            mdi-send
                          </v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="5" md="3">
                        <v-btn
                          :disabled="getComposeLoading"
                          color="warning"
                          type="none"
                          @click="handleSubmitDraft"
                          rounded
                          outlined
                          block
                          elevation="0"
                        >
                          draft
                          <v-icon right>
                            mdi-paperclip
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-form>
        <v-skeleton-loader
          v-else
          class="mx-auto"
          type="card, card, card"
        ></v-skeleton-loader>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col sm="2" md="4" class="hidden-sm-and-down">
        <v-row justify="start" align="start">
          <v-col cols="12">
            <v-container fluid>
              <h4 class="text-6 text-sm-h6 text-md-h5">Requesting on LNU</h4>
              <v-divider />
            </v-container>
          </v-col>
          <v-col cols="12">
            <v-card outlined class="mx-auto" max-width="344">
              <v-img
                height="200px"
                src="https://www.webmedia.com.ph/sites/default/files/Drupal-Training-Basic-Advance-Leyte-Normal-University-LNU-Tacloban-Leyte-10.jpg"
              >
              </v-img>
              <v-list-item>
                <v-list-item-content>
                  1. Be polite
                  <v-divider />
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  2. Behave like you would in real life
                  <v-divider />
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-snackbar color="error" v-model="getSnackbar.compose">
        {{ getComposeError }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="closeSnackbar">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :handleSetSignature="handleSetSignature"
    />
  </v-container>
</template>
<style scoped lang="scss">
#subheader {
  margin: 0px;
  padding: 0px;
}
#recipients-container {
  margin: 0px;
  padding-bottom: 0px;
}
#save-banner {
  margin: 15px 0px;
}
</style>
