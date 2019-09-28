<template>
  <div id="controller">
    <IotController pageHeader="Controller" />
  </div>
</template>

<script>
// @ is an alias to /src
import IotController from "@/components/IotController.vue";

export default {
  name: "dashboard",
  components: {
    IotController
  }
};
</script>
