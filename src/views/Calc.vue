<template>
  <div class="calc d-flex f-center">
    <div class="inner d-flex f-center f-column gap-15">
      <h2 class="calc__title">Конвертация денежных средств</h2>

      <a class="calc__button d-flex f-center" @click="check"
        >Чат с оператором</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Calc",
  components: {},
  methods: {
    check() {
      
    },
  },
};
</script>
<style lang="scss" scoped>
.calc {
  .inner {
    height: calc(100vh - 100px);
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
    padding: 10px 20px 10px 10px;
    background-color: #0088cc;
    position: relative;
    color: #f9f9f9;
    text-decoration: none;
    font-size: 17px;
    border-radius: 4px;
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.4);
    overflow: hidden;
    animation: bouncing 2s ease-in-out 0.5s infinite;
    transition: all 0.3s ease;

    &:hover {
      // box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.6);
      // transform: scale(1.02) !important;
      // animation-play-state: paused;
    }
    &:before {
      background-image: url("../assets/img/telegram-logo-small.png");
      background-size: 20px 20px;
      display: inline-block;
      background-repeat: no-repeat;
      width: 20px;
      height: 20px;
      content: "";
      padding-right: 10px;
    }
    &:after {
      content: "";
      display: block;
      width: 20px;
      height: 200px;
      margin-left: 50px;
      background: rgba(255, 255, 255, 0.603);
      left: -40px;
      top: -100px;
      z-index: 1;
      transform: rotate(30deg);
      position: absolute;
      animation: glaring 5s ease-in-out 0.05s infinite;
    }
  }
}
@keyframes bouncing {
  0% {
    transform: scale(1);
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.4);
  }
  15% {
    transform: scale(1.02);
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.6);
  }
  30% {
    transform: scale(1);
    box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.4);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes glaring {
  0% {
    left: -30px;
    margin-left: 0px;
  }
  30% {
    left: 110%;
    margin-left: 80px;
  }
  100% {
    left: 110%;
    margin-left: 80px;
  }
}
@media screen and (max-width: 320px) {
  .calc__img {
    max-width: 100px;
  }
}
</style>
