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
              ? $t('message.private_event')
              : '(' + $t('message.unconfirmed') + ')'
          }}
        </h2>
        <p v-if="this.$props.data.openevent" class="event-text">
          {{ $t('message.reservation_open') }}
        </p>
        <div v-if="this.$props.data.confirmed" class="organizer-date">
          <p>
            <b>
              {{ this.$props.data.organizer }}
              {{ this.$props.data.startdate | moment('DD.MM.YYYY') }}
            </b>
          </p>
          <div v-if="this.$props.data.openevent" class="openinfo">
            <p>
              {{ this.$props.data.openinfo }}
            </p>
            <p class="event-link">
              <a :href="stripProtocol()">{{ $t('message.openevent_link') }}</a>
            </p>
          </div>
        </div>
      </div>
      <div v-if="type === 'cleaned'">
        <h1>{{ $t('message.cleaned_shore') }}</h1>
        <h2>
          {{
            this.$props.data.confirmed
              ? ''
              : '(' + $t('message.unconfirmed') + ')'
          }}
        </h2>
        <div v-if="this.$props.data.confirmed">
          <p class="shore-cleaned-text">{{ $t('message.cleaning_text') }}</p>
          <p class="shore-cleaner-text">
            <b>{{ this.$props.data.organizer_name }}</b>
            <b>{{ this.$props.data.date | moment('DD.MM.YYYY') }}</b>
          </p>
        </div>
      </div>
      <div v-if="type === 'free'">
        <h1>{{ $t('message.free_shore') }}</h1>
        <p>{{ $t('message.come_clean') }}</p>
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
  width: 350px;
  min-height: 100px;
  background-color: white;
  padding: 20px 30px 20px 30px;
  word-break: break-word;

  .spinner {
    width: 82px;
    margin: 50px auto;
  }

  .closer {
    position: absolute;
    font-size: 30px;
    cursor: pointer;
    right: 0;
    top: -5px;
    padding: 15px;
  }

  .event-text {
    color: gray;
    font-size: 15px;
  }

  .organizer-date {
    padding-top: 15px;
  }

  h1 {
    text-transform: uppercase;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  h2 {
    font-size: 16px;
    color: #aaa;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
  }

  p {
    margin: 5px 0;
  }

  .openinfo {
    padding-top: 10px;
    color: gray;

    p {
      padding-bottom: 10px;
    }

    a:any-link {
      font-size: 18px;
      color: #00a0ff;
      text-decoration: none;
    }
  }

  .shore-cleaned-text {
    color: gray;
    padding-bottom: 10px;
  }

  .shore-cleaner-text b {
    padding-right: 10px;
  }
}

@media only screen and (max-width: 768px) {
  .infobox {
    width: 280px;

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
