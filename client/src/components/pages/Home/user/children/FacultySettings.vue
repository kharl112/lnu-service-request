<script>
export default {
  name: "FacultySettings",
  data: () => ({
    form: null,
    show_pass: false,
    password: {
      old: "",
      new_1: "",
      new_2: "",
    },
    edit_mode: false,
    edit_mode_password: false,
    rules: {
      password: [
        (v) => (compare_with) => v === compare_with || "Not matched",
        (v) => v.length > 7 || " Required atleast 8 characters",
      ],
      id: (v) => v.length === 7 || "ID number must be 7 digits",
      single_letter: (v) =>
        v.length === 1 || "this field must have 1 character",
      notNull: (v) => !!v || "This field is required",
      letters: (v) => !/\d/gi.test(v) || "Only letters allowed in this field",
      numbers: (v) => /\d/gi.test(v) || "Only numbers allowed in this field",
    },
  }),
  computed: {
    getProfile() {
      return this.$store.getters["faculty/getProfile"];
    },
    getLoading() {
      return this.$store.getters["faculty/getLoading"];
    },
    getAllUnits() {
      return this.$store.getters["unit/getAllUnits"];
    },
    getAllRoles() {
      return this.$store.getters["role/getAllRoles"];
    },
    isUnitLoading() {
      return this.$store.getters["unit/getLoading"];
    },
  },
  methods: {
    resetForm(edit_mode = false) {
      this.edit_mode = edit_mode;
      return (this.form = JSON.parse(JSON.stringify(this.getProfile)));
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        this.edit_mode = false;
        return this.$store.dispatch("faculty/userUpdate", this.form);
      }
    },
    handleChangePassword() {
      if (this.$refs.change_password.validate()) {
        return this.$store.dispatch("faculty/changePassword", this.password);
      }
    },
    handleModified(type) {
      if (type === "password" && !this.edit_mode_password) {
        this.edit_mode_password = !this.edit_mode_password;
      } else if (type === "profile" && !this.edit_mode) {
        this.edit_mode = !this.edit_mode;
      }
      return;
    },
  },
  created() {
    this.resetForm();
    this.$store.dispatch("unit/allUnits");
    this.$store.dispatch("role/allRoles");
  },
};
</script>
<template>
  <v-container fluid class="pa-3">
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-container fluid>
          <v-row justify="start" align="center">
            <v-col cols="6">
              <v-subheader class="text-h6 px-0 text-no-wrap">
                Account Settings
              </v-subheader>
            </v-col>
            <v-col cols="6">
              <v-container fluid>
                <v-row justify="end">
                  <v-btn
                    :disabled="!edit_mode"
                    class="mr-4"
                    color="primary"
                    @click="handleSubmit()"
                    elevation="0"
                    small
                  >
                    <v-icon left>mdi-update</v-icon>
                    Save Changes
                  </v-btn>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-divider />
        </v-container>
      </v-col>
      <v-col cols="12" sm="6" md="7">
        <v-form ref="form" :disabled="getLoading.profile || getLoading.update">
          <v-row>
            <v-col cols="12" class="pt-0 pb-0">
              <v-container fluid>
                <v-subheader class="px-0 font-weight-bold">Profile</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid class="pt-2 pb-0">
                <v-row justify="start" align="start" dense>
                  <v-col cols="12" sm="4" md="5">
                    <v-text-field
                      @input="handleModified('profile')"
                      :rules="[rules.notNull, rules.letters]"
                      v-model="form.name.firstname"
                      outlined
                      label="Firstname"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="5">
                    <v-text-field
                      @input="handleModified('profile')"
                      v-model="form.name.lastname"
                      :rules="[rules.notNull, rules.letters]"
                      outlined
                      label="Lastname"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="2">
                    <v-text-field
                      @input="handleModified('profile')"
                      v-model="form.name.middle_initial"
                      :rules="[
                        rules.notNull,
                        rules.letters,
                        rules.single_letter,
                      ]"
                      outlined
                      label="Middle Initial"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      @input="handleModified('profile')"
                      v-model="form.name.prefix"
                      :rules="[rules.letters]"
                      outlined
                      label="Prefix"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      @input="handleModified('profile')"
                      v-model="form.name.suffixes"
                      outlined
                      label="Suffixes"
                      hint="comma separated ex: MD,PhD"
                      persistent-hint
                      dense
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-container fluid>
                <v-subheader class="pa-0 mr-0 font-weight-bold"
                  >Department</v-subheader
                >
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid class="pt-2 pb-0">
                <v-row justify="start" align="start" dense>
                  <v-col cols="12" sm="4" md="5">
                    <v-select
                      @input="handleModified('profile')"
                      v-model="form.department.unit_id"
                      :items="getAllUnits"
                      item-text="name"
                      item-value="_id"
                      :rules="[rules.notNull]"
                      outlined
                      label="Unit Name"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="5">
                    <v-select
                      v-model="form.department.role_id"
                      :disabled="true"
                      :items="getAllRoles"
                      item-text="name"
                      item-value="_id"
                      :rules="[rules.notNull]"
                      outlined
                      label="Role/Position"
                      dense
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col cols="12" sm="6" md="5">
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <v-container fluid>
              <v-subheader class="pa-0 mr-0 font-weight-bold">
                Important Information
              </v-subheader>
              <v-divider />
            </v-container>
          </v-col>
          <v-col cols="12">
            <v-container fluid class="pt-2 pb-0">
              <v-row justify="start" align="start" dense>
                <v-col cols="12" sm="6" md="7">
                  <v-text-field
                    v-model="form.email"
                    outlined
                    label="Email"
                    dense
                    disabled
                  />
                </v-col>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field
                    v-model="form.staff_id"
                    disabled
                    :rules="[rules.notNull, rules.numbers, rules.id]"
                    outlined
                    label="ID Number"
                    dense
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0">
            <v-container fluid>
              <v-row justify="start" align="center">
                <v-col cols="6">
                  <v-container fluid class="pa-0">
                    <v-subheader class="pa-0 mr-0 error--text font-weight-bold">
                      Change Password
                    </v-subheader>
                  </v-container>
                </v-col>
                <v-col cols="6" align="end">
                  <v-container>
                    <v-row justify="end">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            :disabled="
                              !edit_mode_password || getLoading.change_password
                            "
                            v-bind="attrs"
                            v-on="on"
                            @click="handleChangePassword"
                            color="primary"
                            small
                            elevation="0"
                          >
                            <v-icon left>mdi-content-save</v-icon>
                            Cofirm
                          </v-btn>
                        </template>
                        <span> Save new password</span>
                      </v-tooltip>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
              <v-divider />
            </v-container>
          </v-col>
          <v-col cols="12">
            <v-container fluid class="py-0">
              <v-form ref="change_password">
                <v-row justify="start" align="start" dense>
                  <v-col cols="12">
                    <v-text-field
                      @input="handleModified('password')"
                      :append-icon="show_pass ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="show_pass = !show_pass"
                      :type="show_pass ? 'text' : 'password'"
                      v-model="password.old"
                      :disabled="getLoading.change_password"
                      :rules="[rules.password[1]]"
                      outlined
                      label="Type your old password"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      @input="handleModified('password')"
                      v-model="password.new_1"
                      :disabled="getLoading.change_password"
                      :rules="[rules.password[1]]"
                      type="password"
                      outlined
                      label="New password"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      @input="handleModified('password')"
                      v-model="password.new_2"
                      :disabled="getLoading.change_password"
                      :rules="[
                        rules.password[0](password.new_1),
                        rules.password[1],
                      ]"
                      type="password"
                      outlined
                      label="Retype new password"
                      dense
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
