<template>
  <div class="policy-container">
    <pdf :src="pdf" :page="1" style="width: 100%; min-width: 750px;" />
    <pdf :src="pdf" :page="2" style="width: 100%; min-width: 750px;" />
  </div>
</template>
<script>
import pdf from 'vue-pdf'

export default {
  name: 'policy',
  components: {
    pdf
  },
  computed: {
    pdf() {
      switch (this.$i18n.locale) {
        case 'sv':
          return 'rekisteriseloste-sv.pdf'
        case 'en':
          return 'rekisteriseloste-en.pdf'
        default:
          return 'rekisteriseloste.pdf'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.policy-container {
  max-width: 750px;
  width: 90vw;
  max-height: 800px;
  height: 90vh;
  background-color: white;
  margin: 5vh auto;
  overflow-y: auto;
}

@media only screen and (max-width: 768px) {
  .policy-container {
    width: 95vw;
  }
}
</style>
