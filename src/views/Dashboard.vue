<template>
  <div id="facDashboard">
    <FacilityDashboard pageHeader="SEAT MAP DEMO" />
  </div>
</template>

<script>
// @ is an alias to /src
import FacilityDashboard from "@/components/FacilityDashboard.vue";

export default {
  name: 'dashboard',
  components: {
    FacilityDashboard
  }
};
</script>
