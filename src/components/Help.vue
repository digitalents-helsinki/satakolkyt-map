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
          <p v-for="(para, index) in $t('message.help_text')" :key="index">
            {{ para }}
          </p>
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
  transition: opacity 0.3s ease;

  .help-wrapper {
    display: table-cell;
    vertical-align: middle;

    .help-container {
      position: relative;
      width: 400px;
      max-height: 80vh;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      overflow-y: auto;

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
        }
      }

      .help-body {
        p {
          font-size: 18px;
          padding: 10px 0;
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
