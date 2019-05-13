<template>
  <div class="app-header">
    <template v-if="!iframed">
      <vue-headful :lang="$i18n.locale" />
      <img src="logo.svg" style="width:20rem;" />
    </template>
    <template v-else>
      <h1>{{ $t('message.iframe') }}</h1>
      <template v-if="isOffline">
        <h2>{{ $t('message.offline') }}</h2>
      </template>
    </template>

    <template v-if="isOffline">
      <h2>{{ $t('message.offline') }}</h2>
    </template>

    <div class="help-icon">
      <font-awesome-icon icon="question-circle" @click="showHelp = true" />
    </div>

    <div class="locale-changer-wrapper">
      <div class="locale-changer">
        <div class="locale-button" @click="$i18n.locale = 'fi'">
          <div>FI</div>
        </div>
        <div class="locale-button" @click="$i18n.locale = 'sv'">
          <div>SV</div>
        </div>
        <div class="locale-button" @click="$i18n.locale = 'en'">
          <div>EN</div>
        </div>
      </div>
    </div>

    <div v-if="showHelp">
      <transition name="modal">
        <Help @close="showHelp = false"> </Help>
      </transition>
    </div>

    <template v-if="iframed">
      <div class="to-new-window">
        AVAA&nbsp;KARTTA UUTEEN&nbsp;IKKUNAAN&nbsp;<font-awesome-icon
          icon="arrow-right"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Help from './Help'
export default {
  name: 'app-header',

  components: { Help },
  data() {
    return {
      showHelp: false,
      iframed: true
    }
  },
  mounted() {
    //this.iframed = window.self !== window.top
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  min-height: 75px;
  padding: 20px;
  background-color: #f0e41a;
  box-shadow: 0 6px 2px -4px rgba(black, 0.15), 0 0 0 1px rgba(black, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 24px;

  .locale-changer-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 20px;

    .locale-changer {
      display: flex;
      height: 40px;

      .locale-button {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 18px;
        width: 40px;
        text-align: center;
        margin: 0 5px;
        color: #f0e41a;
        background-color: #4e4a45;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }

  .help-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 40px;
    cursor: pointer;
    margin: 0 20px;
  }

  h1 {
    margin-top: 8px;
    font-weight: bold;
    width: 800px;
  }

  .to-new-window {
    color: #00a0ff;
    margin: 8px 10px 0 10px;
    cursor: pointer;
  }

  h2 {
    font-weight: bold;
    letter-spacing: 0.25px;
  }
  @media only screen and (max-width: 600px) {
    .help-icon {
      display: none;
    }
  }
}
</style>
