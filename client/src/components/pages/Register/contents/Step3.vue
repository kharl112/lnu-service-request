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
        notNull: [(v) => !!v || "This field is required"],
      },
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (this.$refs.form.validate()) return;
    },
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form ref="form" @submit="handleSubmit">
      <v-text-field
        class="input"
        label="ID"
        background-color="#E5E5E5"
        :rules="rules.notNull"
        v-model="form.staff_id"
        autofocus
        outlined
      />
      <v-select
        class="input"
        label="Department"
        :items="departments"
        :rules="rules.notNull"
        v-model="form.department.name"
        autofocus
        outlined
        background-color="#E5E5E5"
      />
      <v-select
        class="input"
        label="Role/Position"
        :items="roles"
        :rules="rules.notNull"
        v-model="form.department.role"
        item-text="role"
        item-value="value"
        outlined
        background-color="#E5E5E5"
      />
      <v-btn type="submit" bottom color="warning" medium>
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
