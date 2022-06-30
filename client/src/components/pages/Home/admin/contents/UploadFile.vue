<script>
export default {
  name: "UploadFile",
  props: {
    data: Object,
    hideAndSeekUpload: Function,
  },
  data: () => ({
    file: null,
    rules: [
      (v) => !v || v.size < 250000000 || "File size should be less than 25mb",
    ],
  }),
  computed: {
    getUploadLoading() {
      return this.$store.getters["gdrive/getLoading"].upload;
    },
    getUploadPercent() {
      return this.$store.getters["gdrive/getUploadPercent"];
    },
  },
  methods: {
    async handleSubmitFile(e) {
      e.preventDefault();
      if (this.file)
        await this.$store.dispatch("gdrive/UploadFile", {
          form_ref: this.$refs.form,
          file: this.file,
          request_id: this.$route.params._id,
          user_type: "admin",
        });
      this.file = null;
      this.hideAndSeekUpload();
    },
  },
};
</script>
<template>
  <v-overlay :value="data.shown" :z-index="100">
    <v-card class="pa-4 mx-5" min-width="350" max-width="550" light outlined>
      <v-row dense no-gutters justify="start" justify-sm="center">
        <v-col cols="12">
          <v-row justify="end">
            <v-btn
              @click="hideAndSeekUpload"
              large
              icon
              color="error"
              class="mb-2"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col cols="12" class="ma-1 mt-4">
          <form ref="form" @submit="handleSubmitFile">
            <v-row justify="center">
              <v-col cols="12" class="pb-0">
                <v-file-input
                  :disabled="getUploadLoading"
                  prepend-icon=""
                  prepend-inner-icon="mdi-download-outline"
                  :rules="rules"
                  v-model="file"
                  label="Select File"
                  show-size
                  large
                  outlined
                />
              </v-col>
              <v-col cols="12" class="pt-0" v-if="getUploadLoading">
                <v-progress-linear v-model="getUploadPercent" height="20">
                  <strong>{{ getUploadPercent }}%</strong>
                </v-progress-linear>
              </v-col>
              <v-col cols="12" align="center" class="py-0">
                <v-btn
                  color="primary"
                  :disabled="getUploadLoading"
                  elevation="0"
                  block
                  large
                  @click="handleSubmitFile"
                  type="submit"
                >
                  <v-icon left> mdi-google-drive </v-icon>
                  Upload to Google Drive
                </v-btn>
              </v-col>
              <v-col cols="12" class="pa-0 pl-2">
                <v-subheader
                  class="caption pa-0 text-center"
                  v-if="getUploadLoading"
                >
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Your file is uploading, please wait. This might take a while
                  depending on your file size.
                </v-subheader>
                <v-subheader class="caption pa-0 text-center" v-else>
                  <v-icon class="mr-2">mdi-information</v-icon>
                  25mb is the recommended maximum file size
                </v-subheader>
              </v-col>
            </v-row>
          </form>
        </v-col>
      </v-row>
    </v-card>
  </v-overlay>
</template>
