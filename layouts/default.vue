<template>
  <el-container class="main-container">
    <el-header style="padding: 0;">
      <top-header />
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
  </el-container>
</template>
<script>
import Header from "~/components/Header";
import { mapState } from "vuex";
export default {
  components: {
    "top-header": Header
  },
  watch: {},
  async mounted() {}
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
body {
  min-width: 700px;
}
.container {
  max-width: 1050px;
  margin: 0 auto;
}
</style>
