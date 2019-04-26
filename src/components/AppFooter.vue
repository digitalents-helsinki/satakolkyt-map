<template>
  <div>
    <div class="footer"></div>
    <div class="colors"></div>
  </div>
</template>

<script>
export default {
  name: 'app-footer'
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  width: 100vw;
  height: 8vh;
  padding: 0%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
}
.colors {
  position: fixed;
  right: 0;
  z-index: 999;
  bottom: 0;
  width: 15%;
  height: 20vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f0e41a;
}
</style>
