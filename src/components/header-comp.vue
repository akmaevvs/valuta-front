<template>
  <header class="header d-flex f-center" :class="{ 'header--black': showMenu }">
    <div class="inner d-flex f-btwn">
      <nav class="header__nav">
        <humb-button @click="ShowMenu" :trigger="showMenu" />
        <transition name="menu-desktop">
          <div class="header__links d-flex" v-if="showMenu">
            <ul class="d-flex f-column">
              <li>
                <router-link to="/" @click.stop="ShowMenu">Главная</router-link>
              </li>
              <li>
                <router-link to="/calc" @click.stop="ShowMenu"
                  >Калькулятор</router-link
                >
              </li>
            </ul>
          </div>
        </transition>
      </nav>
      <h1 class="header__title">valuta</h1>
      <img
        class="header__logo"
        alt="Vue logo"
        src="@/assets/img/exchange.png"
        width="25"
        height="25"
      />
    </div>
  </header>
</template>

<script>
import HumbButton from "@/components/ui/humb-button.vue";

export default {
  name: "header-comp",
  components: {
    HumbButton,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    ShowMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  z-index: 10;
  top: 0;
  background-color: #333;
  height: 50px;
  transition: background-color 0.5s ease;
  &--black {
    background-color: #0c0c0c;
  }
  &__title {
    color: #fff;
    font-size: 17px;
    z-index: 20;
  }
  &__logo {
    width: 25px;
    height: auto;
    z-index: 20;
  }
  &__links {
    position: absolute;
    width: 100%;
    height: calc(100vh - 50px);
    padding: 15px;
    top: 50px;
    left: 0;
    font-size: 15px;
    background-color: #0c0c0c;
    z-index: 10;
    justify-content: center;
    ul {
      width: 100%;
      max-width: 500px;
    }
    li {
      border-bottom: 1px solid #333;
    }
    li a {
      color: #fff;
      padding: 20px;
      text-decoration: none;
      display: inline-block;
      width: 100%;
      transition: all 0.2s ease;
      &:hover {
        opacity: 0.65;
      }
    }
  }
}
</style>
