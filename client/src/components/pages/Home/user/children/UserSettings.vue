<script>
export default {
  name: "UserSettings",
  data: () => ({
    form: null,
    edit_mode: false,
    unit_roles: [
      { role: "Unit Member/Personnel", value: 1 },
      { role: "Unit Head", value: 2 },
      { role: "Others", value: 3 },
    ],
    rules: {
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
  },
  methods: {
    resetForm(edit_mode = false) {
      this.edit_mode = edit_mode;
      return (this.form = JSON.parse(JSON.stringify(this.getProfile)));
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        return this.$store.dispatch("faculty/userUpdate", this.form);
      }
    },
  },
  created() {
    this.resetForm();
  },
};
</script>
<template>
  <v-container fluid class="pa-3">
    <v-row justify="start" align="start">
      <v-col cols="12" sm="12" md="8">
        <v-form ref="form" :disabled="getLoading.profile || getLoading.update">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-container fluid>
                <v-row justify="start" align="center">
                  <v-col cols="6">
                    <v-container>
                      <h4 class="text-body2 text-sm-h6 text-md-h5">
                        User Settings
                      </h4>
                    </v-container>
                  </v-col>
                  <v-col cols="6" align="end">
                    <v-container>
                      <v-row justify="end">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              class="mr-4"
                              v-bind="attrs"
                              v-on="on"
                              @click="resetForm(!edit_mode)"
                              :color="edit_mode ? 'error' : 'primary'"
                            >
                              <v-icon size="30">{{
                                edit_mode ? "mdi-pencil-off" : "mdi-pencil"
                              }}</v-icon>
                            </v-btn>
                          </template>
                          <span>{{
                            edit_mode ? "disable edit mode" : "enable edit mode"
                          }}</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-show="edit_mode"
                              v-bind="attrs"
                              v-on="on"
                              icon
                              class="mr-4"
                              color="primary"
                              @click="handleSubmit()"
                            >
                              <v-icon size="30">mdi-update</v-icon>
                            </v-btn>
                          </template>
                          <span> Save changes</span>
                        </v-tooltip>
                      </v-row>
                    </v-container>
                  </v-col>
                </v-row>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-container fluid>
                <v-subheader>Name</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid class="pt-2 pb-0">
                <v-row justify="start" align="start" dense>
                  <v-col cols="12" sm="4" md="5">
                    <v-text-field
                      :disabled="!edit_mode"
                      :rules="[rules.notNull, rules.letters]"
                      v-model="form.name.firstname"
                      outlined
                      label="Firstname"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="5">
                    <v-text-field
                      v-model="form.name.lastname"
                      :disabled="!edit_mode"
                      :rules="[rules.notNull, rules.letters]"
                      outlined
                      label="Lastname"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="2">
                    <v-text-field
                      v-model="form.name.middle_initial"
                      :disabled="!edit_mode"
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
                      v-model="form.name.prefix"
                      :disabled="!edit_mode"
                      :rules="[rules.letters]"
                      outlined
                      label="Prefix"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      v-model="form.name.suffixes"
                      :disabled="!edit_mode"
                      outlined
                      label="Suffixes"
                      hint="comma separated ex: MD,PhD"
                      persistent-hint
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="form.staff_id"
                      :disabled="!edit_mode"
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
                <v-subheader>Department</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid class="pt-2 pb-0">
                <v-row justify="start" align="start" dense>
                  <v-col cols="12" sm="4" md="5">
                    <v-text-field
                      v-model="form.department.unit_name"
                      :disabled="!edit_mode"
                      :rules="[rules.notNull, rules.letters]"
                      outlined
                      label="Unit Name"
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="5">
                    <v-select
                      v-model="form.department.unit_role"
                      :items="unit_roles"
                      :disabled="!edit_mode"
                      :rules="[rules.notNull, rules.numbers]"
                      item-text="role"
                      item-value="value"
                      outlined
                      label="Role/Position"
                      dense
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-container fluid>
                <v-subheader>Contact Information</v-subheader>
                <v-divider />
              </v-container>
            </v-col>
            <v-col cols="12">
              <v-container fluid class="pt-2 pb-0">
                <v-row justify="start" align="start" dense>
                  <v-col cols="12" sm="4" md="5">
                    <v-text-field
                      v-model="form.email"
                      outlined
                      label="Email"
                      dense
                      disabled
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-divider class="hidden-sm-and-down" vertical />
      <v-col sm="2" md="4" class="hidden-sm-and-down"> </v-col>
    </v-row>
  </v-container>
</template>
