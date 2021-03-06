// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="footer-wrapper">
    <div class="footer-container">
      <div class="footer">
        <div class="buttons">
          <shore-info
            v-if="!this.$props.adminmode && this.$props.data"
            @show-reservationform="this.showReservationForm"
            @show-cleanform="this.showCleanedForm"
            :data="this.$props.data"
            :seltype="seltype"
          />
          <admin-shore-info
            v-if="this.$props.adminmode && this.$props.action"
            :data="this.$props.data"
            :action="this.$props.action"
            @hide-shore="this.hideShoreMap"
            @unhide-shore="this.unHideShoreMap"
            @unselect="$emit('unselect')"
          >
          </admin-shore-info>
        </div>
        <div
          class="counter"
          :class="{ hide: seltype && seltype !== 'cleaned' && !adminmode }"
        >
          <div class="stepcount green">
            <ICountUp :endVal="counterSteps" :options="countOptions" />
          </div>
          <div class="stepinfo">
            {{ $t('message.steps_walked') }}
          </div>
          <div class="kilometercount red">
            <ICountUp :endVal="counterKm" :options="countOptions" />
          </div>
          <div class="kiloinfo">
            {{ $t('message.km_cleaned') }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="colors"
      :class="{ legenddown: legendmobilehidden }"
      @click="legendmobilehidden = !legendmobilehidden"
    >
      <div class="container">
        <div class="header">
          <div class="hideable">
            <h6>{{ $t('message.legend') }}</h6>
            <div class="arrow">
              {{ legendmobilehidden ? '&#9650;' : '&#9660;' }}
            </div>
          </div>
        </div>
        <div class="images">
          <div class="free">
            <img src="../Icons/red.svg" alt="" />
            {{ $t('message.shoresfree') }}
          </div>
          <div class="come-clean">({{ $t('message.come_clean') }})</div>
          <div class="reserved">
            <img src="../Icons/orange.svg" alt="" />
            <div>{{ $t('message.shoresreserved') }}</div>
          </div>
          <div class="cleaned">
            <img src="../Icons/green.svg" alt="" />
            {{ $t('message.shorescleaned') }}
          </div>
          <div class="iconlegend">
            <div class="iconlegendrow">
              <div class="icon">
                <img
                  alt=""
                  src="tool_icon.svg"
                  style="width: 40px; height: 40px;"
                />
              </div>
              <h6>{{ $t('message.loanequipment') }}</h6>
            </div>
            <div class="iconlegendrow">
              <div class="icon">
                <img
                  alt=""
                  src="bin_icon.svg"
                  style="width: 28px; height: 28px;"
                />
              </div>
              <h6>{{ $t('message.trashbins') }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShoreInfo from './ShoreInfo'
import AdminShoreInfo from './AdminShoreInfo'
import ICountUp from 'vue-countup-v2'

export default {
  name: 'app-footer',
  props: [
    'data',
    'seltype',
    'action',
    'showReservation',
    'showCleaned',
    'showShoreData',
    'unHideShore',
    'hideShore',
    'adminmode',
    'counterSteps',
    'counterKm'
  ],
  components: {
    ShoreInfo,
    AdminShoreInfo,
    ICountUp
  },
  data() {
    return {
      legendmobilehidden: true,
      countOptions: {
        useGrouping: true
      }
    }
  },
  mounted() {},
  methods: {
    showReservationForm(data) {
      this.$emit('show-reservationform', data)
    },
    showCleanedForm(data) {
      this.$emit('show-cleanform', data)
    },
    hideShoreMap(data) {
      this.$emit('hide-shore', data)
    },
    unHideShoreMap(data) {
      this.$emit('unhide-shore', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100vw;
  flex-direction: row;
  pointer-events: none;
  z-index: 9997;

  .footer-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;

    .footer {
      position: relative;
      z-index: 9997;
      height: 80px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: white;
      pointer-events: all;

      .buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        height: 100%;
      }

      .counter {
        position: relative;
        z-index: 9995;
        align-items: center;
        display: flex;
        font-weight: bold;
        padding: 0 10px;

        .stepinfo {
          margin-right: 20px;
        }

        .stepinfo,
        .kiloinfo {
          text-transform: uppercase;
          max-width: 150px;
          font-size: 32px;
          margin-left: 0.5em;
        }
        .stepcount,
        .kilometercount {
          color: #006b32;
        }

        .stepcount,
        .kilometercount {
          font-size: 70px;
          white-space: nowrap;
        }
      }
    }
  }

  .colors {
    position: relative;
    z-index: 99;
    min-width: 220px;
    width: 220px;
    display: flex;
    text-transform: uppercase;
    font-weight: 700;
    flex-direction: column;
    background-color: #eee350;

    .header {
      position: relative;
      margin-bottom: 10px;
      margin-top: 20px;

      .hideable {
        display: none;
        margin-bottom: 10px;

        .arrow {
          position: absolute;
          right: 0;
          top: -4px;
          color: black;
          font-size: 18px;
        }
      }
    }
    .container {
      margin: 0 15px;
    }

    .images img {
      width: 30%;
      height: 10px;
    }
    .images {
      .iconlegend {
        .iconlegendrow {
          margin: 15px 0 15px 15px;
          display: flex;
          align-items: center;

          .icon {
            min-width: 32px;
            margin-right: 15px;
          }
        }
      }

      .free {
        margin: 20px 0 5px 0;
      }

      .reserved {
        display: flex;
        align-items: center;
        line-height: 1.2;

        img {
          margin-right: 5px;
        }
      }

      .reserved,
      .cleaned {
        margin: 25px 0;
      }

      .come-clean {
        margin: 0;
        font-size: 14px;
      }
    }
  }
}

@media only screen and (max-width: 1366px) {
  .footer-wrapper {
    .footer-container {
      .footer {
        justify-content: center;

        .buttons {
          position: absolute;
          align-content: center;
          background-color: white;
          z-index: 9997;
          margin: 0;
        }

        .counter {
          .stepcount,
          .kilometercount {
            font-size: 50px;
          }

          .stepinfo {
            margin-right: 40px;
          }

          .stepinfo,
          .kiloinfo {
            font-size: 22px;
            max-width: 120px;
          }
        }

        .hide {
          display: none;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .footer-wrapper {
    justify-content: flex-end;

    .footer-container {
      .footer {
        bottom: 0;
        width: 100%;
        height: 64px;

        .counter {
          position: relative;
          padding: 0 5px;
          right: 0;
          bottom: 0;

          .stepcount,
          .kilometercount {
            font-size: 26px;
            margin: 0;
          }
          .stepinfo,
          .kiloinfo {
            font-size: 14px;
            margin: 0 5px;
          }

          .stepinfo {
            margin-right: 15px;
          }
        }
      }
    }
    .colors {
      position: absolute;
      bottom: 64px;
      max-width: 180px !important;
      min-width: 0 !important;
      min-height: 0;
      pointer-events: all;
      cursor: pointer;
      overflow: hidden;

      .container {
        margin-left: 10px;

        .header {
          font-size: 14px;
          margin: 10px 0;

          .hideable {
            display: block;
          }
        }

        .images {
          .iconlegend {
            margin-top: 20px;

            h6 {
              font-size: 14px;
            }
          }

          .img {
            max-width: 40px;
          }

          .free {
            margin: 0 0 5px 0;
            font-size: 14px;
          }

          .reserved,
          .cleaned {
            margin: 15px 0;
            font-size: 14px;
          }

          .come-clean {
            margin: 0;
            font-size: 11px;
          }
        }
      }
    }
    .legenddown {
      max-height: 30px;
    }
  }
}
@media (min-resolution: 110dpi) and (min-width: 768px) and (max-width: 1920px) {
  .colors {
    font-size: 14px;
  }
}
</style>
