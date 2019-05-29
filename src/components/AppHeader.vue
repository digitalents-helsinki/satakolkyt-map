// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="app-header">
    <vue-headful :lang="$i18n.locale" />
    <div class="logo-container" v-if="!iframed">
      <img src="logo.svg" alt="Satakolkyt" />
    </div>
    <div v-else class="iframed-text">
      <h1>{{ $t('message.iframe') }}</h1>
    </div>
    <div class="header-right-wrapper">
      <div class="header-right">
        <div class="locale-changer-wrapper">
          <div class="locale-changer">
            <div class="help-icon">
              <font-awesome-icon
                icon="question-circle"
                @click="showHelp = true"
              />
            </div>
            <div class="help" v-if="showHelp">
              <Help @close="showHelp = false"> </Help>
            </div>
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
            <a href="https://map.satakolkyt.fi" target="_blank ">{{
              $t('message.to_new_window')
            }}</a>
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
      iframed: false
    }
  },
  mounted() {
    this.iframed = window.self !== window.top
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  min-height: 75px;
  padding: 10px;
  background-color: #eee350;
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
    margin-left: 20px;

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
            color: #eee350;
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

          a:any-link {
            color: #00a0ff;
            text-align: end;
            text-transform: uppercase;
            text-decoration: none;
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

  .help-icon {
    font-size: 30px !important;
  }
}

@media only screen and (max-width: 768px) {
  .app-header {
    padding: 5px;
    font-size: 14px;
    height: 75px;

    .logo-container {
      margin-left: 8px;
    }
  }
}
</style>
