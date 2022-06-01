<template>
  <button class="gamburger">
    <span :class="{ first: trigger }"></span>
    <span :class="{ last: trigger }"></span>
  </button>
</template>

<script>
export default {
  name: "humb-button",
  props: {
    trigger: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.gamburger {
  width: 25px; /* ширина */
  height: 25px; /* высота */
  display: flex; /* выравнивание на флексбох */
  align-items: center;
  /* по вертикали */
  justify-content: center; /* по горизонтали */
  flex-direction: column; /* складывание полосок друг под друга */
  z-index: 19;
  &:hover {
    cursor: pointer;
  }
  span {
    display: block; /* строчный элемент в блочный */
    transition: all 0.5s ease; /* плавность анимации */
    width: 25px; /* ширина полоски */
    margin: 3px; /* расстояние между полосками */
    height: 2px; /* высота полоски */
    background-color: #fff; /* Цвет полоски */
    z-index: 19;
  }
  .first {
    transform: translate(0px, 5px) rotate(45deg);
  }
  .last {
    transform: translate(0px, -3px) rotate(-45deg);
  }
}
</style>
