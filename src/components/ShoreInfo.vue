<template>
  <div class="shore-info">
    <h2>{{ data.id }}</h2>
  </div>
</template>

<script>
export default {
  name: 'shore-info',

  props: ['data']
}
</script>

<style lang="scss" scoped>
.shore-info {
  h2 {
    font-weight: bold;
  }
}
</style>
