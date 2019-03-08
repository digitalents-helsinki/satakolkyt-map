<template>
  <div class="map-view">
    <map-box
      :access-token="accessToken"
      :map-options="mapOptions"
      :nav-control="navControl"
      @map-load="mapLoaded"
    />
  </div>
</template>

<script>
/* eslint-disable */
import MapBox from 'mapbox-gl-vue'

export default {
  name: 'map-view',
  props: ['data'],
  components: {
    MapBox
  },
  data() {
    return {
      accessToken:
        'pk.eyJ1IjoiZGlnaXRhbGVudHMiLCJhIjoiY2pzZWppdm01MDV1NzQ0bzJmczQ5cDR2ZCJ9.p8qNiWhX3bWj9FB8IjdmLA',
      mapOptions: {
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [24.9476669, 60.1535843],
        zoom: 11
      },
      navControl: {
        show: false
      }
    }
  },

  methods: {
    generateLineStringStyle() {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#475DCC',
          'line-width': 5
        }
      }
    },

    mapLoaded(map) {
      console.log(this.$props.data)
      map.addLayer({
        id: 'shore',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features:
            this.$props.data


          }
        },
        ...this.generateLineStringStyle()
      })
      map.on('click', 'shore', e => {
        console.log(e.lngLat)
        this.$emit('shore-click', e.features[0].properties)
        map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 15 })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map-view {
  height: 100%;
}
#map {
  height: 100%;
}
</style>
