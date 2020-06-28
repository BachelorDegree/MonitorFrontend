<template>
  <div class="container">
    <el-table :data="formattedData" style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="cpu" label="CPU"></el-table-column>
      <el-table-column prop="avg_load" label="负载"></el-table-column>
      <el-table-column prop="mem_usage" label="内存状态"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.LoadData();
  },
  methods: {
    async LoadData() {
      let { data } = await this.$axios.get("/api/machines");
      this.tableData = data;
    }
  },
  computed: {
    formattedData() {
      return this.tableData.map(e => {
        let a = {};
        Object.assign(a, e);
        try {
          a.avg_load = a.avg_load
            .split(" ")
            .slice(0, 3)
            .join(" ");
        } catch (e) {}
        try {
          let mem_info = {};
          let tmp = a.mem_usage.split("\n");
          for (let b of tmp) {
            b = b.split(" ").join("");
            b = b.split(":");
            mem_info[b[0]] = b[1];
          }
          a.mem_usage = mem_info.MemFree + " / " + mem_info.MemTotal;
        } catch (e) {}
        return a;
      });
    }
  }
};
</script>
<style scoped>
.container {
  max-width: 1050px;
  margin: 0 auto;
}
</style>