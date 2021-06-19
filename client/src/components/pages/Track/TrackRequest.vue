<script>
export default {
  name: "TrackRequest",
  computed: {
    track_id: {
      get() {
        return this.$route.params._id;
      },
      set(track_id) {
        return track_id
          ? track_id !== this.$route.params._id
            ? this.$router.replace({
                name: "track",
                params: { _id: track_id },
              })
            : null
          : null;
      },
    },
  },
  created() {
    console.log(this.$route);
  },
};
</script>
<template>
  <div class="container">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" align="center">
        <v-card class="pa-5 pt-7 pb-7 ma-1" max-width="400" min-width="200">
          <v-row justify="center" align="center">
            <v-col cols="12" class="pa-1" align="center">
              <v-row justify="center" align="center">
                <v-icon x-large color="primary" classs="ma-4">
                  mdi-map-marker-distance
                </v-icon>
                <div
                  class="text-caption text-sm-body-1 text-md-h6 primary--text text-center text-sm-left text-md-left pa-5"
                >
                  <span class="font-weight-bold warning--text mr-1">LNU</span>
                  Service Request System
                  <v-card-subtitle class="caption text-sm-body-1 pa-0 pb-1">
                    Track Request
                  </v-card-subtitle>
                  <v-divider />
                </div>
              </v-row>
            </v-col>
            <v-col cols="11">
              <v-form>
                <v-text-field
                  append-icon="mdi-arrow-right-bold-box"
                  dense
                  outlined
                  label="track id"
                  v-model="track_id"
                />
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
