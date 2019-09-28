<template>
  <div class="facDashboard">
    <h3>{{ pageHeader }}</h3>
    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later ssss</p>
    </section>
    <section v-else>
      <div v-if="loading">
        <h5>Loading...</h5>
      </div>
      <!-- <div v-else>
        <div v-for="fac in facilityList" v-bind:key="fac.facId">
          <button :class="statusColor(fac)">{{ fac.facId }} {{ fac.facCode}}</button>
          <span>&nbsp;</span>
        </div>
      </div>-->
    </section>
    <button class="button is-primary" @click="sendDataToWebsocket(message)" style="width:100px">Send</button>
    <button class="button is-primary" @click="getFacListWithStatus(today)" style="width:100px">today</button>
    <button
      class="button is-danger"
      @click="getFacListWithStatus(tomorrow)"
      style="width:100px"
    >tomorrow</button>
    <grid-layout
      :layout.sync="layout"
      :col-num="columns"
      :row-height="rows"
      :responsive="false"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="false"
      :margin="[90, 10]"
      :use-css-transforms="true"
      :autoSize="false"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :static="true"
        :key="item.i"
        :style="statusColor(item)"
      >
        <!-- <button :class="statusColor(item)" style="width:50%;height:100%">{{ item.facId }} {{ item.facCode}}</button> -->
        {{item.code}}
      </grid-item>
    </grid-layout>
  </div>
</template>


<script src="/socket.io/socket.io.js"></script>
<script>
require("dotenv").config();
import env from "../../env";
import axios from "axios";
import io from "socket.io-client";
// import WebSocket from "vue-native-websocket";
import Moment from "moment";
import { async } from "q";
import VueGridLayout from "vue-grid-layout";
const URL = [
  "http://localhost:9000", //0
  "http://18.139.12.132:9000", //1
  "ws://localhost:9001", //2
  "ws://18.139.12.132:9001" //3
];
const socketioURL = URL[0];
const websocketURL = URL[2];
const getUnavailableFacListAPI = `${socketioURL}/facility/all/status`;

var co = require("../co-working-space.json");

export default {
  name: "FacilityDashboard",
  props: {
    pageHeader: String
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      name: "facDashboard",
      socket: io(socketioURL),
      // ws: new WebSocket(websocketURL),
      loading: true,
      errored: false,
      message: "success",
      facilityList: [],

      layout: [],
      columns: 33,
      rows: 30,
      today: "2019-11-10",
      tomorrow: "2019-11-11"
    };
  },
  async created() {
    this.socket.on("test_connection", response => {
      console.log(response);
    });
    this.loading = true;
    this.initGridLayout();
    await this.getFacListWithStatus(this.today);
    // await this.assignDataToGridLayout();
  },
  mounted() {
    // this.$socket.on("message", response => {
    //   console.log("55555: " + response);
    // });

    this.$options.sockets.onmessage = data => console.log(data.data);
    this.socket.on("reservation_trigger", response => {
      console.log("socket.io: " + response);
      this.getFacListWithStatus(this.today);
    });
  },
  methods: {
    statusColor(facility) {
      const addition = [
        {
          color: "#fff",
          border: "1px solid transparent",
          display: "inline-flex",
          cursor: "pointer",
          "font-size": "10px",
          "border-color": "transparent",
          "justify-content": "center",
          "text-align": "center",
          "align-items": "center",
          "border-radius": "4px",
          hover: "background: yellow"
        }
      ];
      if (facility.status == "available") {
        return ["grid-item", { "background-color": "#88d100" }].concat(
          addition
        );
      } else if (facility.status == "unavailable") {
        return ["grid-item", { "background-color": "#D1001F" }].concat(
          addition
        );
      } else {
        return ["grid-item", { "background-color": "#4CAF50" }].concat(
          addition
        );
      }
    },
    changeStyle(item) {
      return ["width: " + item.w + "px", "height: " + item.h];
    },
    sendDataToWebsocket(message) {
      this.$socket.send(message);
    },
    getFacListWithStatus(date) {
      this.loading = true;
      this.facilityList = [];
      return axios
        .post(getUnavailableFacListAPI, {
          startTime: "08:00:00",
          startDate: date,
          endTime: "09:00:00",
          endDate: date
        })
        .then(response => {
          this.facilityList = response.data;
          this.assignDataToGridLayout();
          // console.log(this.facilityList);
        });
    },
    assignDataToGridLayout() {
      for (var i = 0; i < this.facilityList.length; i++) {
        this.layout[i] = Object.assign(this.layout[i], this.facilityList[i]);
      }
      // console.log(this.layout);
      this.loading = false;
      return this.layout;
    },
    initGridLayout() {
      var runI = 1;
      var x = 0;
      var y = co.size.ml.h;
      //  Meet S
      for (let i = 1; i <= co.amount.ms; i++) {
        let w = co.size.ms.w;
        let h = co.size.ms.h;
        let x = this.columns - w;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        y = y + h;
        runI++;
      }
      y = co.size.sm.h;
      //  Meet M
      for (let i = 1; i <= co.amount.mm; i++) {
        let w = co.size.mm.w;
        let h = co.size.mm.h;
        let x = 0;
        this.layout.push({ x: 0, y: y, w: w, h: h, i: runI + "" });
        y = y + h;
        runI++;
      }
      y = 0;
      //  Meet L
      for (let i = 1; i <= co.amount.ml; i++) {
        let w = co.size.ml.w;
        let h = co.size.ml.h;
        let x = this.columns - w;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        runI++;
      }
      y = 0;
      //  Seminar
      for (let i = 1; i <= co.amount.sm; i++) {
        let w = co.size.sm.w;
        let h = co.size.sm.h;
        let x = 0;
        this.layout.push({ x: x, y: 0, w: w, h: h, i: runI + "" });
        runI++;
      }
      x = 10;
      y = co.size.ml.h + co.size.ms.h * 2;
      //  Normalseat Center Up
      for (let i = 1; i <= co.amount.nsc / 2; i++) {
        let w = co.size.nsc.w;
        let h = co.size.nsc.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        x = x + co.size.nsc.w;
        runI++;
      }
      x = 11;
      y = y + co.size.nsc.h;
      // y = this.rows - co.size.garden.h - co.size.nsb.h;
      //  Normalseat Center Down
      for (let i = 1; i <= co.amount.nsc / 2; i++) {
        let w = co.size.nsc.w;
        let h = co.size.nsc.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        x = x + w;
        runI++;
      }
      x = co.size.mm.w;
      y = 11;
      //  Normalseat Longbar
      for (let i = 1; i <= co.amount.nsb; i++) {
        let w = co.size.nsb.w;
        let h = co.size.nsb.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        x = x + w;
        runI++;
      }
      x = 16;
      y = 0;
      //  Sofa Single Left
      for (let i = 1; i <= co.amount.sfs / 2; i++) {
        let w = co.size.sfs.w;
        let h = co.size.sfs.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        y = y + h;
        runI++;
      }
      x = x + co.size.sfs.w;
      y = 1;
      //  Sofa Single Right
      for (let i = 1; i <= co.amount.sfs / 2; i++) {
        let w = co.size.sfs.w;
        let h = co.size.sfs.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        y = y + h;
        runI++;
      }
      x = 14;
      y = y + 1;
      //  Sofa Twin Left
      for (let i = 1; i <= 2; i++) {
        let w = co.size.sft.w;
        let h = co.size.sft.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        y = y + h;
        runI++;
      }
      x = x + co.size.sft.w + 1;
      y = 5;
      //  Sofa Twin Right
      for (let i = 1; i <= 1; i++) {
        let w = co.size.sft.w;
        let h = co.size.sft.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: runI + "" });
        y = y + h;
        runI++;
      }
      x = 14 + co.size.sft.w;
      y = 5;
      //  |
      for (let i = 1; i <= 1; i++) {
        let w = 1;
        let h = 2;
        this.layout.push({ x: x, y: y, w: w, h: h, i: "|" });
        runI++;
      }
      x = this.columns - co.size.garden.w;
      y = 12;
      //  Garden
      for (let i = 1; i <= 1; i++) {
        let w = co.size.garden.w;
        let h = co.size.garden.h;
        this.layout.push({ x: x, y: y, w: w, h: h, i: "Garden" });
        runI++;
      }
      // console.log(this.layout);
    }
  }
};
</script>
<style scoped>
b-table {
  color: darkgreen;
}
a {
  background-color: aqua;
  font-size: x-large;
  border-color: black;
}
/* grid-item {
  background-color: aqua;
  font-size: x-large;
} */
</style>