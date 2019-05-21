<template>
  <div class="app-header">
    <vue-headful :lang="$i18n.locale" />
    <div class="logo-container" v-if="!iframed">
      <img src="logo.svg" />
    </div>
    <template v-else>
      <div class="iframed-text">
        <h1 v-if="!isOffline">{{ $t('message.iframe') }}</h1>
        <h1 v-if="isOffline">{{ $t('message.offline') }}</h1>
      </div>
    </template>

    <template v-if="isOffline">
      <h2>{{ $t('message.offline') }}</h2>
    </template>

    <div class="help-icon-wrapper">
      <div class="help-icon">
        <font-awesome-icon icon="question-circle" @click="showHelp = true" />
      </div>
    </div>

    <div class="help" v-if="showHelp">
      <transition name="modal">
        <Help @close="showHelp = false"> </Help>
      </transition>
    </div>

    <div class="header-right-wrapper">
      <div class="header-right">
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
        <div v-if="iframed" class="to-new-window-wrapper">
          <div class="to-new-window">
            <h2>{{ $t('message.to_new_window') }}</h2>
          </div>
          <div class="arrow">
            <font-awesome-icon icon="arrow-right" />
          </div>
        </div>
      </div>
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
      showHelp: false,
      iframed: false,
      isOffline: false
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
  padding: 10px;
  background-color: #f0e41a;
  box-shadow: 0 6px 2px -4px rgba(black, 0.15), 0 0 0 1px rgba(black, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 24px;

  .logo-container {
    display: flex;
    min-width: 150px;
    max-width: 350px;
    flex: 1;

    .img {
      width: 100%;
    }
  }

  .iframed-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1.2;

    h1 {
      font-weight: bold;
    }
  }

  .help-icon-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    .help-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      font-size: 40px;
      margin: 0 20px;

      & > * {
        cursor: pointer;
      }
    }
  }

  .help {
    position: absolute;
  }

  .header-right-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1.2;

    .header-right {
      display: flex;
      justify-content: flex-end;

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
            background-color: hsl(33, 6%, 22%);
            border-radius: 50%;
            cursor: pointer;
          }
        }
      }

      .to-new-window-wrapper {
        display: flex;
        justify-content: center;
        color: #00a0ff;
        cursor: pointer;

        .to-new-window {
          display: flex;
          flex-direction: column;
          justify-content: center;

          h2 {
            text-align: end;
            text-transform: uppercase;
          }
        }

        .arrow {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 5px;
        }
      }
    }
  }
}

@media only screen and (max-width: 1366px) {
  .app-header {
    font-size: 20px;

    .header-right-wrapper {
      flex: 1.1;

      .header-right {
        flex-direction: column-reverse;

        .locale-changer-wrapper {
          margin: 0;
          flex-direction: row;
          justify-content: flex-end;

          .locale-changer {
            height: 30px;

            .locale-button {
              width: 30px;
              font-size: 14px;
            }
          }
        }

        .to-new-window-wrapper {
          justify-content: flex-end;
          margin-bottom: 5px;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .app-header {
    padding: 5px;
    font-size: 14px;

    .help-icon-wrapper {
      flex: 0.7;

      .help-icon {
        font-size: 30px;
      }
    }
  }
}
</style>
