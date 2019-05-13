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
      v-show="selected.id"
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
        hash: true,
        attributionControl: false
      },
      navControl: {
        show: false
      },
      selected: {
        layer: null,
        id: null
      },
      hoveredIds: {}
    }
  },

  methods: {
    generateLineStringStyle(basecolor, hovercolor) {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          //'line-color': color,
          'line-color': [
            'case',
            [
              'any',
              ['boolean', ['feature-state', 'hover'], false],
              ['boolean', ['feature-state', 'selected'], false]
            ],
            hovercolor,
            basecolor
          ],
          'line-width': 1
        }
      }
    },
    enhanceData(data) {
      //apparently without this the data format is somehow wrong
      return data.map(e => ({
        ...e,
        id: e._key,
        properties: { ...e.properties, key: e._key }
      }))
    },
    addShoreType(map, name, data, basecolor, hovercolor) {
      const shoreData = {
        type: 'FeatureCollection',
        features: this.enhanceData(data)
      }

      map.addSource(name, { type: 'geojson', data: shoreData })
      map.addLayer({
        id: name,
        type: 'line',
        source: name,
        ...this.generateLineStringStyle(basecolor, hovercolor)
      })
    },
    addShoreClickHandler(map, layername, eventname) {
      map.on('click', layername, e => {
        this.selectShore(e.features[0].id, layername)
        this.$emit(eventname, e.features[0].properties)

        map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 17 })
      })
    },
    selectShore(id, layername) {
      this.selected.layer = layername
      this.selected.id = id
      this.map.setFeatureState(
        { source: layername, id: id },
        { selected: true }
      )
    },
    detectorClick() {
      this.$emit('unselect')
      this.unSelect()
    },
    unSelect() {
      this.map.setFeatureState(
        { source: this.selected.layer, id: this.selected.id },
        { selected: false }
      )
      this.selected.layer = null
      this.selected.id = null
    },
    onZoom(map) {
      const MAX_ZOOM = 20
      const MIN_ZOOM = 11
      const MAX_WIDTH = 22
      const MIN_WIDTH = 2

      const zoom = map.getZoom()
      if (zoom >= MAX_ZOOM) {
        map.setPaintProperty('freeShore', 'line-width', MAX_WIDTH)
        map.setPaintProperty('reservedShore', 'line-width', MAX_WIDTH)
        map.setPaintProperty('cleanedShore', 'line-width', MAX_WIDTH)
        map.setPaintProperty('hiddenShore', 'line-width', MAX_WIDTH)
      } else if (zoom < MIN_ZOOM) {
        map.setPaintProperty('freeShore', 'line-width', MIN_WIDTH)
        map.setPaintProperty('reservedShore', 'line-width', MIN_WIDTH)
        map.setPaintProperty('cleanedShore', 'line-width', MIN_WIDTH)
        map.setPaintProperty('hiddenShore', 'line-width', MIN_WIDTH)
      } else {
        const zoomfactor = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)
        const width = MIN_WIDTH + zoomfactor * (MAX_WIDTH - MIN_WIDTH)
        map.setPaintProperty('freeShore', 'line-width', width)
        map.setPaintProperty('reservedShore', 'line-width', width)
        map.setPaintProperty('cleanedShore', 'line-width', width)
        map.setPaintProperty('hiddenShore', 'line-width', width)
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
    addHoverHandler(canvas, layername) {
      this.map.on('mousemove', layername, e => {
        canvas.style.cursor = 'pointer'
        if (this.hoveredIds[layername]) {
          this.map.setFeatureState(
            { source: layername, id: this.hoveredIds[layername] },
            { hover: false }
          )
        }
        this.hoveredIds[layername] = e.features[0].id
        this.map.setFeatureState(
          { source: layername, id: this.hoveredIds[layername] },
          { hover: true }
        )
      })
      this.map.on('mouseleave', layername, e => {
        canvas.style.cursor = 'grab'
        if (this.hoveredIds[layername]) {
          this.map.setFeatureState(
            { source: layername, id: this.hoveredIds[layername] },
            { hover: false }
          )
        }
        this.hoveredIds[layername] = null
      })
    },
    mapLoaded(map) {
      map.addControl(
        new mapboxgl.AttributionControl({ compact: false }),
        'bottom-right'
      )
      this.map = map

      this.addShoreType(map, 'freeShore', this.freeshores, '#2e318e', '#00a0ff')
      this.addShoreType(
        map,
        'reservedShore',
        this.reservedshores,
        '#f82828',
        '#ffb1b7'
      )
      this.addShoreType(
        map,
        'cleanedShore',
        this.cleanedshores,
        '#006B32',
        '#599053'
      )
      if (this.adminmode) {
        this.addShoreType(
          map,
          'hiddenShore',
          this.hiddenshores,
          '#f0e41a',
          '#FFFF77'
        )
      }

      this.addShoreClickHandler(map, 'freeShore', 'free-click')
      if (this.adminmode) {
        this.addShoreClickHandler(map, 'hiddenShore', 'hidden-click')
      } else {
        this.addShoreClickHandler(map, 'reservedShore', 'reserved-click')
        this.addShoreClickHandler(map, 'cleanedShore', 'cleaned-click')
      }

      this.$emit('map-loaded', map)

      map.on('zoom', () => {
        this.onZoom(map)
      })
      map.on('touchstart', e => {
        alert('s')
      })
      this.onZoom(map)

      // disable map rotation using right click + drag
      map.dragRotate.disable()

      // disable map rotation using touch rotation gesture
      map.touchZoomRotate.disableRotation()
      const canv = map.getCanvas()
      this.addHoverHandler(canv, 'freeShore')

      if (!this.adminmode) {
        this.addHoverHandler(canv, 'reservedShore')
        this.addHoverHandler(canv, 'cleanedShore')
      } else {
        this.addHoverHandler(canv, 'hiddenShore')
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

  .mapboxgl-ctrl-bottom-right {
    bottom: 80px;
    right: 210px;

    @media only screen and (max-width: 768px) {
      bottom: 64px;
    }

    .mapbox-improve-map {
      display: none;
    }
  }
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
