<template>
  <div>
    <h1>{{ pageHeader }}</h1>
  </div>
</template>

<script>
// const mqtt = require("mqtt");
// const CronJob = require("cron").CronJob;
// // const host = "mqtt://20.191.141.209:1883";
// // const host = "ws://localhost:9001";
// const clientId = "peem-laptop";
// const ceilingTopic = "kiddi";
// var client  = mqtt.connect('mqtt://20.191.141.209',{clientId:'iot-sit-laptop'})

// const client = mqtt.connect(host, {
//   clientId: clientId
// });

export default {
  name: "IotController",
  props: {
    pageHeader: String
  },
  data() {
    return {
      client: "",
      onHour: "17",
      onMinute: "45",
      offHour: "17",
      offMinute: "50"
    };
  },
  async created() {
    // console.log(host, clientId);
    // this.client = mqtt.connect(host, {
    //   clientId: clientId
    // });
  },
  mounted() {
    // this.client.on("connect", function() {
    //   this.client.subscribe("initial", function(err) {
    //     if (!err) {
    //       console.log(clientId + "...is initialled");
    //       this.client.publish("initial", "Hello mqtt");
    //     } else {
    //       console.log("Initial error: " + err.message);
    //     }
    //   });
    // });
    // this.setCronJobTimeForDailyDay(this.onHour, this.onMinute, this.client);
  },
  methods: {
    // setCronJobTimeForDailyDay(hour, minute, client) {
    //   const schedule = `0 ${minute} ${hour} * * *`;
    //   console.log("schedule: " + schedule);
    //   new CronJob(schedule, () => {
    //     client.publish(ceilingTopic, "CronJob work!", err => {
    //       if (!err) {
    //         console.log("Node-client has sent successfully");
    //       } else {
    //         console.log("error2: " + err.message);
    //       }
    //     });
    //   });
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>