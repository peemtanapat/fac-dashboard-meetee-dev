<template>
  <div></div>
  <!--  <div class="box">
    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later ssss</p>
    </section>
    <section v-else>
      <div v-if="loading">
        <h1>Loading...</h1>
      </div>
       <div
        v-else
        v-for="facility in facilityList"
        :key="facility.id"
      >{{ facility.id }} {{ facility.code }} {{ facility.status }}</div>
      <br />
      <div v-else>
        <b-table hover :items="facilityList" :tbody-tr-class="rowClass"></b-table>
      </div>
    </section>
  </div>-->
</template>

<script src="/socket.io/socket.io.js"></script>
<script>
import Vue from "vue";
import axios from "axios";
import io from "socket.io-client";

// const socket = require("socket.io-client")("http://localhost:9000", {
//   secure: true,
//   reconnect: true,
//   rejectUnauthorized: false
// });
// import { async } from "q";

const getUnavailableFacListAPI = `http://localhost:9000/check/unavailable/all`;

// new Vue({
//   sockets: {
//       connect: function () {
//           console.log('socket connected')
//       }
//   }}),
export default {
  name: "Facility",
  props: {
    msg: String
  },

  data() {
    return {
      socket: io("localhost:9000"),
      facilityList: [],
      loading: true,
      errored: false
    };
  },
  async created() {
    this.loading = true;
    await this.getFacListWithStatus();
    console.log(this.facilityList);
  },
  mounted() {
    this.socket.on("reservation_trigger", response => {
      console.log(response);
      this.getFacListWithStatus();
    });
  },
  methods: {
    getFacListWithStatus() {
      return axios
        .post(getUnavailableFacListAPI, {
          type: 1,
          startTime: "08:00:00",
          startDate: "November 10, 2019",
          endTime: "09:00:00",
          endDate: "November 10, 2019"
        })
        .then(response => {
          this.facilityList = response.data;
        })
        .finally(() => (this.loading = false));
    },
    rowClass(item) {
      if (item.status == "available") {
        return "table-success";
      } else if (item.status == "unavailable") {
        return "table-danger";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
