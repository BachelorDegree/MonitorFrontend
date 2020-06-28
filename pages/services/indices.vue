  <template>
  <div class="container">
    <h2>服务 {{service.name}} 当前自定义指标</h2>
    <div class="sub-container" style="margin-top: 10px;">
      <div v-for="index of indexs" :key="index.id" class="item">
        <h4 style="text-align:center;">{{index.name}}</h4>
        <IndexChart :service_id="service_id" :index_id="index.id" :from="from" :to="to" />
      </div>
    </div>
  </div>
</template>
<script>
import IndexChart from "~/components/IndexChart";
export default {
  components: {
    IndexChart
  },
  data() {
    return {
      service: {},
      from: 0,
      to: 0,
      indexs: []
    };
  },
  mounted() {
    //let time = Math.floor(Date.now() / 1000 / 60) * 60;
    let time = 1591445880;
    this.from = time;
    this.to = time + 3600;
    this.LoadData();
    this.LoadIndices();
  },
  methods: {
    async LoadData() {
      let { data } = await this.$axios.get("/api/services/" + this.service_id);
      this.service = data;
    },
    async LoadIndices() {
      let { data } = await this.$axios.get(
        "/api/services/" + this.service_id + "/indexs"
      );
      this.indexs = data;
    }
  },
  computed: {
    service_id() {
      return this.$route.query.service_id;
    }
  }
};
</script>
<style scoped>
.sub-container {
  display: flex;
  flex-flow: row wrap;
}
.container {
  max-width: 1050px;
  margin: 0 auto;
}
</style>