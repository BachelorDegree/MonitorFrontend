<template>
  <div class="container">
    <el-table :data="formattedData" style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="desc" label="描述"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看状态码" placement="top">
            <el-button
              type="success"
              icon="el-icon-view"
              class="icon-button"
              @click="goToStatus(scope.row.id)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看自定义指标" placement="top">
            <el-button
              type="warning"
              icon="el-icon-lightning"
              class="icon-button"
              @click="goToIndex(scope.row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
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
      let { data } = await this.$axios.get("/api/services");
      this.tableData = data.filter(e => e.name !== "");
    },
    goToStatus(id) {
      this.$router.push("/services/status_code?service_id=" + id);
    },
    goToIndex(id) {
      this.$router.push("/services/indices?service_id=" + id);
    }
  },
  computed: {
    formattedData() {
      return this.tableData.map(e => {
        let a = {};
        Object.assign(a, e);
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
.icon-button {
  padding: 4px 4px;
  margin: 0;
}
</style>