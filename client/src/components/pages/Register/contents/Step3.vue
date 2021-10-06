<script>
export default {
  name: "Step3",
  props: {
    form: Object,
  },
  data: () => {
    return {
      rules: {
        id: [(v) => v.length === 7 || "ID number must be 7 digits"],
        notNull: [(v) => !!v || "This field is required"],
        letters: [
          (v) => !/\d/gi.test(v) || "Only letters allowed in this field",
        ],
        numbers: [
          (v) => /\d/gi.test(v) || "Only numbers allowed in this field",
        ],
      },
    };
  },
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
    getError() {
      return this.$store.getters["message/getError"];
    },
    getLoading() {
      return this.$store.getters[`${this.getUserType}/getLoading`];
    },
    getAllUnits() {
      return this.$store.getters["unit/getAllUnits"];
    },
    getAllRoles() {
      return this.$store.getters["role/getAllRoles"];
    },
    isUnitandRoleLoading() {
      const { getters } = this.$store;
      return getters["unit/getLoading"] && getters["role/getLoading"];
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate()) {
        return this.getUserType === "faculty"
          ? this.$store.dispatch(`faculty/userRegister`, this.form)
          : this.$store.dispatch(`admin/adminRegister`, this.form);
      }
    },
  },
  created() {
    if (this.getUserType === "faculty") {
      this.$store.dispatch("unit/allUnits");
      this.$store.dispatch("role/allRoles");
    }
  },
};
</script>
<template>
  <v-card class="card-container" outlined v-if="!isUnitandRoleLoading">
    <v-form ref="form" @submit="handleSubmit">
      <v-card-title class="px-0">
        Department Unit/Workstation
      </v-card-title>
      <v-text-field
        :disabled="getLoading.register"
        class="input"
        label="ID Number"
        type="number"
        :rules="[...rules.notNull, ...rules.numbers, ...rules.id]"
        v-model="form.staff_id"
        autofocus
        dense
        outlined
      />
      <v-autocomplete
        v-if="getUserType === 'faculty'"
        :disabled="getLoading.register"
        class="input"
        label="Unit/Department"
        :items="getAllUnits"
        :rules="rules.notNull"
        v-model="form.department.unit_id"
        item-text="name"
        item-value="_id"
        dense
        outlined
      />
      <v-autocomplete
        v-if="getUserType === 'faculty'"
        :disabled="getLoading.register"
        class="input"
        label="Role/Position"
        :items="getAllRoles"
        :rules="rules.notNull"
        v-model="form.department.role_id"
        item-text="name"
        item-value="_id"
        dense
        outlined
      />
      <v-alert class="alert" v-if="getError" dense type="error">
        {{ getError }}
      </v-alert>
      <v-btn
        :disabled="getLoading.register"
        :loading="getLoading.register"
        type="submit"
        color="primary"
        elevation="0"
        medium
      >
        Next
      </v-btn>
    </v-form>
  </v-card>
  <v-card class="card-container" v-else>
    <v-skeleton-loader width="100%" type="article" />
    <v-skeleton-loader width="100%" type="article" />
  </v-card>
</template>
