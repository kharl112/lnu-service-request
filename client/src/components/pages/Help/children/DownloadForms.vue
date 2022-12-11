<script>
import ViewPDF from "../../Home/user/contents/ViewPDF";

export default {
  name: "DownloadForms",
  components: { ViewPDF },
  data: () => ({
    doc_view: {
      currentPage: 1,
      pageCount: 0,
      shown: true,
    },
    sections: [],
  }),
  computed: {
    route: {
      get() {
        return this.$route.fullPath;
      },
      set(link) {
        if (link)
          if (this.$route.fullPath !== link) return this.$router.push(link);
        return;
      },
    },
  },
  created() {
    const section_placeholder = [
      {
        title: "Available Forms",
        links: [],
      },
    ];

    const pdfs = require.context("@/assets/pdfs", true, /pdf$/);
    section_placeholder[0].links = pdfs.keys().map((file) => ({
      hash: file.replace("./", "").split(".")[0],
      title: file
        .replace("./", "")
        .replace(/_/g, " ")
        .split(".")[0]
        .toUpperCase(),
      file: file.replace("./", ""),
    }));

    this.sections = section_placeholder;
  },
};
</script>
<template>
  <v-container fluid class="mt-16 pa-0">
    <v-row justify="start">
      <v-col cols="3" class="d-none d-md-flex">
        <v-navigation-drawer
          permanent
          class="nav-drawer"
          v-if="sections.length"
        >
          <v-list shaped v-for="(section, x) in sections" :key="x">
            <v-subheader class="font-weight-bold text-body-1 mb-2">
              {{ section.title }}
            </v-subheader>
            <v-list-item-group v-model="route">
              <v-list-item
                v-for="(item, i) in section.links"
                :key="i"
                :value="'/help/download-forms#' + item.hash"
                dense
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title
                    :href="'#' + item.hash"
                    tag="a"
                    class="text-decoration-none secondary--text"
                  >
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
        <v-skeleton-loader
          v-else
          type="article,article,article"
          min-width="100%"
        />
      </v-col>
      <v-col cols="12" md="9" class="main-container pr-md-16">
        <v-container fluid>
          <h2 class="primary--text mb-5">Download Forms</h2>
          <v-row v-if="sections.length" align="stretch">
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="file of sections[0].links"
              :key="file.hash"
            >
              <v-card class="pa-2 py-4" style="height: 100%" :id="file.hash">
                <v-card-title class="text-center pb-0 align-center">
                  <v-row justify="center">
                    <span class="primary--text"> {{ file.title }} </span>
                  </v-row>
                </v-card-title>
                <ViewPDF
                  :pdfLoading="{}"
                  :doc_view="doc_view"
                  :blobUrl="require(`../../../../assets/pdfs/${file.file}`)"
                />
                <v-container fluid class="mt-2">
                  <v-row justify="center">
                    <v-btn
                      :href="require(`../../../../assets/pdfs/${file.file}`)"
                      small
                      outlined
                      color="error"
                      >Download File <v-icon right>mdi-download</v-icon></v-btn
                    >
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12" sm="6" md="4" v-for="x of [1, 2, 3, 4]" :key="x">
              <v-skeleton-loader type="card" max-height="500px" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.main-container {
  overflow-y: auto;
  height: calc(100vh - 130px);
}
</style>
