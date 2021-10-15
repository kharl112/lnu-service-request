<script>
export default {
  name: "UploadFile",
  props: {
    uploadVisibility: Boolean,
    showUpload: Function,
    request_obj: Object,
  },
  data: () => ({
    file: null,
    rules: [(v) => !!v || "you must attached a file here"],
  }),
  computed: {
    getUploadLoading() {
      return this.$store.getters["gdrive/getLoading"].upload;
    },
  },
  methods: {
    handleSubmitFile(e) {
      e.preventDefault();
      if (this.file)
        this.$store.dispatch("gdrive/UploadFile", {
          form_ref: this.$refs.form,
          file: this.file,
          request_id: this.request_obj._id,
          user_type: "admin",
        });
    },
  },
};
</script>
<template>
  <v-overlay :value="uploadVisibility" :z-index="100">
    <v-card class="pa-4 mx-5" min-width="350" max-width="550" light outlined>
      <v-row dense no-gutters justify="start" justify-sm="center">
        <v-col cols="12">
          <v-row justify="end">
            <v-btn @click="showUpload" large icon color="error" class="mb-2">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col cols="12" class="ma-1">
          <form ref="form" @submit="handleSubmitFile">
            <v-row justify="center">
              <v-col cols="12" class="pb-0">
                <v-file-input
                  :rules="rules"
                  v-model="file"
                  label="Select File"
                  show-size
                />
              </v-col>
              <v-col cols="12" align="center" class="pt-2">
                <v-btn
                  color="primary"
                  :loading="getUploadLoading"
                  elevation="0"
                  block
                  small
                  @click="handleSubmitFile"
                  type="submit"
                >
                  Upload
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </v-col>
      </v-row>
    </v-card>
  </v-overlay>
</template>
