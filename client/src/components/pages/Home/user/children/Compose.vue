<script>
import axios from "axios";
const fileDownload = require("js-file-download");
export default {
  name: "Compose",
  data: () => ({
    items: ["Dixie E. Normous", "Ben D. Over"],
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
          { form: this.form, options: { format: 'Letter'  } },
          {
            responseType: "blob",
          }
        );
        return fileDownload(data.data, "response.pdf");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<template>
  <v-container fluid>
    <v-form @submit="handleSubmit">
      <v-row justify="start" align="start" no-gutters dense>
        <v-col cols="12" sm="11" md="9">
          <v-text-field
            v-model="form.subject"
            outlined
            label="Subject"
            placeholder="Technician for the modification of our faculty"
            dense
          />
        </v-col>
        <v-col cols="12" sm="11" md="9">
          <v-text-field
            v-model="form.greetings"
            outlined
            label="Greetings"
            placeholder="Salutations"
            dense
          />
        </v-col>
        <v-col cols="12" sm="12" md="9">
          <v-textarea
            rows="10"
            v-model="form.body"
            outlined
            label="Body"
            auto-grow
          />
        </v-col>
        <v-row dense>
          <v-col cols="auto">
            <v-autocomplete
              v-model="form.head"
              :items="items"
              outlined
              label="Department Head"
              dense
            />
          </v-col>
          <v-col cols="auto">
            <v-autocomplete
              v-model="form.admin"
              :items="items"
              outlined
              label="Administration"
              dense
            />
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" type="submit" elevation="0"> send </v-btn>
          </v-col>
        </v-row>
      </v-row>
    </v-form>
  </v-container>
</template>
