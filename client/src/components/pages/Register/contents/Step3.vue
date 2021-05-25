<script>
export default {
  name: "Step3",
  props: {
    form: Object,
  },
  data: () => {
    return {
      departments: ["IT", "ED", "Tourism", "PE"],
      roles: [
        { role: "Member", value: 1 },
        { role: "Chair Person", value: 2 },
        { role: "Head", value: 3 },
      ],
      rules: {
        id: [(v) => v.length === 11 || "id length must be 11 characters"],
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
    getError() {
      return this.$store.getters["message/getError"];
    },
    getLoading() {
      return this.$store.getters["faculty/getLoading"];
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate()) {
        return this.$store.dispatch("faculty/userRegister", this.form);
      }
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form ref="form" @submit="handleSubmit">
      <v-text-field
        :disabled="getLoading.register"
        class="input"
        label="ID"
        background-color="#E5E5E5"
        type="number"
        :rules="[...rules.notNull, ...rules.numbers, ...rules.id]"
        v-model="form.staff_id"
        autofocus
        outlined
      />
      <v-select
        :disabled="getLoading.register"
        class="input"
        label="Department"
        :items="departments"
        :rules="[...rules.notNull, ...rules.letters]"
        v-model="form.department.unit_name"
        outlined
        background-color="#E5E5E5"
      />
      <v-select
        :disabled="getLoading.register"
        class="input"
        label="Role/Position"
        :items="roles"
        :rules="rules.notNull"
        v-model="form.department.unit_role"
        item-text="role"
        item-value="value"
        outlined
        background-color="#E5E5E5"
      />
      <v-alert class="alert" v-if="getError" dense type="error">
        {{ getError }}
      </v-alert>
      <v-btn
        :disabled="getLoading.register"
        type="submit"
        bottom
        color="warning"
        medium
      >
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
