<script>
import fileDownload from "js-file-download";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      form: {
        subject: "That was intense",
        body: "Ive been figuring this out from a long time.",
      },
      options: {
        format: "Letter",
        orientation: "portrait",
        border: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
        },
      },
    };
  },
  methods: {
    handleGetPDF() {
      const { form, options } = this;
      axios
        .post("api/pdf/create", { form, options }, { responseType: "blob" })
        .then((res) => {
          fileDownload(res.data, "response.pdf");
        });
    },
  },
  created() {
    this.handleGetPDF();
  },
};
</script>

<template>
  <div id="app"></div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
