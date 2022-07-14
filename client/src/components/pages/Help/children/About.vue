<script>
export default {
  name: "About",
  data: () => ({
    sections: [
      {
        title: "Leyte Normal University",
        links: [
          { hash: "transparency_seal", title: "Transparency Seal" },
          { hash: "mission", title: "Mission" },
          { hash: "vision", title: "Vision" },
        ],
      },
    ],
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
};
</script>
<template>
  <v-container fluid class="mt-16 pa-0">
    <v-row justify="start">
      <v-col cols="4">
        <v-navigation-drawer permanent class="nav-drawer">
          <v-list shaped v-for="(section, x) in sections" :key="x">
            <v-subheader class="font-weight-bold text-body-1 mb-2">
              {{ section.title }}
            </v-subheader>
            <v-list-item-group v-model="route">
              <v-list-item
                v-for="(item, i) in section.links"
                :key="i"
                :value="'/about#' + item.hash"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.nav-drawer {
  min-height: 100vh;
}
</style>
