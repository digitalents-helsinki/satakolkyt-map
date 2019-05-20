<template>
  <div class="infobox">
    <div class="closer">
      <font-awesome-icon
        icon="times"
        class="cross-icon"
        @click="$emit('infobox-close')"
      />
    </div>
    <template v-if="type === 'reserved'">
      <h1>{{ $t('message.reserved_shore') }}</h1>
      <h2>
        {{
          reservedInfo.confirmed
            ? '(' + $t('message.confirmed') + ')'
            : '(' + $t('message.unconfirmed') + ')'
        }}
      </h2>
      <template v-if="reservedInfo.confirmed">
        <p>
          <b>{{ $t('message.organizer') }}:</b> {{ reservedInfo.organizer }}
        </p>
        <p>
          <b>{{ $t('message.type_open') }}?:</b>
          {{ reservedInfo.openevent ? $t('message.yes') : $t('message.no') }}
        </p>
        <template v-if="reservedInfo.openevent">
          <p>
            <b>{{ $t('message.event_info') }}:</b> {{ reservedInfo.openinfo }}
          </p>
          <p>
            <b>{{ $t('message.event_link') }}:</b> {{ reservedInfo.openlink }}
          </p>
        </template>
        <p>
          <b>{{ $t('message.begins') }}:</b>
          {{ reservedInfo.startdate + ' ' + reservedInfo.starttime }}
        </p>
        <p>
          <b>{{ $t('message.ends') }}:</b>
          {{ reservedInfo.enddate + ' ' + reservedInfo.endtime }}
        </p>
      </template>
    </template>
    <template v-if="type === 'cleaned'">
      <h1>{{ $t('message.cleaned_shore') }}</h1>
      <h2>
        {{
          cleanedInfo.confirmed
            ? '(' + $t('message.confirmed') + ')'
            : '(' + $t('message.unconfirmed') + ')'
        }}
      </h2>
      <template v-if="cleanedInfo.confirmed">
        <p>
          <b>{{ $t('message.organizer') }}:</b> {{ cleanedInfo.organizer_name }}
        </p>
        <p>
          <b>{{ $t('message.shorescleaned') }}:</b> {{ cleanedInfo.date }}
        </p>
      </template>
    </template>
    <template v-if="type === 'free'">
      <h1>{{ $t('message.free_shore') }}</h1>
      <p>{{ $t('message.come_clean') }}</p>
    </template>
    <div class="idnum">
      ID: {{ type === 'free' ? data.key : data.selected.key }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'infobox',
  props: ['type', 'data'],
  data() {
    return {
      reservedInfo: this.$props.data,
      cleanedInfo: this.$props.data
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
  padding: 10px;

  .closer {
    position: absolute;
    font-size: 30px;
    right: 20px;
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
</style>
