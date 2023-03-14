<script>
import SetSignature from "../../contents/SetSignature";
import Mailing from "../options/Mailing";
import PassSlip from "../options/PassSlip";
import Risograph from "../options/Risograph";
import Default from "../options/Default";
import Certification from "../options/Certification";
import IssueSlip from "../options/IssueSlip";
import CctvReview from "../options/CctvReview";
import GatePass from "../options/GatePass";
import RequestForServices from "../options/RequestForServices";

import form from "../options/form";
export default {
  name: "ComposeV2",
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
    RequestForServices,
  },
  data: () => ({
    signature_view: { shown: false },
    others: false,
    rules: [(v) => !!v || "This field is not allowed to be empty"],
    items: ["A4", "Letter"],
    timeout: 3000,
    form,
    tab: 0,
  }),
  computed: {
    getUploadLoading() {
      return this.$store.getters["gdrive/getLoading"].upload;
    },
    getUploadPercent() {
      return this.$store.getters["gdrive/getUploadPercent"];
    },
    isEditMode() {
      return this.$route.fullPath.split("/").at(-1) != "compose";
    },
    isMobile() {
      const mobile = window.matchMedia("(max-width: 780px)");
      return mobile.matches;
    },
    pdfLoading() {
      return this.$store.getters["pdf/getLoading"];
    },
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
      const services = this.$store.getters["service/getAllServices"];

      return [
        { header: "Available" },
        ...services,
        { divider: true },
        { header: "Others" },
        {
          type: "Custom (create your own)",
          _id: "",
          options: { persons_involved: [] },
          component: "Default",
        },
      ];
    },
    getComposeLoading() {
      return (
        this.$store.getters["request/getLoading"].create ||
        this.$store.getters["request/getLoading"].edit
      );
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
    //tabs
    onChangeTabs(index) {
      this.tab = index;
    },
    incrementTabIndex() {
      if (this.tab == 0 && !this.$refs.info_form.validate()) return;
      if (this.tab == 1 && !this.$refs.service_form.validate()) return;

      this.tab = this.tab + 1;
    },
    decrementTabIndex() {
      this.tab = this.tab - 1;
    },
    getOptionalComponent() {
      const [optionalComponent] = this.getAllServices.filter(
        ({ _id }) => _id === this.form.service_id
      );
      return optionalComponent ? optionalComponent.component : "Default";
    },
    hideAndSeekSignature() {
      this.signature_view.shown = !this.signature_view.shown;
    },
    handleChangeService(e) {
      const [selectedOption] = this.getAllServices.filter(
        ({ _id }) => _id === e
      );
      this.form.options = selectedOption.options;
    },
    handleSetSignature(signatureId, hideSignatures) {
      const signatureElement = document.getElementById(signatureId).innerHTML;
      this.form.user.signature = signatureElement
        .toString()
        .replace('height="300"', 'height="175" viewBox="0 0 300 175"');
      this.form.hideSignatures = hideSignatures;
    },
    handleSubmit(status) {
      (e) => {
        e.preventDefault();
      };
      localStorage.removeItem("compose");
      this.form.reports.status = status || "created";
      if (this.form.service_id) delete this.form.other_service;
      this.form.subject = this.form.subject ? this.form.subject : this.form.body;

      if (!this.$refs.form.validate())
        return this.$store.dispatch(
          "message/errorMessage",
          "You must complete all the fields"
        );

      if (!this.form.user.signature && status)
        return this.$store.dispatch(
          "message/errorMessage",
          "You must sign this document to proceed"
        );

      if (!this.$route.params._id)
        this.$store.dispatch("request/Create", this.form, this.$refs.form);
      else this.$store.dispatch("request/Edit", this.form, this.$refs.form);
    },
    handleSetLocalStorage() {
      localStorage.setItem("compose", JSON.stringify(this.form));
    },
    downloadPDF() {
      return this.$store.dispatch("pdf/generatePDF", {
        user_type: "faculty",
        id: this.$route.params._id,
      });
    },
  },
  created() {
    //create
    if (!this.$route.params._id) {
      const compose = localStorage.getItem("compose");
      if (compose) {
        this.form = JSON.parse(compose);
        this.form.user.signature = "";
      }
    }

    //update
    else {
      this.form = {
        ...this.$store.getters["request/getInfo"],
        other_service: "",
      };
    }

    this.$store.dispatch("faculty/allServiceProviders");
    this.$store.dispatch("admin/allAdmin");
    this.$store.dispatch("service/allServices");
  },

  unmounted() {
    this.form.user.signature = "";
    if (this.$route.params._id) {
      localStorage.removeItem("compose");
    }
  },
};
</script>
<template>
  <v-container fluid class="pa-3">
    <v-row justify="start" align="start">
      <v-col cols="12" :class="isMobile ? 'pa-0' : ''">
        <v-form
          ref="form"
          @submit="(e) => e.preventDefault()"
          :disabled="getComposeLoading"
          v-if="!isLoading"
        >
          <v-row justify="start" align="start" no-gutters dense>
            <v-col
              cols="12"
              :style="isMobile ? 'margin-bottom: -3rem; z-index: 1 ' : ''"
            >
              <v-container fluid class="px-2 px-sm-5 px-md-10">
                <v-row
                  justify="space-between px-2 px-sm-5 pb-2"
                  align="center"
                  v-if="isEditMode"
                >
                  <v-subheader class="text-h6 text-center pl-0">
                    EDIT DRAFT
                  </v-subheader>
                  <v-btn
                    small
                    elevation="0"
                    color="error"
                    :disabled="pdfLoading.download"
                    @click="downloadPDF"
                  >
                    Get PDF file
                    <v-icon right>mdi-download</v-icon>
                  </v-btn>
                </v-row>
                <v-subheader class="text-h6 text-center pl-0" v-else>
                  COMPOSE NEW
                </v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12" class="pa-0 pa-sm-5 pa-md-10">
              <v-container fluid>
                <v-row justify="end">
                  <!-- Info -->

                  <v-tabs
                    :vertical="!isMobile"
                    :centered="false"
                    :value="tab"
                    @change="onChangeTabs"
                  >
                    <v-tab v-show="!isMobile"> Information </v-tab>
                    <v-tab v-show="!isMobile" :disabled="this.tab < 1">
                      Services
                    </v-tab>
                    <v-tab v-show="!isMobile" :disabled="this.tab < 2">
                      <!-- Service Provider -->
                      CAO & Signature
                    </v-tab>

                    <!-- Info -->
                    <v-tab-item class="pt-0 pt-sm-4 pt-md-1">
                      <v-card flat class="px-md-10 px-sm-5 px-2">
                        <v-col cols="12" class="py-0 pt-2">
                          <v-container fluid class="py-0">
                            <v-subheader class="text-h6 px-0">
                              Information
                            </v-subheader>
                          </v-container>
                        </v-col>

                        <v-col cols="12" class="pt-0 pb-6 pl-sm-6">
                          <v-divider />
                        </v-col>

                        <v-col cols="12" class="pl-sm-6">
                          <v-form ref="info_form">
                            <v-row justify="start">
                              <v-col cols="12" class="pb-0 d-none">
                                <v-text-field
                                  v-model="form.subject"
                                  @change="handleSetLocalStorage"
                                  autofocus
                                  outlined
                                  :rules="[]"
                                  label="Subject"
                                  title="Description of your request (required)"
                                  dense
                                  counter
                                  maxlength="50"
                                />
                              </v-col>
                              <v-col cols="12" class="py-0">
                                <v-text-field
                                  type="date"
                                  v-model="form.schedule_date"
                                  @change="handleSetLocalStorage"
                                  outlined
                                  :rules="rules"
                                  label="Schedule Date"
                                  title="Purpose/Body of your request (required)"
                                  persistent-hint
                                  hint="Your preferred schedule date"
                                  required
                                  :min="new Date().toISOString().split('T')[0]"
                                />
                              </v-col>

                              <v-col cols="12" class="py-0">
                                <v-textarea
                                  rows="5"
                                  class="body-2"
                                  v-model="form.body"
                                  @change="handleSetLocalStorage"
                                  outlined
                                  height="100%"
                                  :rules="rules"
                                  label="Purpose"
                                  title="Purpose/Body of your request (required)"
                                  auto-grow
                                />
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-col>
                      </v-card>
                    </v-tab-item>
                    <!-- Service Type  -->
                    <v-tab-item class="pt-0 pt-sm-4 pt-md-1">
                      <v-form ref="service_form">
                        <v-card flat class="px-md-10 px-sm-5">
                          <v-col cols="12" class="py-0 pt-2">
                            <v-container fluid class="py-0">
                              <v-subheader class="text-h6 px-0">
                                Services
                              </v-subheader>
                            </v-container>
                          </v-col>

                          <v-col cols="12" class="pt-0 pb-6 px-6">
                            <v-divider />
                          </v-col>

                          <v-col cols="12">
                            <v-col cols="12" sm="6" class="py-0">
                              <v-autocomplete
                                v-model="form.service_id"
                                outlined
                                label="Service Type"
                                title="Select service type (required)"
                                :rules="others ? rules : []"
                                :items="getAllServices"
                                @change="handleChangeService"
                                item-text="type"
                                item-value="_id"
                                dense
                                persistent-hint
                                hint="Choose your form type - Pass slip, Risograph and more"
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              class="pb-0"
                              v-if="!form.service_id"
                            >
                              <v-text-field
                                v-model="form.other_service"
                                label="Name your custom service"
                                :rules="[
                                  (v) => !!v || 'this field is required',
                                ]"
                                title="Create your own service type"
                                hint="please specify custom service"
                                outlined
                                dense
                              />
                            </v-col>
                            <v-col cols="12" class="my-5">
                              <v-divider />
                            </v-col>
                            <component
                              :options="form.options"
                              :rules="rules"
                              :is="getOptionalComponent()"
                            />
                          </v-col>
                        </v-card>
                      </v-form>
                    </v-tab-item>
                    <!-- Others -->
                    <v-tab-item class="pt-0 pt-sm-4 pt-md-1">
                      <v-card flat class="px-md-10 px-sm-5 px-2 pb-10">
                        <v-col cols="12" class="py-0 pt-2">
                          <v-container fluid class="py-0">
                            <v-subheader class="text-h6 px-0">
                              Chief Admin Officers
                            </v-subheader>
                          </v-container>
                        </v-col>

                        <v-col cols="12" class="pt-0 pb-6 pl-sm-6">
                          <v-divider />
                        </v-col>

                        <v-col cols="12">
                          <v-container fluid class="pt-2 pb-0">
                            <v-row justify="start" align="start" dense>
                              <v-col cols="12" sm="6">
                                <v-autocomplete
                                  v-model="form.admin.staff_id"
                                  @change="handleSetLocalStorage"
                                  :rules="rules"
                                  small
                                  :items="[getAllAdmin[0]]"
                                  class="caption"
                                  item-text="name"
                                  item-value="staff_id"
                                  outlined
                                  label="Select who is available"
                                  title="Select CAO Officer (required)"
                                  dense
                                  prepend-inner-icon="mdi-close"
                                  @click:prepend-inner="
                                    form.admin.staff_id = ''
                                  "
                                >
                                  <template v-slot:item="data">
                                    <v-list-item-content>
                                      <v-list-item-title
                                        :class="
                                          data.item.availability
                                            ? 'primary--text'
                                            : 'secondary--text'
                                        "
                                      >
                                        {{ data.item.name }}
                                        <v-chip
                                          color="primary"
                                          class="ml-2"
                                          x-small
                                          v-if="data.item.availability"
                                        >
                                          Available
                                        </v-chip>
                                        <v-chip
                                          color="gray"
                                          class="ml-2"
                                          x-small
                                          v-else
                                        >
                                          Unavailable
                                        </v-chip>
                                      </v-list-item-title>
                                    </v-list-item-content>
                                  </template>
                                </v-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="6" v-if="false">
                                <v-autocomplete
                                  v-model="form.service_provider.staff_id"
                                  @change="handleSetLocalStorage"
                                  :items="getAllServiceProviders"
                                  class="caption"
                                  item-text="text"
                                  item-value="staff_id"
                                  outlined
                                  title="Select a service provider (optional)"
                                  label="Service Provider (optional)"
                                  hint="(optional)"
                                  dense
                                  prepend-inner-icon="mdi-close"
                                  @click:prepend-inner="
                                    form.service_provider.staff_id = ''
                                  "
                                >
                                  <template v-slot:item="data">
                                    <v-list-item-content>
                                      <v-list-item-title>
                                        {{ data.item.text }}
                                        <!-- <v-chip
                                          color="primary"
                                          class="ml-2"
                                          x-small
                                          v-if="data.item.availability"
                                        >
                                          Available
                                        </v-chip>
                                        <v-chip
                                          color="gray"
                                          class="ml-2"
                                          x-small
                                          v-else
                                        >
                                          Unavailable
                                        </v-chip> -->
                                      </v-list-item-title>
                                      <v-list-item-subtitle
                                        v-html="data.item.department"
                                      ></v-list-item-subtitle>
                                    </v-list-item-content>
                                  </template>
                                </v-autocomplete>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-col>
                        <v-col cols="12" class="py-0 pt-2">
                          <v-container fluid class="py-0">
                            <v-subheader class="text-h6 px-0">
                              Signature
                            </v-subheader>
                          </v-container>
                        </v-col>

                        <v-col cols="12" class="pt-0 pb-6 pl-sm-6">
                          <v-divider />
                        </v-col>

                        <v-col cols="12" sm="6" class="pt-0 pl-6">
                          <v-btn
                            :disabled="getComposeLoading"
                            color="success"
                            type="button"
                            @click="hideAndSeekSignature"
                            block
                            large
                            elevation="0"
                            title="Apply your E-Signature (required)"
                          >
                            Apply Your E-Signature
                            <v-icon right> mdi-signature </v-icon>
                          </v-btn>
                        </v-col>
                      </v-card>
                    </v-tab-item>
                  </v-tabs>

                  <v-col cols="12" sm="10" class="pr-sm-12 mt-10 mt-sm-15">
                    <v-divider />
                    <!-- Loading Upload  -->
                    <v-col cols="12" v-if="getUploadPercent">
                      <p class="overline">Uploading files...</p>
                      <v-progress-linear v-model="getUploadPercent" height="5">
                      </v-progress-linear>
                    </v-col>
                  </v-col>

                  <v-col cols="12" class="pr-sm-12">
                    <v-row justify="end" align="start" dense v-if="tab > 1">
                      <!-- <v-col cols="6" sm="4" md="3">
                        <v-btn
                          :disabled="getComposeLoading"
                          color="warning"
                          type="submit"
                          @click="handleSubmit()"
                          rounded
                          outlined
                          block
                          elevation="0"
                          title="Save this service request as draft"
                        >
                          draft
                          <v-icon right> mdi-paperclip </v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="6" sm="4" md="3">
                        <v-btn
                          :disabled="getComposeLoading"
                          color="primary"
                          type="button"
                          @click="handleSubmit('sent')"
                          rounded
                          outlined
                          block
                          elevation="0"
                          title="Send this service request immediately"
                        >
                          send
                          <v-icon right> mdi-send </v-icon>
                        </v-btn>
                      </v-col> -->
                      <v-col cols="6" sm="4" md="3">
                        <v-btn
                          color="secondary"
                          type="button"
                          :disabled="tab <= 0"
                          @click="decrementTabIndex()"
                          rounded
                          outlined
                          block
                          elevation="0"
                        >
                          Back
                        </v-btn>
                      </v-col>
                      <v-col cols="6" sm="4" md="3">
                        <v-menu offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="primary"
                              dark
                              v-bind="attrs"
                              v-on="on"
                              rounded
                              outlined
                              block
                              elevation="0"
                            >
                              Save As

                              <v-icon right>mdi-chevron-down</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item
                              title="Save this service request as draft"
                              @click="handleSubmit()"
                              :disabled="getComposeLoading"
                            >
                              <v-list-item-title style="cursor: pointer">
                                Draft
                                <v-icon right>mdi-paperclip</v-icon>
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item
                              title="Send this service request immediately"
                              @click="handleSubmit('sent')"
                              :disabled="getComposeLoading"
                            >
                              <v-list-item-title style="cursor: pointer">
                                Send
                                <v-icon right>mdi-send</v-icon>
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-row justify="end" align="start" dense v-else>
                      <v-col cols="6" sm="4" md="3">
                        <v-btn
                          color="secondary"
                          type="button"
                          :disabled="tab <= 0"
                          @click="decrementTabIndex()"
                          rounded
                          outlined
                          block
                          elevation="0"
                        >
                          Back
                        </v-btn>
                      </v-col>
                      <v-col cols="6" sm="4" md="3">
                        <v-btn
                          color="primary"
                          type="button"
                          :disabled="tab > 1"
                          @click="incrementTabIndex()"
                          rounded
                          outlined
                          block
                          elevation="0"
                        >
                          Next
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
      v-if="signature_view.shown"
      :data="signature_view"
      :hideAndSeekSignature="hideAndSeekSignature"
      :handleSetSignature="handleSetSignature"
    />
  </v-container>
</template>
<style scoped>
.v-tab {
  justify-content: start !important;
}
</style>
