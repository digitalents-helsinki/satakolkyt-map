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
  name: 'shore-map',
  props: {
    adminmode: {
      type: Boolean,
      default: false
    },
    freeshores: [Object, Array],
    reservedshores: [Object, Array],
    cleanedshores: [Object, Array],
    hiddenshores: [Object, Array]
  },
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
        zoom: 11,
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: false
      },
      navControl: {
        show: false
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
    addShoreType(map, name, data, color) {
      const enhancedData = data.map(d => ({
        ...d,
        properties: { ...d.properties, key: d._key }
      }))

      const shoreData = {
        type: 'FeatureCollection',
        features: enhancedData
      }

      map.addSource(name, { type: 'geojson', data: shoreData })
      map.addLayer({
        id: name,
        type: 'line',
        source: name,
        ...this.generateLineStringStyle(color)
      })
    },
    addSelectedShoreType(map, name, data, color) {
      map.addSource(name, {
        type: 'geojson',
        data: data
      })
      map.addLayer({
        id: name,
        type: 'line',
        source: name,
        ...this.generateLineStringStyle(color)
      })
    },
    addShoreClickHandler(map, layername, eventname, selectedColor) {
      map.on('click', layername, e => {
        this.$emit(eventname, e.features[0].properties)

        const selecteddata = {
          type: 'FeatureCollection',
          features: e.features
        }

        const selShData = map.getSource(layername + 'Selected')
        if (!selShData) {
          this.addSelectedShoreType(
            map,
            layername + 'Selected',
            selecteddata,
            selectedColor
          )
        } else {
          selShData.setData(selecteddata)
        }

        map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 17 })
      })
    },

    mapLoaded(map) {
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'bottom-right'
      )
      this.map = map

      this.addShoreType(map, 'freeShore', this.freeshores, '#475DCC')
      this.addShoreType(map, 'reservedShore', this.reservedshores, '#FF0000')
      this.addShoreType(map, 'cleanedShore', this.cleanedshores, '#006625')
      if (this.adminmode) {
        this.addShoreType(map, 'hiddenShore', this.hiddenshores, '#FFFF00')
      }

      this.addShoreClickHandler(map, 'freeShore', 'shore-click', '#8595E5')
      this.addShoreClickHandler(map, 'reservedShore', 'shore-click', '#FF7575')
      if (this.adminmode) {
        this.addShoreClickHandler(map, 'hiddenShore', 'hidden-click', '#FFFF77')
      }

      this.$emit('map-loaded', map)

      map.on('zoom', function() {
        if (map.getZoom() > 15) {
          map.setPaintProperty('freeShore', 'line-width', 15)
          map.setPaintProperty('freeShoreSelected', 'line-width', 20)
          map.setPaintProperty('reservedShore', 'line-width', 15)
          map.setPaintProperty('reservedShoreSelected', 'line-width', 20)
          map.setPaintProperty('cleanedShore', 'line-width', 15)
          map.setPaintProperty('hiddenShore', 'line-width', 15)
          map.setPaintProperty('hiddenShoreSelected', 'line-width', 20)
        } else if (map.getZoom() > 13) {
          map.setPaintProperty('freeShore', 'line-width', 5)
          map.setPaintProperty('freeShoreSelected', 'line-width', 7)
          map.setPaintProperty('reservedShore', 'line-width', 5)
          map.setPaintProperty('reservedShoreSelected', 'line-width', 7)
          map.setPaintProperty('cleanedShore', 'line-width', 5)
          map.setPaintProperty('hiddenShore', 'line-width', 5)
          map.setPaintProperty('hiddenShoreSelected', 'line-width', 7)
        } else {
          map.setPaintProperty('freeShore', 'line-width', 1)
          map.setPaintProperty('freeShoreSelected', 'line-width', 2)
          map.setPaintProperty('reservedShore', 'line-width', 1)
          map.setPaintProperty('reservedShoreSelected', 'line-width', 2)
          map.setPaintProperty('cleanedShore', 'line-width', 1)
          map.setPaintProperty('hiddenShore', 'line-width', 1)
          map.setPaintProperty('hiddenShoreSelected', 'line-width', 2)
        }
      })

      // disable map rotation using right click + drag
      map.dragRotate.disable()

      // disable map rotation using touch rotation gesture
      map.touchZoomRotate.disableRotation()
      const canv = map.getCanvas()
      map.on('mouseenter', 'freeShore', e => {
        canv.style.cursor = 'pointer'
      })
      map.on('mouseleave', 'freeShore', e => {
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
  width: 100%;
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
  cursor: grab;
}
</style>
