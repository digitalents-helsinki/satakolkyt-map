// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="infobox">
    <div v-if="!this.$props.data" class="spinner">
      <spinner />
    </div>
    <div class="closer">
      <font-awesome-icon
        icon="times"
        class="cross-icon"
        @click="$emit('infobox-close')"
      />
    </div>
    <div v-if="this.$props.data">
      <div v-if="type === 'reserved'">
        <h1>{{ $t('message.reserved_shore') }}</h1>
        <h2>
          {{
            this.$props.data.confirmed
              ? '(' + $t('message.confirmed') + ')'
              : '(' + $t('message.unconfirmed') + ')'
          }}
        </h2>
        <div v-if="this.$props.data.confirmed">
          <p>
            <b>{{ $t('message.organizer') }}:</b>
            {{ this.$props.data.organizer }}
          </p>
          <p>
            <b>{{ $t('message.type_open') }}?:</b>
            {{
              this.$props.data.openevent ? $t('message.yes') : $t('message.no')
            }}
          </p>
          <div v-if="this.$props.data.openevent">
            <p>
              <b>{{ $t('message.event_info') }}:</b>
              {{ this.$props.data.openinfo }}
            </p>
            <p>
              <b>{{ $t('message.event_link') }}:</b>
              <a :href="stripProtocol()">{{ $t('message.openevent_link') }}</a>
            </p>
          </div>
          <p>
            <b>{{ $t('message.begins') }}:</b>
            {{ this.$props.data.startdate | moment('DD.MM.YYYY') }}
            {{ $t('message.at') + ' ' + this.$props.data.starttime }}
          </p>
          <p>
            <b>{{ $t('message.ends') }}:</b>
            {{ this.$props.data.enddate | moment('DD.MM.YYYY') }}
            {{ $t('message.at') + ' ' + this.$props.data.endtime }}
          </p>
        </div>
      </div>
      <div v-if="type === 'cleaned'">
        <h1>{{ $t('message.cleaned_shore') }}</h1>
        <h2>
          {{
            this.$props.data.confirmed
              ? '(' + $t('message.confirmed') + ')'
              : '(' + $t('message.unconfirmed') + ')'
          }}
        </h2>
        <div v-if="this.$props.data.confirmed">
          <p>
            <b>{{ $t('message.organizer') }}:</b>
            {{ this.$props.data.organizer_name }}
          </p>
          <p>
            <b>{{ $t('message.shorescleaned') }}:</b>
            {{ this.$props.data.date | moment('DD.MM.YYYY') }}
          </p>
        </div>
      </div>
      <div v-if="type === 'free'">
        <h1>{{ $t('message.free_shore') }}</h1>
        <p>{{ $t('message.come_clean') }}</p>
      </div>
      <div class="idnum">
        ID:
        {{
          type === 'free' ? this.$props.data.key : this.$props.data.selected.key
        }}
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'

export default {
  name: 'infobox',
  components: { Spinner },
  props: ['type', 'data'],
  methods: {
    stripProtocol: function() {
      if (
        this.$props.data.openlink.startsWith('http://') ||
        this.$props.data.openlink.startsWith('https://')
      ) {
        return this.$props.data.openlink
      } else {
        return 'http://' + this.$props.data.openlink
      }
    }
  }
}
</script>
<style lang="scss">
.infobox {
  //position: absolute;
  width: 300px;
  height: 200px;
  //bottom: 150px;
  //left: 50px;
  background-color: white;
  padding: 15px 10px 10px 10px;

  .spinner {
    width: 82px;
    margin: 50px auto;
  }

  .closer {
    position: absolute;
    font-size: 30px;
    cursor: pointer;
    top: 10px;
    right: 15px;
  }

  h1 {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 16px;
    color: #aaa;
    text-align: center;
    margin-bottom: 20px;
  }

  p {
    margin: 5px 0;
  }

  .idnum {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #bbb;
  }
}

@media only screen and (max-width: 768px) {
  .infobox {
    width: 280px;
    height: 170px;

    h1 {
      font-size: 18px;
    }

    h2 {
      font-size: 14px;
    }

    p {
      font-size: 14px;
    }
  }
}
</style>
