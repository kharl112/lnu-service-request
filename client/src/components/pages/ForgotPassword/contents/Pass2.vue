<script>
export default {
  name: "Pass2",
};
</script>
<template>
  <v-card class="pa-5 ma-2" outlined min-width="240" max-width="500px">
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-card-title class="pa-0 text-left text-caption">
            Link sent to your email
            <v-icon color="primary" class="ml-2"> mdi-check-circle</v-icon>
          </v-card-title>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0 ">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-subheader class="pa-0 text-left">
            Please check your email address to continue
          </v-subheader>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0 ">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-card-actions class="pa-0">
            <router-link to="step=1" class="text-caption"
              >I didn't received any email</router-link
            >
          </v-card-actions>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
