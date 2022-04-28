<template>
  <footer class="footer d-flex f-center">
    <div class="inner d-flex f-btwn">
      <span class="footer__title">valuta</span>
      <a class="footer__contact d-flex f-center" href="https://t.me/morismoss">@morismoss</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "footer-comp",
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.footer {
  background-color: #ebebeb;
  height: 50px;
  width: 100%;
  bottom: 0;
  position: fixed;
  bottom: 0;
  z-index: 7;
  color: #333;
  &__contact {
    color: #08c;
    text-decoration: none;
  }
}
</style>
