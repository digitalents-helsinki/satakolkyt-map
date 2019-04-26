<template>
  <div class="overlay-box">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'overlay-box'
}
</script>

<style lang="scss" scoped>
.overlay-box {
  background-color: transparent;
  border-radius: 5px;
  margin: 1rem 1rem;
  min-height: 5rem;
  padding: 1rem;
}
</style>
