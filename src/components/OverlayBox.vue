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
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 6px 2px -4px rgba(black, 0.15), 0 0 0 1px rgba(black, 0.05);
  margin: 1rem 1rem;
  min-height: 5rem;
  padding: 1rem;
}
</style>
