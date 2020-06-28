  <template>
  <div class="container">
    <h2>服务 {{service.name}} 当前状态码</h2>
    <el-form>
      <el-form-item label="调用方">
        <el-radio-group v-model="type">
          <el-radio label="as_callee" border size="small">被调</el-radio>
          <el-radio label="as_caller" border size="small">主调</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上报方">
        <el-radio-group v-model="is_client_report">
          <el-radio :label="false" border size="small">服务端上报</el-radio>
          <el-radio :label="true" border size="small">客户端上报</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <StatusCodeTable
      :service_id="service_id"
      :type="type"
      :from="from"
      :to="to"
      :is_client_report="is_client_report"
    />
  </div>
</template>
<script>
import StatusCodeTable from "~/components/StatusCodeTable";
export default {
  components: {
    StatusCodeTable
  },
  data() {
    return {
      tableData: [],
      type: "as_callee",
      is_client_report: false,
      service: {},
      from: 0,
      to: 0
    };
  },
  mounted() {
    this.LoadData();
    //let time = Math.floor(Date.now() / 1000 / 60) * 60;
    let time = 1591445880;
    this.from = time;
    this.to = time;
  },
  methods: {
    async LoadData() {
      let { data } = await this.$axios.get("/api/services/" + this.service_id);
      this.service = data;
    }
  },
  computed: {
    service_id() {
      return this.$route.query.service_id;
    },
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
</style>