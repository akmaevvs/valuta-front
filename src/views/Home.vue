<template>
  <div class="home d-flex f-center">
    <div class="inner d-flex f-center f-column gap-15">
      <h2 class="home__title">Конвертация денежных средств</h2>
      <img class="home__img" alt="" src="@/assets/img/exchange.png" />
      <ul class="info d-flex f-column gap-15">
        <li class="info__state">
          Наличные рубли и доллары. Bitcoin, USDT, ETH, DAI
        </li>
        <li class="info__state">
          Выводы на карты Сбербанк, Тинькофф, Альфа-банк
        </li>
        <li class="info__state">Юридические консультации</li>
      </ul>
      <a class="home__button d-flex f-center" href="https://t.me/morismoss"
        >Чат с оператором</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
<style lang="scss" scoped>
.home {
  margin-bottom: 50px;
  &__title {
    color: #333;
    margin-top: 20px;
    font-size: 25px;
    font-weight: 700;
  }
  &__img {
    width: 100%;
    max-width: 150px;
    height: auto;
  }
  .info {
    font-size: 16px;
    line-height: 20px;
    text-align: justify;
    color: #333;
    &__state {
      z-index: 0;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #dddddd;
      cursor: default;
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 4px 4px 10px 0px rgba(124, 124, 124, 0.2);
        transform: scale(1.02);
      }
      &:before {
        content: "—";
        position: relative;
        padding-right: 5px;
      }
    }
  }
  &__button {
    margin: 10px 0 30px 0;
    padding: 0px 20px 0px 10px;
    background-color: #0088cc;
    position: relative;
    min-height: 40px;
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
  .home__img {
    max-width: 100px;
  }
}
</style>
