<script>
import SetSignature from "../contents/SetSignature";
import Mailing from "./options/Mailing";
import PassSlip from "./options/PassSlip";
import Risograph from "./options/Risograph";
import Unavailable from "./options/Unavailable";
import form from "./options/form";
import changeServices from "./options/changeServices";

export default {
  name: "Compose",
  components: {
    SetSignature,
    Mailing,
    PassSlip,
    Unavailable,
    Risograph,
  },
  data: () => ({
    signatureVisibility: false,
    others: false,
    rules: [(v) => !!v || "This field is not allowed to be empty"],
    items: ["A4", "Letter"],
    timeout: 3000,
    form,
    optionalComponents: [
      { id: "60f62de769f7dd1017e2ba4b", component: "Mailing" },
      { id: "60f62dd969f7dd1017e2ba4a", component: "Risograph" },
      { id: "60f62dcb69f7dd1017e2ba49", component: "PassSlip" },
    ],
  }),
  computed: {
    getFacultyProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    getAllServiceProviders() {
      return this.$store.getters["faculty/getAllServiceProviders"];
    },
    getAllAdmin() {
      return this.$store.getters["admin/getAllAdmin"];
    },
    getAllServices() {
      return this.$store.getters["service/getAllServices"];
    },
    getComposeLoading() {
      return this.$store.getters["request/getLoading"].compose;
    },
    isLoading() {
      const { getters } = this.$store;
      return (
        getters["faculty/getLoading"].all_service_provider ||
        getters["admin/getLoading"].all_admin ||
        getters["service/getAllServices"].all_admin
      );
    },
  },
  methods: {
    getOptionalComponent() {
      const [optionalComponent] = this.optionalComponents.filter(
        ({ id }) => id === this.form.service_id
      );
      return optionalComponent ? optionalComponent.component : "Unavailable";
    },
    showSignature() {
      this.signatureVisibility = !this.signatureVisibility;
    },
    customService(bool) {
      this.others = bool;
      if (bool) return (this.form.service_id = "");
      return (this.form.other_service = "");
    },
    handleChangeService(e) {
      return (this.form.options = changeServices(e));
    },
    handleSetSignature(signatureId) {
      const signatureElement = document.getElementById(signatureId).innerHTML;
      return (this.form.user.signature = signatureElement
        .toString()
        .replace('height="300"', 'height="175" viewBox="0 0 300 175"'));
    },
    handleSubmit(save_as) {
      (e) => {
        e.preventDefault();
      };
      this.form.save_as = save_as;
      if (!this.form.other_service) delete this.form.other_service;
      if (this.$refs.form.validate()) {
        if (this.form.options.documents && !this.form.options.documents[0])
          return this.$store.dispatch(
            "message/errorMessage",
            "You need to add atleast 1 document for Risograph"
          );
        if (!this.form.user.signature)
          return this.$store.dispatch(
            "message/errorMessage",
            "You must sign this document to proceed"
          );
        return this.$store.dispatch("request/createRequest", this.form);
      }
      return;
    },
  },
  created() {
    this.$store.dispatch("faculty/allServiceProviders");
    this.$store.dispatch("admin/allAdmin");
    this.$store.dispatch("service/allServices");
  },
};
</script>
<template>
  <v-container fluid class="pa-3">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-form
          ref="form"
          @submit="(e) => e.preventDefault()"
          :disabled="getComposeLoading"
          v-if="!isLoading"
        >
          <v-row justify="start" align="start" no-gutters dense>
            <v-col cols="12">
              <v-container fluid>
                <h4
                  class="text-h6 text-sm-h6 text-md-h5 primary--text text-uppercase"
                >
                  Compose Request
                </h4>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid class="pt-0 pb-0">
                <v-subheader>Request</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid>
                <v-row justify="start">
                  <v-col cols="12" sm="12" md="8">
                    <v-row justify="start">
                      <v-col cols="12" class="pb-5 pb-md-0">
                        <v-row align="start" dense>
                          <v-col cols="12" sm="8" v-if="!others">
                            <v-autocomplete
                              v-model="form.service_id"
                              outlined
                              label="Service Type"
                              :rules="others ? rules : []"
                              :items="getAllServices"
                              @change="handleChangeService"
                              item-text="type"
                              item-value="_id"
                              dense
                            />
                          </v-col>
                          <v-col cols="12" sm="8" v-if="others">
                            <v-text-field
                              v-model="form.other_service"
                              append-outer-icon="mdi-eye-off"
                              label="Others"
                              hint="please specify custom service"
                              @click:append-outer="customService(false)"
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col v-else cols="12" sm="3" md="3">
                            <v-btn
                              @click="customService(true)"
                              block
                              outlined
                              color="primary"
                            >
                              others
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                          v-model="form.subject"
                          autofocus
                          outlined
                          :rules="rules"
                          label="Description"
                          dense
                          counter
                          maxlength="50"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          rows="10"
                          class="body-2"
                          v-model="form.body"
                          outlined
                          :rules="rules"
                          label="Purpose"
                          auto-grow
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="hidden-sm-and-down" vertical />
                  <component
                    :options="form.options"
                    :rules="rules"
                    :is="getOptionalComponent()"
                  />
                  <v-col cols="12">
                    <v-divider />
                  </v-col>
                  <v-col cols="12" class="pb-0 pt-0">
                    <v-container fluid class="pt-0">
                      <v-subheader>Person/s involved </v-subheader>
                      <v-divider />
                    </v-container>
                  </v-col>
                  <v-col cols="12">
                    <v-container fluid class="pt-2 pb-0">
                      <v-row justify="start" align="start" dense>
                        <v-col cols="12" sm="6" md="5">
                          <v-autocomplete
                            v-model="form.admin.staff_id"
                            :rules="rules"
                            small
                            :items="getAllAdmin"
                            class="caption"
                            item-text="name"
                            item-value="staff_id"
                            outlined
                            label="Chief Admin Office"
                            dense
                            prepend-inner-icon="mdi-close"
                            @click:prepend-inner="form.admin.staff_id = ''"
                          />
                        </v-col>
                        <v-col cols="12" sm="6" md="5">
                          <v-autocomplete
                            v-model="form.service_provider.staff_id"
                            :items="getAllServiceProviders"
                            class="caption"
                            item-text="text"
                            item-value="staff_id"
                            outlined
                            label="Service Provider (optional)"
                            hint="(optional)"
                            dense
                            prepend-inner-icon="mdi-close"
                            @click:prepend-inner="
                              form.service_provider.staff_id = ''
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      :disabled="getComposeLoading"
                      color="success"
                      type="button"
                      @click="showSignature"
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
                      <v-subheader
                        >Save As
                        <v-subheader
                          class="caption font-weight-bold mt-0 hidden-sm-and-down"
                          >(This will set to draft as a default)</v-subheader
                        >
                      </v-subheader>
                      <v-divider />
                    </v-container>
                  </v-col>

                  <v-col cols="12">
                    <v-row justify="start" align="start" dense>
                      <v-col cols="12" sm="5" md="3">
                        <v-btn
                          :disabled="getComposeLoading"
                          color="warning"
                          type="submit"
                          @click="handleSubmit(0)"
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
                      <v-col cols="12" sm="5" md="3">
                        <v-btn
                          :disabled="getComposeLoading"
                          color="primary"
                          type="button"
                          @click="handleSubmit(1)"
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
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-form>
        <v-skeleton-loader v-else class="mx-auto" type="card, card, card" />
      </v-col>
    </v-row>
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :handleSetSignature="handleSetSignature"
    />
  </v-container>
</template>
