<script>
export default {
  name: "Tokens",
  data: () => ({
    items: ["All", "Claimed", "Unclaimed"],
    desserts: [
      {
        name: "Frozen Yogurt",
        calories: 159,
      },
      {
        name: "Ice cream sandwich",
        calories: 237,
      },
      {
        name: "Eclair",
        calories: 262,
      },
      {
        name: "Cupcake",
        calories: 305,
      },
      {
        name: "Gingerbread",
        calories: 356,
      },
      {
        name: "Jelly bean",
        calories: 375,
      },
      {
        name: "Lollipop",
        calories: 392,
      },
      {
        name: "Honeycomb",
        calories: 408,
      },
      {
        name: "Donut",
        calories: 452,
      },
      {
        name: "KitKat",
        calories: 518,
      },
    ],
  }),
};
</script>
<template>
  <v-container fluid id="#tokens-container">
    <v-row
      justify="start"
      justify-sm="start"
      justify-md="center"
      align-md="start"
      dense
      no-gutters
    >
      <v-col cols="12" sm="12" md="11" align-self="end">
        <v-row justify-md="end" align-md="start">
          <v-col cols="5" sm="5" md="3">
            <v-select :items="items" label="Filter" outlined />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="11">
        <v-simple-table fixed-header height="400px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Calories
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in desserts" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.calories }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>
