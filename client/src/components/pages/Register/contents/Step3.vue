<script>
export default {
  name: "Step3",
  data: () => {
    return {
      departments: ["IT", "ED", "Tourism", "PE"],
      roles: [
        { role: "Member", value: 1 },
        { role: "Chair Person", value: 2 },
        { role: "Head", value: 3 },
      ],
    };
  },
};
</script>
<template>
  <v-card class="card-container" elevation="5">
    <v-form>
      <v-select
        class="input"
        label="Department"
        :items="departments"
        autofocus
        outlined
        background-color="#E5E5E5"
        required
      />
      <v-select
        class="input"
        label="Role/Position"
        :items="roles"
        item-text="role"
        item-value="value"
        outlined
        background-color="#E5E5E5"
        required
      />
      <v-btn type="submit" bottom color="warning" medium>
        Next
      </v-btn>
    </v-form>
  </v-card>
</template>
