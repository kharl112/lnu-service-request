<script>
export default {
  name: "PrivacyAndPolicy",
  data: () => ({
    links: [
      { hash: "privacy_notice", title: "Privacy Notice" },
      { hash: "info_collection", title: "Information Collection" },
      { hash: "info_process", title: "Processing of Information" },
      { hash: "info_share", title: "Sharing of Information" },
      { hash: "info_keep", title: "Lifespan of Information" },
      { hash: "info_safety", title: "Information Safety" },
      {
        hash: "info_restriction_for_minors",
        title: "Information Restriction for minors",
      },
      { hash: "privacy_rights", title: "Your Privacy Rights" },
      { hash: "do_not_track_control", title: "Do Not Track" },
      { hash: "privacy_support", title: "Support" },
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
        <v-navigation-drawer permanent>
          <v-list shaped>
            <v-subheader class="font-weight-bold text-h5 mb-4">
              Contents
            </v-subheader>
            <v-list-item-group v-model="route">
              <v-list-item
                v-for="(item, index) in links"
                :key="index"
                :value="'/help/privacy-and-policy#' + item.hash"
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

      <v-col cols="8" class="main-container">
        <h4 class="text-h4 mb-2 font-weight-bold" id="privacy_notice">
          Privacy Notice
        </h4>
        <p class="overline font-weight-bold">Last updated July 12, 2022</p>
        <p class="text-body-1">
          This privacy notice for LNU Service Requesting App , describes how and
          why we might collect, store, use, and/or share ("process") your
          information when you use our services ("Services"), such as when you:
        </p>
        <ul class="mb-5">
          <li class="text-body-1 my-2">
            Visit our website at
            <a href="https://lnusr.herokuapp.com"
              >https://lnusr.herokuapp.com</a
            >
            , or any website of ours that links to this privacy notice
          </li>
          <li class="text-body-1 my-2">
            Engage with us in other related ways, including any sales,
            marketing, or events
          </li>
        </ul>
        <p class="text-body-1 mb-10">
          Questions or concerns? Reading this privacy notice will help you
          understand your privacy rights and choices. If you do not agree with
          our policies and practices, please do not use our Services. If you
          still have any questions or concerns, please contact us at
          lnu.request.services@gmail.com.
        </p>

        <ol>
          <li class="my-5 text-h5" id="info_collection">
            <h5 class="text-h5 my-2">What information do we collect?</h5>
            <h6 class="text-h6 my-2">
              Personal Information you disclose to us
            </h6>
            <p class="text-body-1">
              <strong>In Short:</strong>
              <em>We collect personal information that you provide to us.</em>
            </p>
            <p class="text-body-1 mb-5">
              We collect personal information that you voluntarily provide to us
              when you register on the Services, express an interest in
              obtaining information about us or our products and Services, when
              you participate in activities on the Services, or otherwise when
              you contact us.
            </p>

            <p class="text-body-1 mb-3">
              <strong>Personal Information Provided by You. </strong>The
              personal information that we collect depends on the context of
              your interactions with us and the Services, the choices you make,
              and the products and features you use. The personal information we
              collect may include the following:
            </p>
            <ul class="my-5">
              <li class="text-body-1 my-2">Names</li>
              <li class="text-body-1 my-2">Email Adress</li>
              <li class="text-body-1 my-2">Passwords</li>
              <li class="text-body-1 my-2">Job Titles</li>
              <p class="text-body-2 my-2">
                <strong>Sensitive Information.</strong> When necessary, with
                your consent or as otherwise permitted by applicable law, we
                process the following categories of sensitive information:
                electronic signature
              </p>
              <li class="text-body-2 my-2">Electronic Signature</li>
            </ul>
            <p class="text-body-1 my-4">
              All personal information that you provide to us must be true,
              complete, and accurate, and you must notify us of any changes to
              such personal information.
            </p>
          </li>
          <li class="my-5 text-h5" id="info_process">
            <h5 class="text-h5 my-2">How do we process your information?</h5>
            <p class="my-5 text-body-1">
              <strong>In Short:</strong>
              <em>
                We process your information to provide, improve, and administer
                our Services, communicate with you, for security and fraud
                prevention, and to comply with law. We may also process your
                information for other purposes with your consent.
              </em>
            </p>
            <p class="text-body-1 my-5 font-weight-bold">
              We process your personal information for a variety of reasons,
              depending on how you interact with our Services, including:
            </p>
            <ul class="my-5">
              <li class="text-body-1 my-2">
                <strong>
                  To facilitate account creation and authentication and
                  otherwise manage user accounts.
                </strong>
                We may process your information so you can create and log in to
                your account, as well as keep your account in working order.
              </li>

              <li class="text-body-1 my-2">
                <strong>
                  To deliver and facilitate delivery of services to the user.
                </strong>
                We may process your information so you can create and log in to
                your account, as well as keep your account in working order.
              </li>

              <li class="text-body-1 my-2">
                <strong> To enable user-to-user communications. </strong>
                We may process your information if you choose to use any of our
                offerings that allow for communication with another user.
              </li>

              <li class="text-body-1 my-2">
                <strong>
                  To evaluate and improve our Services, products, marketing, and
                  your experience
                </strong>
                We may process your information when we believe it is necessary
                to identify usage trends, determine the effectiveness of our
                promotional campaigns, and to evaluate and improve our Services,
                products, marketing, and your experience.
              </li>
            </ul>
          </li>

          <li class="my-5 text-h5" id="info_share">
            <h5 class="text-h5 my-2">
              When and with whom do we share your personal information?
            </h5>
            <p class="text-body-1">
              <strong>In Short:</strong>
              <em> We collect personal information that you provide to us. </em>
            </p>
            <p class="text-body-1 my-5">
              We may need to share your personal information in the following
              situations:
            </p>
            <ul>
              <li class="text-body-1 my-2">
                <strong>Business Transfers. </strong>We may share or transfer
                your information in connection with, or during negotiations of,
                any merger, sale of company assets, financing, or acquisition of
                all or a portion of our business to another company.
              </li>

              <li class="text-body-1 my-2">
                <strong>Other Users. </strong>
                When you share personal information or otherwise interact with
                public areas of the Services, such personal information may be
                viewed by all users and may be publicly made available outside
                the Services in perpetuity. Similarly, other users will be able
                to view descriptions of your activity, communicate with you
                within our Services, and view your profile.
              </li>
            </ul>
          </li>
          <li class="my-5 text-h5" id="info_keep">
            <h5 class="text-h5 my-2">How long do we keep your information?</h5>
            <p class="text-body-1">
              <strong>In Short:</strong>
              <em>
                We keep your information for as long as necessary to fulfill the
                purposes outlined in this privacy notice unless otherwise
                required by law.
              </em>
            </p>
            <p class="text-body-1 my-5">
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy notice, unless
              a longer retention period is required or permitted by law (such as
              tax, accounting, or other legal requirements). No purpose in this
              notice will require us keeping your personal information for
              longer than the period of time in which users have an account with
              us.
            </p>

            <p class="text-body-1 my-5">
              When we have no ongoing legitimate business need to process your
              personal information, we will either delete or anonymize such
              information, or, if this is not possible (for example, because
              your personal information has been stored in backup archives),
              then we will securely store your personal information and isolate
              it from any further processing until deletion is possible.
            </p>
          </li>

          <li class="my-5 text-h5" id="info_safety">
            <h5 class="text-h5 my-2">How do we keep your information safe?</h5>
            <p class="text-body-1">
              <strong>In Short:</strong>
              <em>
                We aim to protect your personal information through a system of
                organizational and technical security measures.
              </em>
            </p>
            <p class="text-body-1 my-5">
              We have implemented appropriate and reasonable technical and
              organizational security measures designed to protect the security
              of any personal information we process. However, despite our
              safeguards and efforts to secure your information, no electronic
              transmission over the Internet or information storage technology
              can be guaranteed to be 100% secure, so we cannot promise or
              guarantee that hackers, cybercriminals, or other unauthorized
              third parties will not be able to defeat our security and
              improperly collect, access, steal, or modify your information.
              Although we will do our best to protect your personal information,
              transmission of personal information to and from our Services is
              at your own risk. You should only access the Services within a
              secure environment.
            </p>
          </li>

          <li class="my-5 text-h5" id="info_restriction_for_minors">
            <h5 class="text-h5 my-2">Do we collect information from minors?</h5>
            <p class="text-body-1">
              <strong>In Short:</strong>
              <em>
                We do not knowingly collect data from or market to children
                under 18 years of age.
              </em>
            </p>
            <p class="text-body-1 my-5">
              We do not knowingly solicit data from or market to children under
              18 years of age. By using the Services, you represent that you are
              at least 18 or that you are the parent or guardian of such a minor
              and consent to such minor dependent’s use of the Services. If we
              learn that personal information from users less than 18 years of
              age has been collected, we will deactivate the account and take
              reasonable measures to promptly delete such data from our records.
              If you become aware of any data we may have collected from
              children under age 18, please contact us at
              lnu.request.services@gmail.com.
            </p>
          </li>

          <li class="my-5 text-h5" id="privacy_rights">
            <h5 class="text-h5 my-2">What are your privacy rights?</h5>
            <p class="text-body-1">
              <strong>In Short:</strong>
              <em>
                You may review, change, or terminate your account at any time.
              </em>
            </p>
            <p class="text-body-1 my-5 font-weight-bold">Account Information</p>
            <p class="text-body-1 mb-5">
              If you would at any time like to review or change the information
              in your account or terminate your account, you can:
            </p>
            <ul>
              <li class="text-body-1 my-2">
                Log in to your account settings and update your user account.
              </li>
            </ul>
            <p class="text-body-1 my-5">
              Upon your request to terminate your account, we will deactivate or
              delete your account and information from our active databases.
              However, we may retain some information in our files to prevent
              fraud, troubleshoot problems, assist with any investigations,
              enforce our legal terms and/or comply with applicable legal
              requirements.
            </p>
            <p class="text-body-1 mb-5">
              If you have questions or comments about your privacy rights, you
              may email us at lnu.request.services@gmail.com.
            </p>
          </li>

          <li class="my-5 text-h5" id="do_not_track_control">
            <h5 class="text-h5 my-2">Controls for Do-Not-Track Features</h5>
            <p class="text-body-1 my-5">
              Most web browsers and some mobile operating systems and mobile
              applications include a Do-Not-Track ("DNT") feature or setting you
              can activate to signal your privacy preference not to have data
              about your online browsing activities monitored and collected. At
              this stage no uniform technology standard for recognizing and
              implementing DNT signals has been finalized. As such, we do not
              currently respond to DNT browser signals or any other mechanism
              that automatically communicates your choice not to be tracked
              online. If a standard for online tracking is adopted that we must
              follow in the future, we will inform you about that practice in a
              revised version of this privacy notice.
            </p>
          </li>

          <li class="my-5 text-h5" id="privacy_support">
            <h5 class="text-h5 my-2">
              How can you contact us about this notice?
            </h5>
            <p class="text-body-1 my-5">
              If you have questions or comments about this notice, you may email
              us at lnu.request.services@gmail.com or by post to:
            </p>
            <p class="text-body-1 my-1">LNU Service Requesting App</p>
            <p class="text-body-1 my-1">Tacloban City, Leyte 6500</p>
            <p class="text-body-1 my-1">Philippines</p>
          </li>
        </ol>
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
