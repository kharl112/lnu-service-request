<script>
import SetSignature from "../contents/SetSignature";
import Mailing from "./options/Mailing";
import PassSlip from "./options/PassSlip";
import Risograph from "./options/Risograph";
import Default from "./options/Default";
import Certification from "./options/Certification";
import IssueSlip from "./options/IssueSlip";
import CctvReview from "./options/CctvReview";
import GatePass from "./options/GatePass";

import form from "./options/form";
export default {
  name: "Compose",
  components: {
    SetSignature,
    Mailing,
    PassSlip,
    Default,
    Risograph,
    Certification,
    IssueSlip,
    CctvReview,
    GatePass,
  },
  data: () => ({
    signature_view: { shown: false },
    others: false,
    rules: [(v) => !!v || "This field is not allowed to be empty"],
    items: ["A4", "Letter"],
    timeout: 3000,
    form,
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
      return this.$store.getters["request/getLoading"].create;
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
      const [optionalComponent] = this.getAllServices.filter(
        ({ _id }) => _id === this.form.service_id
      );
      return optionalComponent ? optionalComponent.component : "Default";
    },
    hideAndSeekSignature() {
      this.signature_view.shown = !this.signature_view.shown;
    },
    customService(bool) {
      this.others = bool;
      if (bool) {
        this.form.service_id = "";
        this.form.options = { persons_involved: [] };
      }
      this.form.other_service = "";
    },
    handleChangeService(e) {
      const [selectedOption] = this.getAllServices.filter(
        ({ _id }) => _id === e
      );
      this.form.options = selectedOption
        ? selectedOption.options
        : { persons_involved: [] };
    },
    handleSetSignature(signatureId) {
      const signatureElement = document.getElementById(signatureId).innerHTML;
      this.form.user.signature = signatureElement
        .toString()
        .replace('height="300"', 'height="175" viewBox="0 0 300 175"');
    },
    handleSubmit(status) {
      (e) => {
        e.preventDefault();
      };
      localStorage.removeItem("compose");
      this.form.reports.status = status || "created";
      if (this.form.service_id) delete this.form.other_service;
      if (this.$refs.form.validate()) {
        if (!this.form.user.signature)
          return this.$store.dispatch(
            "message/errorMessage",
            "You must sign this document to proceed"
          );
        this.$store.dispatch("request/Create", this.form);
      }
    },
    handleSetLocalStorage() {
      localStorage.setItem("compose", JSON.stringify(this.form));
    },
  },
  created() {
    const compose = localStorage.getItem("compose");
    if (compose) {
      this.form = JSON.parse(compose);
      this.form.user.signature = "";
    }
    this.$store.dispatch("faculty/allServiceProviders");
    this.$store.dispatch("admin/allAdmin");
    this.$store.dispatch("service/allServices");
  },
  unmounted() {
    this.form.user.signature = "";
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
              <v-container fluid class="px-0">
                <v-subheader class="subtitle-1"> Compose Request</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid>
                <v-row justify="start">
                  <v-col cols="12" sm="12" md="6">
                    <v-row justify="start">
                      <v-col cols="12" class="pb-3">
                        <v-row align="start" dense>
                          <v-col cols="12" sm="12" v-if="!others">
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
                          <v-col cols="12" class="pb-0" v-if="others">
                            <v-text-field
                              v-model="form.other_service"
                              append-icon="mdi-eye-off"
                              label="Custom Service"
                              hint="please specify custom service"
                              @click:append="customService(false)"
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col v-else cols="12" class="pt-0 mt-n3">
                            <v-btn
                              @click="customService(true)"
                              elevation="0"
                              block
                              color="primary"
                            >
                              Custom service
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="form.subject"
                          @change="handleSetLocalStorage"
                          autofocus
                          outlined
                          :rules="rules"
                          label="Description"
                          dense
                          counter
                          maxlength="50"
                        />
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-textarea
                          rows="10"
                          class="body-2"
                          v-model="form.body"
                          @change="handleSetLocalStorage"
                          outlined
                          height="100%"
                          :rules="rules"
                          label="Purpose"
                          auto-grow
                        />
                      </v-col>
                      <v-col cols="12" class="py-0 px-0">
                        <v-container fluid class="py-0">
                          <v-subheader>Signees</v-subheader>
                          <v-divider />
                        </v-container>
                      </v-col>
                      <v-col cols="12" class="px-0 px-md-3">
                        <v-container fluid class="pt-2 pb-0">
                          <v-row justify="start" align="start" dense>
                            <v-col cols="12">
                              <v-autocomplete
                                v-model="form.admin.staff_id"
                                @change="handleSetLocalStorage"
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
                            <v-col cols="12">
                              <v-autocomplete
                                v-model="form.service_provider.staff_id"
                                @change="handleSetLocalStorage"
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
                            <v-col cols="12" class="py-0">
                              <v-btn
                                :disabled="getComposeLoading"
                                color="success"
                                type="button"
                                @click="hideAndSeekSignature"
                                block
                                large
                                elevation="0"
                              >
                                Your signature
                                <v-icon right> mdi-signature </v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-col>
                      <v-col cols="12" class="hidden-sm-and-up">
                        <v-divider />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="hidden-sm-and-down" vertical />
                  <v-col cols="12" sm="12" md="6" class="pa-0 pa-md-3 py-0">
                    <component
                      :options="form.options"
                      :rules="rules"
                      :is="getOptionalComponent()"
                    />
                    <v-col cols="12" class="pa-0 pa-md-3">
                      <v-container fluid>
                        <v-subheader class="px-0">
                          Save As
                          <v-subheader
                            class="caption font-weight-bold py-0 hidden-sm-and-down"
                          >
                            (This will set to draft as a default)
                          </v-subheader>
                        </v-subheader>
                        <v-divider />
                      </v-container>
                    </v-col>

                    <v-col cols="12">
                      <v-row justify="start" align="start" dense>
                        <v-col cols="12" sm="12" md="6">
                          <v-btn
                            :disabled="getComposeLoading"
                            color="warning"
                            type="submit"
                            @click="handleSubmit()"
                            rounded
                            outlined
                            block
                            elevation="0"
                          >
                            draft
                            <v-icon right> mdi-paperclip </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                          <v-btn
                            :disabled="getComposeLoading"
                            color="primary"
                            type="button"
                            @click="handleSubmit('sent')"
                            rounded
                            outlined
                            block
                            elevation="0"
                          >
                            send
                            <v-icon right> mdi-send </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
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
      v-if="signature_view.shown"
      :data="signature_view"
      :hideAndSeekSignature="hideAndSeekSignature"
      :handleSetSignature="handleSetSignature"
    />
  </v-container>
</template>
