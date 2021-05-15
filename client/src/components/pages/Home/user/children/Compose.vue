<script>
import axios from "axios";
import SetSignature from "../contents/SetSignature";
const fileDownload = require("js-file-download");
export default {
  name: "Compose",
  components: {
    SetSignature,
  },
  data: () => ({
    items: ["Dixie E. Normous", "Ben D. Over"],
    signature: "",
    signatureVisibility: false,
    form: {
      user: "Kharl L. Yumul",
      admin: "",
      head: "",
      body: "",
      greetings: "",
      subject: "",
    },
  }),
  computed: {
    getFacultyProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    getHeads() {
      return this.$store.getters["faculty/getHeads"];
    },
    getLoading() {
      return this.$store.getters["faculty/getLoading"];
    },
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      try {
        const data = await axios.post(
          "/api/pdf/create",
          {
            form: {
              ...this.form,
              signature: this.signature,
            },
            options: { format: "Letter" },
          },
          {
            responseType: "blob",
          }
        );
        return fileDownload(data.data, "response.pdf");
      } catch (error) {
        console.log(error);
      }
    },
    showSignature() {
      this.signatureVisibility = !this.signatureVisibility;
    },
  },
  created() {
    return this.$store.dispatch("faculty/allHead");
  },
};
</script>
<template>
  <v-container fluid>
    <v-row justify="start" align="start">
      <v-col cols="12" sm="10" md="8">
        <v-form @submit="handleSubmit" v-if="!getLoading.head">
          <v-row justify="start" align="start" no-gutters dense>
            <v-col cols="12">
              <v-container fluid>
                <h4 class="text-h6 text-sm-h6 text-md-h5">Compose Request</h4>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-row justify="start" align="start" dense>
                <v-col
                  cols="12"
                  sm="4"
                  md="5"
                  v-if="getFacultyProfile.department.unit_role === 1"
                >
                  <v-autocomplete
                    v-model="form.head"
                    :items="getHeads"
                    item-text="name"
                    item-value="staff_id"
                    outlined
                    label="Department Head"
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="4" md="5">
                  <v-autocomplete
                    v-model="form.admin"
                    :items="items"
                    outlined
                    label="Administration"
                    dense
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.subject"
                outlined
                label="Subject"
                placeholder="Technician for the modification of our faculty"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.greetings"
                outlined
                label="Greetings"
                placeholder="Salutations"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                rows="10"
                v-model="form.body"
                outlined
                label="Body"
                auto-grow
              />
            </v-col>
            <v-col cols="12">
              <v-btn
                color="success"
                @click="showSignature"
                type="reset"
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
                <h4>Save As</h4>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-row justify="start" align="start" dense>
                <v-col cols="12" sm="5" md="3">
                  <v-btn
                    color="primary"
                    type="submit"
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
                    color="warning"
                    type="submit"
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
        </v-form>
      </v-col>
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
    </v-row>
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :signature="signature"
    />
  </v-container>
</template>
