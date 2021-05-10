<script>
export default {
  name: "Login",
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
  },
};
</script>
<template>
  <div>{{ getUserType }} Login Page</div>
</template>
