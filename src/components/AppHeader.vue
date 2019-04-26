<template>
  <div class="app-header">
    <vue-headful :lang="$i18n.locale" />
    <h1>{{ $t('message.app') }}</h1>
    <template v-if="isOffline">
      <h1>{{ $t('message.offline') }}</h1>
    </template>
    <font-awesome-icon
      icon="question-circle"
      class="help-icon"
      @click="showHelp = true"
    />
    <template>
      <div class="locale-changer">
        <span style="margin-right: 5px;" @click="$i18n.locale = 'fi'">FI</span>
        <span style="margin-right: 5px;" @click="$i18n.locale = 'sv'">SV</span>
        <span style="margin-right: 5px;" @click="$i18n.locale = 'en'">EN</span>
      </div>
    </template>

    <div v-if="showHelp">
      <transition name="modal">
        <Help @close="showHelp = false"> </Help>
      </transition>
    </div>
  </div>
</template>

<script>
import Help from './Help'
export default {
  name: 'app-header',

  components: { Help },
  data() {
    return {
      showHelp: false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  padding: 1rem;
  background-color: #f0e41a;
  box-shadow: 0 6px 2px -4px rgba(black, 0.15), 0 0 0 1px rgba(black, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding-top: 1.2rem;
  h1 {
    font-weight: bold;
    letter-spacing: 0.25px;
  }
}
</style>
