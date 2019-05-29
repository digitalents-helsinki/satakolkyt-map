// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="help-mask">
    <div class="help-wrapper" @click="$emit('close')">
      <div class="help-container" @click.stop>
        <div class="closer">
          <font-awesome-icon
            icon="times"
            class="cross-icon"
            @click="$emit('close')"
          />
        </div>

        <div class="help-header">
          <h1>{{ $t('message.help_title') }}</h1>
        </div>

        <div class="help-body">
          <h2>{{ $t('message.guide_coming_title') }}</h2>
          <ul>
            <li
              v-for="(item, index) in $t('message.guide_coming_list')"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
          <h2>{{ $t('message.guide_cleaned_title') }}</h2>
          <ul>
            <li
              v-for="(item, index) in $t('message.guide_cleaned_list')"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
          <p v-for="(para, index) in $t('message.help_text')" :key="index">
            {{ para }}
          </p>
          <p>
            {{ $t('message.help_contact') }}
            <a href="mailto:eeva.puustjarvi@hel.fi">eeva.puustjarvi@hel.fi</a>,
            {{ $t('message.help_phone') }} 044 270 0573
          </p>
          <div class="digitalents">
            <h3>{{ $t('message.powered_by') }}</h3>
            <a href="http://digitalents.munstadi.fi" target="_blank">
              <img src="DT_black.svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'help'
}
</script>
<style lang="scss" scoped>
.help-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;

  .help-wrapper {
    display: table-cell;
    vertical-align: middle;

    .help-container {
      position: relative;
      width: 550px;
      max-height: 90vh;
      margin: 0px auto;
      padding: 70px 30px 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      overflow-y: auto;
      z-index: 9998;
      line-height: 1.2;

      .closer {
        position: absolute;
        font-size: 30px;
        cursor: pointer;
        right: 10px;
        top: 0;
        padding: 20px;
      }

      .help-header {
        margin-bottom: 20px;

        h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 40px;
        }
      }

      .help-body {
        padding-bottom: 60px;

        h2 {
          font-size: 18px;
          font-weight: bold;
          margin-top: 20px;
        }

        ul {
          li {
            font-size: 16px;
            list-style-type: disc;
            margin-left: 30px;
            margin-top: 10px;
          }
        }

        p {
          font-size: 16px;
          padding: 10px 0;

          &:first-of-type {
            margin-top: 20px;
          }
        }

        .digitalents {
          margin: 10px auto 0 auto;
          padding-top: 40px;
          border-top: 1px solid #bbb;
          max-width: 350px;

          h3 {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
          }

          img {
            width: 100%;
            padding-right: 40px;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  .help-mask {
    .help-wrapper {
      .help-container {
        width: 95vw;
      }
    }
  }
}
</style>
