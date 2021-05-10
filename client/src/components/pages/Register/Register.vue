<script>
export default {
  name: "Register",
  computed: {
    getUserType() {
      return this.$route.params.user_type;
    },
  },
};
</script>
<template>
  <div>{{ getUserType }} Register Page</div>
</template>
