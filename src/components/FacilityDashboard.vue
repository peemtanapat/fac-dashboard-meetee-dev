<template>
  <div class="facDashboard">
    <h1>{{ pageHeader }}</h1>
    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later ssss</p>
    </section>
    <section v-else>
      <div v-if="loading">
        <h1>Loading...</h1>
      </div>
      <!-- <div
        v-else
        v-for="facility in facilityList"
        :key="facility.id"
      >{{ facility.id }} {{ facility.code }} {{ facility.status }}</div>
      <br />-->
      <div v-else>
        <b-table hover :items="facilityList" :tbody-tr-class="rowClass"></b-table>
      </div>
    </section>
  </div>
</template>

<script src="/socket.io/socket.io.js"></script>
<script>
import axios from "axios";
import io from "socket.io-client";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { async } from "q";

const moment = extendMoment(Moment);

const classId = 1;
const getFacListAPI = `http://localhost:9000/fac/class/${classId}`;
const getUnavailableFacListAPI = `http://localhost:9000/check/unavailable/all`;
const statusObj = {
  status: "available"
};

export default {
  name: "FacilityDashboard",
  props: {
    pageHeader: String
  },
  data() {
    return {
      loading: true,
      errored: false,
      facilityList: [],
      name: "facDashboard",
      socket: io("localhost:9000"),
      username: "peemtanapat",
      message: "Hello from the outside.",
      messages: [],
      s_time: "2019-11-10T09:00:00+07:00",
      e_time: "2019-11-10T12:00:00+07:00"
    };
  },
  async created() {
    this.loading = true;
    await this.getFacListWithStatus();
  },
  mounted() {
    this.socket.on("reservation_trigger", response => {
      this.getFacListWithStatus();
    });
  },
  methods: {
    rowClass(item) {
      if (item.status == "available") {
        return "table-success";
      } else if (item.status == "unavailable") {
        return "table-danger";
      }
    },
    sendMessage(m) {
      m.preventDefault();
      this.socket.emit("SEND_MESSAGE_FROM_VUE", {
        username: this.username,
        message: this.message
      });
      this.message = "";
    },
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
    }
  }
};
</script>
<style scoped>
b-table {
  color: darkgreen;
}
</style>