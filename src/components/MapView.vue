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
  props: ['data', 'data2', 'data3'],
  components: {
    MapBox
  },
  data() {
    return {
      accessToken:
        'pk.eyJ1IjoiZGlnaXRhbGVudHMiLCJhIjoiY2pzZWppdm01MDV1NzQ0bzJmczQ5cDR2ZCJ9.p8qNiWhX3bWj9FB8IjdmLA',
      mapOptions: {
        style: 'mapbox://styles/obb123/cjtty0dz501c21fpdg8vg1hx6',
        center: [24.9476669, 60.1535843],
        zoom: 11
      },
      navControl: {
        show: true,
        position: 'bottom-right'
      }
    }
  },

  methods: {
    generateLineStringStyle(color) {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': color,
          'line-width': 1
        }
      }
    },

    mapLoaded(map) {
      const enhancedData = this.$props.data.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))
      const enhancedData2 = this.$props.data2.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))
      const enhancedData3 = this.$props.data3.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))
      this.map = map

      data = {
        type: 'FeatureCollection',
        features: enhancedData
      }
      map.addSource('normalShoreData', { type: 'geojson', data: data })
      map.addLayer({
        id: 'normalShore',
        type: 'line',
        source: 'normalShoreData',
        ...this.generateLineStringStyle('#475DCC')
      })

      let data = {
        type: 'FeatureCollection',
        features: enhancedData2
      }
      map.addSource('reservedShoreData', { type: 'geojson', data: data })
      map.addLayer({
        id: 'reservedShore',
        type: 'line',
        source: 'reservedShoreData',
        ...this.generateLineStringStyle('#ff0000')
      })

      data = {
        type: 'FeatureCollection',
        features: enhancedData3
      }
      map.addSource('cleanedShoreData', { type: 'geojson', data: data })
      map.addLayer({
        id: 'cleanedShore',
        type: 'line',
        source: 'cleanedShoreData',
        ...this.generateLineStringStyle('#006625')
      })

      this.$emit('map-loaded', map)

      map.on('zoom', function() {
        if (map.getZoom() > 15) {
          map.setPaintProperty('normalShore', 'line-width', 15)
          map.setPaintProperty('reservedShore', 'line-width', 15)
          map.setPaintProperty('cleanedShore', 'line-width', 15)
        } else if (map.getZoom() > 13) {
          map.setPaintProperty('normalShore', 'line-width', 5)
          map.setPaintProperty('reservedShore', 'line-width', 5)
          map.setPaintProperty('cleanedShore', 'line-width', 5)
        } else {
          map.setPaintProperty('normalShore', 'line-width', 1)
          map.setPaintProperty('reservedShore', 'line-width', 1)
          map.setPaintProperty('cleanedShore', 'line-width', 1)
        }
      })

      map.on('click', 'normalShore', e => {
        this.$emit('shore-click', e.features[0].properties)
        map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 17 })
      })
      map.on('click', 'reservedShore', e => {
        this.$emit('shore-click', e.features[0].properties)
        map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 17 })
      })

      const canv = map.getCanvas()
      map.on('mouseenter', 'normalShore', e => {
        canv.style.cursor = 'pointer'
      })
      map.on('mouseleave', 'normalShore', e => {
        canv.style.cursor = 'grab'
      })
      map.on('mouseenter', 'reservedShore', e => {
        canv.style.cursor = 'pointer'
      })
      map.on('mouseleave', 'reservedShore', e => {
        canv.style.cursor = 'grab'
      })
    }
  }
}
</script>

<style lang="scss">
.map-view {
  height: 100%;
  cursor: pointer;
}
#map {
  height: 100%;
}
.mapboxgl-ctrl-icon.mapboxgl-ctrl-zoom-in {
  min-width: 1ex !important;
  border-radius: 0px;
}
.mapboxgl-ctrl > button {
  min-width: 1ex !important;
  border-radius: 0px;
}

.mapboxgl-canvas-container.mapboxgl-interactive,
.mapboxgl-ctrl-group > button.mapboxgl-ctrl-compass {
  cursor: -webkit-grab;
  cursor: grab;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  min-width: 1ex !important;
  border-radius: 0px;
}

canvas {
  cursor: pointer;
}
</style>
