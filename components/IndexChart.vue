<template>
  <div>
    <chart :options="echartOptions" class="echarts" />
  </div>
</template>
<script>
const moment = require("moment");
import echarts from "echarts";
export default {
  props: ["service_id", "index_id", "from", "to"],
  data() {
    return {
      datas: []
    };
  },
  methods: {
    async LoadData() {
      let { data } = await this.$axios.get(
        `/api/services/${this.service_id}/indexs/${this.index_id}/logs?from=${this.from}&to=${this.to}`
      );
      this.datas = data;
    }
  },
  mounted() {
    this.LoadData();
  },
  watch: {
    routeKey() {
      this.LoadData();
    }
  },
  computed: {
    xData() {
      return this.aggregateData.map(e =>
        moment.unix(e.time).format("YYYY-MM-DD HH:mm:ss")
      );
    },
    yData() {
      return this.aggregateData.map(e => e.value);
    },
    echartOptions() {
      return {
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          }
        },
        title: {
          left: "center",
          text: ""
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.xData
        },
        yAxis: {
          type: "value",
          boundaryGap: true
        },

        series: [
          {
            name: "一小时走势图",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(255, 70, 131)"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)"
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)"
                }
              ])
            },
            data: this.yData
          }
        ]
      };
    },
    routeKey() {
      return [this.service_id, this.from, this.to, this.index_id].join(",");
    },
    unExistIds() {
      let a = new Set();
      for (let b of Object.getOwnPropertyNames(this.serviceMap)) {
        a.add(b);
      }
      let ret = new Set();
      for (let b of this.datas) {
        if (a.has(String(b.caller_service_id)) === false) {
          ret.add(b.caller_service_id);
        }
        if (a.has(String(b.callee_service_id)) === false) {
          ret.add(b.callee_service_id);
        }
      }
      return [...ret];
    },
    aggregateData() {
      function GetKey(data) {
        return [data.time].join(",");
      }
      let map = {};
      for (let data of this.datas) {
        if (map[GetKey(data)]) {
          map[GetKey(data)].count = map[GetKey(data)].count + data.count;
        } else {
          map[GetKey(data)] = data;
        }
      }
      let ret = [];
      for (let key of Object.getOwnPropertyNames(map)) {
        ret.push(map[key]);
      }
      return ret;
    }
  }
};
</script>
<style scoped>
.fly-right {
  position: fixed;
  right: 50px;
}
.echarts {
  width: 500px;
  height: 450px;
  background-color: white;
}
</style>