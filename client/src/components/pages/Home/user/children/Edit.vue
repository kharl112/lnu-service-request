<script>
import SetSignature from "../contents/SetSignature";
export default {
  name: "Edit",
  components: {
    SetSignature,
  },
  data: () => ({
    signatureVisibility: false,
    rules: [(v) => !!v || "This field is not allowed to be empty"],
    items: ["A4", "Letter"],
    timeout: 3000,
    form: {
      subject: "",
      greetings: "",
      body: "",
      options: {
        format: "A4",
        border: {
          top: 0.5,
          right: 0.5,
          bottom: 0.5,
          left: 0.5,
        },
      },
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
    getEditLoading() {
      return this.$store.getters["request/getLoading"].edit;
    },
  },
  methods: {
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
        if (!this.form.user.signature)
          return this.$store.dispatch(
            "message/errorMessage",
            "You must sign this document to proceed"
          );
        return this.$store.dispatch("request/editRequest", this.form);
      }
      return console.log("unvalidated");
    },
    handleSubmitSend(e) {
      e.preventDefault();
      this.form.save_as = 1;
      if (this.$refs.form.validate()) {
        if (!this.form.user.signature)
          return this.$store.dispatch(
            "message/errorMessage",
            "You must sign this document to proceed"
          );
        return this.$store.dispatch("request/editRequest", this.form);
      }
      return console.log("unvalidated");
    },
  },
  created() {
    this.$store.dispatch("faculty/allHead");
    this.$store.dispatch("admin/allAdmin");
    this.form = this.$store.getters["request/getLetterInfo"];
  },
};
</script>
<template>
  <v-container fluid class="pa-3">
    <v-row justify="start" align="start">
      <v-col cols="12" sm="12" md="8">
        <v-form
          ref="form"
          @submit="handleSubmitForm"
          :disabled="getEditLoading"
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
                <v-subheader>Recipients</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid class="pt-2 pb-0">
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
              <v-container fluid class="pt-0 pb-0">
                <v-subheader>Request Letter</v-subheader>
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
                      :disabled="getEditLoading"
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
                    <v-container fluid>
                      <v-subheader>Save As</v-subheader>
                      <v-divider />
                    </v-container>
                  </v-col>
                  <v-col cols="12">
                    <v-row justify="start" align="start" dense>
                      <v-col cols="12" sm="5" md="3">
                        <v-btn
                          :disabled="getEditLoading"
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
                          :disabled="getEditLoading"
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
              <h4 class="text-6 text-sm-h6 text-md-h5">Options</h4>
              <v-divider />
            </v-container>
          </v-col>
          <v-col cols="12">
            <v-card outlined class="mx-auto" max-width="344">
              <v-list-item>
                <v-list-item-content>
                  <v-card-title>Format</v-card-title>
                  <v-select
                    label="Document Format"
                    dense
                    outlined
                    :items="items"
                    v-model="form.options.format"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card outlined class="mx-auto" max-width="344">
              <v-list-item>
                <v-list-item-content>
                  <v-card-title> Border</v-card-title>
                  <v-text-field
                    label="top"
                    :rules="rules"
                    v-model="form.options.border.top"
                    outlined
                    dense
                    type="number"
                    suffix="inch"
                  />
                  <v-text-field
                    label="right"
                    :rules="rules"
                    v-model="form.options.border.right"
                    outlined
                    dense
                    type="number"
                    suffix="inch"
                  />
                  <v-text-field
                    label="bottom"
                    :rules="rules"
                    v-model="form.options.border.bottom"
                    outlined
                    dense
                    type="number"
                    suffix="inch"
                  />
                  <v-text-field
                    label="left"
                    :rules="rules"
                    v-model="form.options.border.left"
                    outlined
                    dense
                    type="number"
                    suffix="inch"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :handleSetSignature="handleSetSignature"
    />
  </v-container>
</template>
