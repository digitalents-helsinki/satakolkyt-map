<template>
  <div class="app-header">
    <h1>Satakolkyt Karttasovellus</h1>
  </div>
</template>

<script>
export default {
  name: 'app-header'
}
</script>

<style lang="scss" scoped>
.app-header {
  padding: 1rem;
  background-color: white;
  box-shadow: 0 6px 2px -4px rgba(black, 0.15), 0 0 0 1px rgba(black, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  margin: 1rem;
  padding-top: 1.2rem;
  h1 {
    font-weight: bold;
    letter-spacing: 0.25px;
  }
}
</style>
