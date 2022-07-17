<script>
export default {
  name: "Tutorials",
  data: () => ({
    sections: [
      {
        title: "Requester's Guide",
        id: "requesters_guide",
        links: [
          {
            hash: "go_to_lnusr",
            title: "Go to LNU Service Request",
            description: "",
            img_src: "",
          },
          {
            hash: "click_user_type",
            title: "Click on the Select User Type",
            description: "",
            img_src: "click_user_type",
          },
          {
            hash: "select_user_type",
            title: "Select the type of user",
            description:
              "This is to identify the type of user that is going to login to the system, Therefore, select the Employee option.",
            img_src: "select_user_type",
          },
          {
            hash: "click_email_1",
            title: "Click on email",
            description: "Login your email",
            img_src: "click_email_1",
          },
          {
            hash: "click_password_1",
            title: "Click on password Field",
            description: "Login your password",
            img_src: "click_password_1",
          },
          {
            hash: "click_login_1",
            title: "Click on LOGIN",
            description: "Login to the app",
            img_src: "click_login_1",
          },
          {
            hash: "click_compose_1",
            title: "Click on compose",
            description: "This is where you're going to create your request",
            img_src: "click_compose_1",
          },
          {
            hash: "click_service_type_1",
            title: "Click on Service Type",
            description: "",
            img_src: "click_service_type_1",
          },
          {
            hash: "select_service_type_1",
            title: "Select and click the Type of Service",
            description:
              "This is where you will choose the type of service that you need",
            img_src: "select_service_type_1",
          },
          {
            hash: "click_description_box_1",
            title: "Click on the Description Box",
            description: "Add a Description to your Request",
            img_src: "click_description_box_1",
          },
          {
            hash: "click_purpose_box_1",
            title: "Click the Purpose Box",
            description: "Add a Purpose to your Request",
            img_src: "click_purpose_box_1",
          },
          {
            hash: "select_date_box_1",
            title: "Click Select Date Box",
            description:
              "This is where you're going to select the Date of your Pass Slip service request",
            img_src: "select_date_box_1",
          },
          {
            hash: "select_timeout_box_1",
            title: "Click Select Timeout Box",
            description: "Input the accurate timeout of your request",
            img_src: "select_timeout_box_1",
          },
          {
            hash: "click_chief_admin_box_1",
            title: "Click on Chief Admin Office Box",
            description:
              "Select the Chef Admin where the user is going to send the request for approval",
            img_src: "select_chief_admin_box_1",
          },
          {
            hash: "click_service_provider_box_1",
            title: "Click on Service Provider Box",
            description:
              "The user will select the Service Provider that will perform his/her requested service",
            img_src: "click_service_provider_box_1",
          },
          {
            hash: "click_e_signature_1",
            title: " Click on YOUR SIGNATURE Button",
            description: "",
            img_src: "click_e_signature_1",
          },
          {
            hash: "draw_e_signature_1",
            title: "Draw your E-Signature",
            description: "The E-signature will be seen on the request form",
            img_src: "draw_e_signature_1",
          },
          {
            hash: "click_confirm_1",
            title: "Click on CONFIRM button",
            description: "",
            img_src: "click_confirm_1",
          },
          {
            hash: "click_send_1",
            title: "Click on SEND OR DRAFT button",
            description:
              " The requested service by the user will be sent to the Chef Admin and Service Provider or get drafted for later use",
            img_src: "click_send_1",
          },
          {
            hash: "click_send_1",
            title: "Click on SEND OR DRAFT button",
            description:
              " The requested service by the user will be sent to the Chef Admin and Service Provider or get drafted for later use",
            img_src: "click_send_1",
          },
        ],
      },
      {
        title: "Tracking Request",
        id: "tracking_request",
        links: [
          {
            hash: "click_track_request",
            title: "Click on Track Request Button",
            description: "",
            img_src: "click_track_request",
          },
          {
            hash: "input_track",
            title: "Input/paste the tracking code",
            description: "",
            img_src: "input_track",
          },
          {
            hash: "click_track",
            title: "Click the track button",
            description: "Click the track button to track request",
            img_src: "click_track",
          },
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
      <v-col cols="3" class="main-container">
        <v-navigation-drawer permanent class="nav-drawer">
          <v-card-title class="my-0 py-2"> Contents </v-card-title>
          <v-list shaped v-for="(section, x) in sections" :key="x">
            <v-subheader class="font-weight-bold text-body-1 mb-2">
              {{ section.title }}
            </v-subheader>
            <v-list-item-group v-model="route">
              <v-list-item
                v-for="(item, i) in section.links"
                :key="i"
                :value="'/help/tutorials#' + item.hash"
                dense
                :title="item.description"
              >
                <v-list-item-content class="py-0">
                  <v-list-item-title
                    :href="'#' + item.hash"
                    tag="a"
                    class="text-decoration-none secondary--text"
                  >
                    {{ i + 1 }}. {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>
      <v-col cols="6" class="main-container pr-sm-16">
        <v-container fluid v-for="(section, x) in sections" :key="x">
          <h5 class="text-h5 mb-2 font-weight-bold" :id="section.id">
            {{ section.title }}
          </h5>
          <v-row justify-content="start">
            <v-col
              cols="12"
              v-for="(item, i) in section.links"
              :key="i"
              :id="item.hash"
              class="my-4"
            >
              <h6 class="text-h6 mb-2">{{ i + 1 }}. {{ item.title }}</h6>
              <p class="text-body-1" v-if="item.description">
                {{ item.description }}
              </p>
              <v-img
                v-if="item.img_src"
                class="tutorial-img"
                :src="
                  require('../../../../assets/images/tutorials/' +
                    item.img_src +
                    '.webp')
                "
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-divider vertical />
      <v-col cols="2">
        <v-card-title class="my-0 py-2"> Sections </v-card-title>
        <v-list shaped v-for="(section, x) in sections" :key="x">
          <a
            class="font-weight-bold text-body-1 my-5 px-5 text-decoration-none"
            :href="'/help/tutorials#' + section.id"
          >
            {{ section.title }}
          </a>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.main-container {
  overflow-y: auto;
  height: calc(100vh - 130px);
}
.tutorial-img {
  max-width: 500px;
}
</style>
