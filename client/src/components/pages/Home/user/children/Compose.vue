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
};
</script>
<template>
  <v-container fluid>
    <v-form @submit="handleSubmit">
      <v-row justify="start" align="start" no-gutters dense>
        <v-col cols="12" sm="11" md="7">
          <v-container fluid>
            <h4 class="text-h5 text-sm-h4 text-md-h4">Compose Request</h4>
            <v-divider />
          </v-container>
        </v-col>
        <v-col cols="12">
          <v-row justify="start" align="start" dense>
            <v-col cols="12" sm="3" md="2">
              <v-autocomplete
                v-model="form.head"
                :items="items"
                outlined
                label="Department Head"
                dense
              />
            </v-col>
            <v-col cols="12" sm="3" md="2">
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
        <v-col cols="12" sm="11" md="7">
          <v-text-field
            v-model="form.subject"
            outlined
            label="Subject"
            placeholder="Technician for the modification of our faculty"
            dense
          />
        </v-col>
        <v-col cols="12" sm="11" md="7">
          <v-text-field
            v-model="form.greetings"
            outlined
            label="Greetings"
            placeholder="Salutations"
            dense
          />
        </v-col>
        <v-col cols="12" sm="11" md="7">
          <v-textarea
            rows="10"
            v-model="form.body"
            outlined
            label="Body"
            auto-grow
          />
        </v-col>
        <v-col cols="12" sm="11" md="7">
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
        <v-col cols="12" sm="11" md="7">
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
    <SetSignature
      :signatureVisibility="signatureVisibility"
      :showSignature="showSignature"
      :signature="signature"
    />
  </v-container>
</template>
