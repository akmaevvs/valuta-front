<template>
  <div class="calc d-flex f-center">
    <div class="inner d-flex f-center f-column gap-15">
      <h2 class="calc__title">Конвертация денежных средств</h2>
      <a class="calc__button" @click="check"> Обменять </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calc",
  components: {},
  methods: {
    check() {},
  },
};
</script>
<style lang="scss" scoped>
.calc {
  .inner {
    height: calc(100vh - 200px);
    justify-content: space-between;
  }
  &__title {
    color: #333;
    margin-top: 20px;
    font-size: 25px;
    font-weight: 700;
  }
  &__button {
    margin: 10px 0 30px 0;
    padding: 0px 20px 0px 20px;
    background-color: #0088cc;
    position: relative;
    min-height: 40px;
    color: #f9f9f9;
    text-decoration: none;
    font-size: 17px;
    border-radius: 4px;
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.6);
      transform: scale(1.02);
    }
  }
}
</style>
