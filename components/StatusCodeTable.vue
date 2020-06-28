<template>
  <div>
    <el-table
      :data="formattedData"
      style="width: 100%"
      @cell-mouse-enter="onCellMouseEnter"
      @cell-mouse-leave="onCellMouseLeave"
    >
      <el-table-column prop="caller_service" label="主调方" width="200"></el-table-column>
      <el-table-column prop="callee_service" label="被调方"></el-table-column>
      <el-table-column prop="status_code" label="状态码" width="100"></el-table-column>
      <el-table-column prop="direction" label="上报方"></el-table-column>
      <el-table-column prop="report_machine_id" label="上报服务器"></el-table-column>
      <el-table-column prop="count" label="计数"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
    </el-table>
    <div class="fly-right" ref="echart">
      <chart :options="echartOptions" v-show="showSingle" class="echarts" />
    </div>
  </div>
</template>
<script>
const moment = require("moment");
import echarts from "echarts";
export default {
  props: ["service_id", "type", "from", "to", "is_client_report"],
  data() {
    return {
      datas: [],
      serviceMap: {},
      singleDatas: [],
      singleParams: {
        callee_service_id: 0,
        caller_service_id: 0,
        is_client_report: false,
        report_machine_id: 1,
        status_code: 1
      },
      showSingle: false,
      singleY: 0
    };
  },
  methods: {
    updateMap() {
      for (let id of this.unExistIds) {
        this.updateOne(id);
      }
    },
    async updateOne(service_id) {
      let { data } = await this.$axios.get("/api/services/" + service_id);
      if (data.name === "") {
        data.name = "未指定";
      }
      this.$set(this.serviceMap, String(data.id), data.name);
    },
    async LoadData() {
      let { data } = await this.$axios.get(
        `/api/services/${this.service_id}/status_codes/${this.type}?is_client_report=${this.is_client_report}&from=${this.from}&to=${this.to}`
      );
      this.datas = data;
      this.singleDatas = JSON.parse(JSON.stringify(data));
      this.$nextTick(() => {
        this.updateMap();
      });
    },
    async LoadSingleData() {
      let { data } = await this.$axios.get(
        `/api/services/${this.service_id}/status_codes/${
          this.type
        }?is_client_report=${
          this.singleParams.is_client_report
        }&callee_service_id=${
          this.singleParams.callee_service_id
        }&caller_service_id=${
          this.singleParams.caller_service_id
        }&report_machine_id=${
          this.singleParams.report_machine_id
        }&status_code=${this.singleParams.status_code}&from=${
          this.from
        }&to=${this.from + 3600}`
      );
      this.singleDatas = data;
    },
    onCellMouseEnter(row, column, cell, event) {
      console.log(event);
      this.$set(this.singleParams, "is_client_report", row.is_client_report);
      this.$set(this.singleParams, "callee_service_id", row.callee_service_id);
      this.$set(this.singleParams, "caller_service_id", row.caller_service_id);
      this.$set(this.singleParams, "report_machine_id", row.report_machine_id);
      this.$set(this.singleParams, "status_code", row.status_code);
      this.singleY = event.clientY;
      this.showSingle = true;
    },
    onCellMouseLeave(row, column, cell, event) {
      this.showSingle = false;
    }
  },
  mounted() {
    //this.LoadData();
  },
  watch: {
    routeKey() {
      this.LoadData();
    },
    singleRouteKey() {
      this.LoadSingleData();
    },
    singleY() {
      this.$refs.echart.style.top = this.singleY - 200 + "px";
    }
  },
  computed: {
    singleRouteKey() {
      return [
        this.singleParams.is_client_report,
        this.singleParams.callee_service_id,
        this.singleParams.caller_service_id,
        this.singleParams.report_machine_id,
        this.singleParams.status_code
      ].join(",");
    },
    xData() {
      return this.aggregateSingleData.map(e =>
        moment.unix(e.time).format("YYYY-MM-DD HH:mm:ss")
      );
    },
    yData() {
      return this.aggregateSingleData.map(e => e.count);
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
      return [
        this.service_id,
        this.type,
        this.from,
        this.to,
        this.is_client_report
      ].join(",");
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

    formattedData() {
      let ret = [];
      for (let data of this.aggregateData) {
        let a = {};
        Object.assign(a, data);
        a.time = moment.unix(a.time).format("YYYY-MM-DD HH:mm:ss");
        a.caller_service = a.caller_service_id;
        if (this.serviceMap[a.caller_service_id]) {
          a.caller_service = this.serviceMap[a.caller_service_id];
        }
        a.callee_service = a.callee_service_id;
        if (this.serviceMap[a.callee_service_id]) {
          a.callee_service = this.serviceMap[a.callee_service_id];
        }
        a.direction = a.is_client_report ? "客户端" : "服务端";
        ret.push(a);
      }
      console.log(ret);
      return ret;
    },
    aggregateSingleData() {
      function GetKey(data) {
        return [
          data.status_code,
          data.caller_service_id,
          data.callee_service_id,
          data.is_client_report,
          data.time,
          data.report_machine_id
        ].join(",");
      }
      let map = {};
      for (let data of this.singleDatas) {
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
    },
    aggregateData() {
      function GetKey(data) {
        return [
          data.status_code,
          data.caller_service_id,
          data.callee_service_id,
          data.is_client_report,
          data.time,
          data.report_machine_id
        ].join(",");
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
  width: 600px;
  height: 450px;
  background-color: white;
}
</style>