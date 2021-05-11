<script>
export default {
  name: "Drafts",
};
</script>
<template>
  <v-container fluid id="draft-container">
    <v-row dense justify="start" justify-sm="start" justify-md="center">
      <v-col cols="12" sm="12" md="10">
        <div class="card-container">
          <div class="options-name">
            <v-checkbox></v-checkbox>
            <p>Kharl yumul</p>
          </div>
          <div class="letter">
            <small>
              Karl Dave D. Almeria moved the card Sprint 1 - Ticket 1 - Set up
              Laravel Project to Testing on Recipe System Reply via email
            </small>
          </div>

          <div class="time-date">
            <strong>
              <small>
                4pm
              </small>
            </strong>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
@import "../../../../../assets/scss/pages/Home/contents/drafts.scss";
</style>
