<template>
  <div class="map-view">
    <map-box
      :access-token="accessToken"
      :map-options="mapOptions"
      :nav-control="navControl"
      @map-load="mapLoaded"
    />
    <div
      class="clickdetector"
      v-show="selectedLayer || showOnMap"
      @click.prevent="detectorClick"
    ></div>
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
    hiddenshores: [Object, Array],
    showOnMap: false
  },
  components: {
    MapBox
  },
  data() {
    return {
      accessToken:
        'pk.eyJ1Ijoic2F0YWtvbGt5dCIsImEiOiJjanY4MHB2MXQwYWN6M3lwa2xlZDdzMmY0In0.2H2gSyrO7PpTUcYN4qPbJg',
      mapOptions: {
        style: 'mapbox://styles/satakolkyt/cjv80rnwr02lu1fo4y7gxcldj',
        center: [25.05, 60.2],
        zoom: 11,
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: false,
        hash: true
      },
      navControl: {
        show: false
      },
      selectedLayer: null
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
    enhanceData(data) {
      //apparently without this the data format is somehow wrong
      return data.map(e => ({
        ...e,
        properties: { ...e.properties, key: e._key }
      }))
    },
    addShoreType(map, name, data, color) {
      const shoreData = {
        type: 'FeatureCollection',
        features: this.enhanceData(data)
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
    addShoreClickHandler(map, layername, storename, eventname, selectedColor) {
      map.on('click', layername, e => {
        this.$emit(eventname, e.features[0].properties)

        //don't get the geometry from the event but our store instead
        //because the event data is bad
        const feat = this.$store.state.maplayers[storename].find(f => {
          return f._key === e.features[0].properties.key
        })

        const selecteddata = {
          type: 'FeatureCollection',
          features: [feat]
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
        this.selectedLayer = layername + 'Selected'
      })
    },
    detectorClick() {
      this.$emit('unselect')
      this.unSelect()
    },
    unSelect() {
      if (this.selectedLayer && this.map.isSourceLoaded(this.selectedLayer)) {
        this.map.removeLayer(this.selectedLayer)
        this.map.removeSource(this.selectedLayer)
      }
      this.selectedLayer = null
    },
    removeDetector() {
      this.selectedLayer = null
    },
    onZoom(map) {
      const MAX_ZOOM = 20
      const MIN_ZOOM = 11
      const MAX_NORMAL_WIDTH = 22
      const MAX_SELECTED_WIDTH = 27
      const MIN_NORMAL_WIDTH = 2
      const MIN_SELECTED_WIDTH = 3

      const zoom = map.getZoom()
      if (zoom >= MAX_ZOOM) {
        map.setPaintProperty('freeShore', 'line-width', MAX_NORMAL_WIDTH)
        map.setPaintProperty(
          'freeShoreSelected',
          'line-width',
          MAX_SELECTED_WIDTH
        )
        map.setPaintProperty('reservedShore', 'line-width', MAX_NORMAL_WIDTH)
        map.setPaintProperty(
          'reservedShoreSelected',
          'line-width',
          MAX_SELECTED_WIDTH
        )
        map.setPaintProperty('cleanedShore', 'line-width', MAX_NORMAL_WIDTH)
        map.setPaintProperty(
          'cleanedShoreSelected',
          'line-width',
          MAX_SELECTED_WIDTH
        )
        map.setPaintProperty('hiddenShore', 'line-width', MAX_NORMAL_WIDTH)
        map.setPaintProperty(
          'hiddenShoreSelected',
          'line-width',
          MAX_SELECTED_WIDTH
        )
      } else if (zoom < MIN_ZOOM) {
        map.setPaintProperty('freeShore', 'line-width', MIN_NORMAL_WIDTH)
        map.setPaintProperty(
          'freeShoreSelected',
          'line-width',
          MIN_SELECTED_WIDTH
        )
        map.setPaintProperty('reservedShore', 'line-width', MIN_NORMAL_WIDTH)
        map.setPaintProperty(
          'reservedShoreSelected',
          'line-width',
          MIN_SELECTED_WIDTH
        )
        map.setPaintProperty('cleanedShore', 'line-width', MIN_NORMAL_WIDTH)
        map.setPaintProperty(
          'cleanedShoreSelected',
          'line-width',
          MIN_SELECTED_WIDTH
        )
        map.setPaintProperty('hiddenShore', 'line-width', MIN_NORMAL_WIDTH)
        map.setPaintProperty(
          'hiddenShoreSelected',
          'line-width',
          MIN_SELECTED_WIDTH
        )
      } else {
        const zoomfactor = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)
        const normalzoom =
          MIN_NORMAL_WIDTH + zoomfactor * (MAX_NORMAL_WIDTH - MIN_NORMAL_WIDTH)
        const selectzoom =
          MIN_SELECTED_WIDTH +
          zoomfactor * (MAX_SELECTED_WIDTH - MIN_SELECTED_WIDTH)
        map.setPaintProperty('freeShore', 'line-width', normalzoom)
        map.setPaintProperty('freeShoreSelected', 'line-width', selectzoom)
        map.setPaintProperty('reservedShore', 'line-width', normalzoom)
        map.setPaintProperty('reservedShoreSelected', 'line-width', selectzoom)
        map.setPaintProperty('cleanedShore', 'line-width', normalzoom)
        map.setPaintProperty('cleanedShoreSelected', 'line-width', selectzoom)
        map.setPaintProperty('hiddenShore', 'line-width', normalzoom)
        map.setPaintProperty('hiddenShoreSelected', 'line-width', selectzoom)
      }
    },
    removeSegmentFromLayer(mapname, vuexname, segKey) {
      const newshores = this.$store.state.maplayers[vuexname].filter(e => {
        return e._key !== segKey
      })
      this.$store.commit('store' + vuexname, newshores)
      this.map.getSource(mapname).setData({
        type: 'FeatureCollection',
        features: this.enhanceData(newshores)
      })
    },
    addSegmentToLayer(mapname, vuexname, segData) {
      let newshores = this.$store.state.maplayers[vuexname]
      newshores.push(segData)
      this.$store.commit('store' + vuexname, newshores)
      this.map.getSource(mapname).setData({
        type: 'FeatureCollection',
        features: this.enhanceData(newshores)
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

      this.addShoreClickHandler(
        map,
        'freeShore',
        'freelayer',
        'shore-click',
        '#8595E5'
      )
      if (this.adminmode) {
        this.addShoreClickHandler(
          map,
          'hiddenShore',
          'hiddenlayer',
          'hidden-click',
          '#FFFF77'
        )
      } else {
        this.addShoreClickHandler(
          map,
          'reservedShore',
          'reservedlayer',
          'reserved-click',
          '#FF7575'
        )
        this.addShoreClickHandler(
          map,
          'cleanedShore',
          'cleanlayer',
          'cleaned-click',
          '#00AA33'
        )
      }

      this.$emit('map-loaded', map)

      map.on('zoom', () => {
        this.onZoom(map)
      })
      this.onZoom(map)

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

      if (!this.adminmode) {
        map.on('mouseleave', 'reservedShore', e => {
          canv.style.cursor = 'grab'
        })
        map.on('mouseenter', 'reservedShore', e => {
          canv.style.cursor = 'pointer'
        })
        map.on('mouseenter', 'cleanedShore', e => {
          canv.style.cursor = 'pointer'
        })
        map.on('mouseleave', 'cleanedShore', e => {
          canv.style.cursor = 'grab'
        })
      } else {
        map.on('mouseenter', 'hiddenShore', e => {
          canv.style.cursor = 'pointer'
        })
        map.on('mouseleave', 'hiddenShore', e => {
          canv.style.cursor = 'grab'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.map-view {
  position: relative;
  height: 100vh;
  cursor: pointer;

  .clickdetector {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
  }
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
