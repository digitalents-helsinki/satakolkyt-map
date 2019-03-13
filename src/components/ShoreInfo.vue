<template>
  <div class="shore-info">
    <h2>{{ data['hel:id'] }}</h2>
  </div>
</template>

<script>
export default {
  name: 'shore-info',

  props: ['data']
}
console.log(this)
</script>

<style lang="scss" scoped>
.shore-info {
  h2 {
    font-weight: bold;
  }
}
</style>
