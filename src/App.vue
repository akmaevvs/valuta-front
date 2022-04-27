<template>
  <header-comp />
  <router-view />
  <footer-comp />
</template>

<script>
import HeaderComp from "@/components/header-comp.vue";
import FooterComp from "@/components/footer-comp.vue";

export default {
  name: "App",
  components: {
    HeaderComp,
    FooterComp,
  },
};
</script>

<style lang="scss">
.inner {
  width: 100%;
  max-width: 1000px;
  padding: 0 15px;
}
</style>
