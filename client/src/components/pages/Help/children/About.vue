<script>
export default {
  name: "About",
  data: () => ({
    sections: [
      {
        title: "About the App",
        links: [
          {
            hash: "how_it_works",
            title: "How it works?",
          },
        ],
      },
      {
        title: "Leyte Normal University",
        links: [
          { hash: "transparency_seal", title: "Transparency Seal" },
          { hash: "mission", title: "Mission" },
          { hash: "vision", title: "Vision" },
          { hash: "core_values", title: "Core Values" },
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
      <v-col cols="3" class="d-none d-md-flex">
        <v-navigation-drawer permanent class="nav-drawer">
          <v-list shaped v-for="(section, x) in sections" :key="x">
            <v-subheader class="font-weight-bold text-body-1 mb-2">
              {{ section.title }}
            </v-subheader>
            <v-list-item-group v-model="route">
              <v-list-item
                v-for="(item, i) in section.links"
                :key="i"
                :value="'/help/about#' + item.hash"
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

      <v-col cols="12" md="9" class="main-container pr-md-16">
        <h4
          class="text-h4 mb-2 font-weight-bold primary--text"
          id="how_it_works"
        >
          How Service Requesting in the application works?
        </h4>
        <p class="text-h6 font-weight-regular mb-12">
          Creating Service Requests will be accomplished by the faculty and the
          rest of the employees of <a href="#transparency_seal">LNU</a> and
          granting approval of the requests which will be done by the Chief
          Administration Office (CAO). Service providers on the other hand, are
          responsible for rendering the service. Thus, completing the service
          request within the application. Go to the
          <a href="/help/tutorials">Tutorials Page</a> to learn more.
        </p>
        <h4
          class="text-h4 mb-2 font-weight-bold warning--text"
          id="transparency_seal"
        >
          Transparency Seal
        </h4>
        <v-container fluid>
          <v-row justify="center">
            <v-img
              src="../../../../assets/images/lnu-logo.png"
              class="seal-logo my-7 mx-5"
            />
            <v-img
              class="seal-logo my-7 mx-5"
              title="Transparency Seal Logo"
              alt="Transparency Seal"
              src="http://lnu.edu.ph/images/transparency_seal/ts.png"
            />
          </v-row>
        </v-container>
        <h5 class="text-h5 my-4 font-weight-bold warning--text">Symbolism</h5>
        <p class="text-body-1">
          <span class="text-h4 primary--text">A</span>
          pearl buried inside a tightly-shut shell is practically worthless.
          Government information is a pearl, meant to be shared with the public
          in order to maximize its inherent value.
        </p>
        <p class="text-body-1">
          The Transparency Seal, depicted by a pearl shining out of an open
          shell, is a symbol of a policy shift towards openness in access to
          government information. On the one hand, it hopes to inspire Filipinos
          in the civil service to be more open to citizen engagement; on the
          other, to invite the Filipino citizenry to exercise their right to
          participate in governance.
        </p>
        <p class="text-body-1">
          This initiative is envisioned as a step in the right direction towards
          solidifying the position of the Philippines as the Pearl of the Orient
          - a shining example for democratic virtue in the region.
        </p>

        <v-divider class="mt-12" />

        <h4
          class="text-h4 mt-12 mb-2 font-weight-bold warning--text"
          id="vision"
        >
          Our Vision
        </h4>
        <p class="text-h6 font-weight-regular">
          <em>
            A leading university of education and diverse disciplines attuned to
            local and global development needs.
          </em>
        </p>
        <h4
          class="text-h5 mt-6 mb-2 font-weight-bold warning--text"
          id="vision"
        >
          Translations
        </h4>
        <v-container fluid>
          <v-row justify="center my-5">
            <h6 class="warning--text mb-2 text-h5">VISYON: (Filipino)</h6>
            <p class="text-h6 font-weight-regular">
              <em>
                Nangungunang unibersidad sa edukasyon at iba't ibang disiplina
                na tumutugon sa pangangailangang local at pandaigdigang
                pag-unlad.
              </em>
            </p>
          </v-row>

          <v-row justify="center my-5">
            <h6 class="warning--text mb-2 text-h5">PANGLANTAW: (Cebuano)</h6>
            <p class="text-h6 font-weight-regular">
              <em>
                Nag-unang unibersidad sa edukasyon ug sa nagkalain-laing
                pagtugon nga gipahaum sa panginahanglan sa paglambong local ug
                kalibotan.
              </em>
            </p>
          </v-row>

          <v-row justify="center my-5">
            <h6 class="warning--text mb-2 text-h5">PANGLANTAW: (Winaray)</h6>
            <p class="text-h6 font-weight-regular">
              <em>
                Nangunguna nga unibersidad ha edukasyon ug iba pa nga mga
                disiplina ha pag-aradman nga nauyon han local ngan global nga
                panginahanglan ha pagdukwag.
              </em>
            </p>
          </v-row>
        </v-container>

        <v-divider class="mt-12" />

        <h4
          class="text-h4 mt-12 mb-2 font-weight-bold warning--text"
          id="mission"
        >
          Our Mission
        </h4>
        <p class="text-h6 font-weight-regular">
          <em>
            To produce top performing professionals equipped to engage on
            knowledge and technology production so necessary to develop a
            sustainable society.
          </em>
        </p>
        <h4
          class="text-h5 mt-6 mb-2 font-weight-bold warning--text"
          id="vision"
        >
          Translations
        </h4>
        <v-container fluid>
          <v-row justify="center my-5">
            <h6 class="warning--text mb-2 text-h5">MISYON: (Filipino)</h6>
            <p class="text-h6 font-weight-regular">
              <em>
                Magprodyus ng mga natatanging propesyunal na may sapat na
                kaalaman at produksyong panteknolohiya na nagpapanatili sa
                maunlad na lipunan.
              </em>
            </p>
          </v-row>

          <v-row justify="center my-5">
            <h6 class="warning--text mb-2 text-h5">TAHAS: (Cebuano)</h6>
            <p class="text-h6 font-weight-regular">
              <em>
                Pagmugma og hanas nga mga propesyunal nga sangkap sa pag-asdang
                sa kaalam og produksyon sa teknolohiya nga gikinahanglan sa
                pag-ugmad og malungtaron nga katilingban.
              </em>
            </p>
          </v-row>

          <v-row justify="center my-5">
            <h6 class="warning--text mb-2 text-h5">TINGUHA: (Winaray)</h6>
            <p class="text-h6 font-weight-regular">
              <em>
                Magpaggradwar han mga propesyunal nga may hitaas nga kapas ha
                pag-aram ngan ha produksyon han teknolohiya nga duro
                kakinahanglanon ha pagdukwag han masususteniran nga komunidad.
              </em>
            </p>
          </v-row>
        </v-container>

        <v-divider class="mt-12" />

        <h4
          class="text-h4 mt-12 mb-2 font-weight-bold warning--text"
          id="core_values"
        >
          Core Values
        </h4>

        <h4 class="text-h5 mt-6 mb-2 font-weight-bold warning--text">
          EXCELLENCE
        </h4>
        <p class="text-h6 font-weight-regular mb-4">
          <em>
            We persistently pursue success and continuously look for innovative
            ways to improve our services.
          </em>
        </p>

        <h4 class="text-h5 mt-6 mb-2 font-weight-bold warning--text">
          INTEGRITY
        </h4>
        <p class="text-h6 font-weight-regular">
          <em>
            We are accountable, honest, trustworthy, respectful, and ethical in
            our actions.
          </em>
        </p>
        <p class="text-h6 font-weight-regular mb-4">
          <em> We uphold a level of independence that assures confidence. </em>
        </p>

        <h4 class="text-h5 mt-6 mb-2 font-weight-bold warning--text">
          SERVICE
        </h4>
        <p class="text-h6 font-weight-regular">
          <em> We serve our internal and external customers with a smile. </em>
        </p>
        <p class="text-h6 font-weight-regular mb-4">
          <em>
            We deliver outstanding service to all, regardless of status, creed,
            color and race.
          </em>
        </p>
      </v-col>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.main-container {
  overflow-y: auto;
  height: calc(100vh - 130px);
}

.seal-logo {
  max-width: 12em;
  height: auto;
}
</style>
