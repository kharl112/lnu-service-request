<script>
import fileDownload from "js-file-download";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      form: {
        subject: "",
        body: "",
      },
      options: {
        format: "A4",
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
    handleGetPDF(e) {
      e.preventDefault();
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
  <div id="app">
    <form @submit="handleGetPDF">
      <label>Subject</label>
      <input type="text" v-model="form.subject" />
      <label>Body</label>
      <textarea type="text" v-model="form.body" rows="7"/>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  form {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    label{
      text-align: left;
      margin: 15px 0px 2px;
    }
    button {
      margin: 5px 0px;
    }
  }
}
</style>
