// Copyright (C) 2019 Digitalents Helsinki

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
        'pk.eyJ1Ijoic2F0YWtvbGt5dCIsImEiOiJjanY4MHB2MXQwYWN6M3lwa2xlZDdzMmY0In0.2H2gSyrO7PpTUcYN4qPbJg',
      mapOptions: {
        style: 'mapbox://styles/satakolkyt/cjv80rnwr02lu1fo4y7gxcldj',
        center: [25.014, 60.188],
        zoom: 11.4,
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: false,
        hash: true,
        attributionControl: false
      },
      navControl: {
        show: true,
        position: 'top-right'
      },
      selected: {
        layer: null,
        id: null
      },
      hoveredIds: {}
    }
  },
  methods: {
    enhanceData(data) {
      for (let e of data) {
        e.id = e._key
        e.properties.key = e._key
      }
      return data
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
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
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
      })
    },
    addShoreClickHandler(map, shoretype) {
      map.on('click', shoretype + 'Shore', e => {
        //shoretype was clicked on, so it was selected
        this.unRenderSelected()

        const clickedShore = e.features[0]
        const clickpos = [e.lngLat.lng, e.lngLat.lat]

        //highlight clicked feature:
        this.renderSelected(clickedShore.id, shoretype + 'Shore')

        //zoom to on map where we clicked:
        map.flyTo({ center: clickpos, zoom: 15 })

        //let parent know:
        this.$emit(shoretype + '-click', clickedShore.properties)
      })
    },
    renderSelected(id, layername) {
      this.selected.layer = layername
      this.selected.id = id
      this.map.setFeatureState(
        { source: layername, id: id },
        { selected: true }
      )
    },
    unRenderSelected() {
      if (this.selected.id) {
        this.map.setFeatureState(
          { source: this.selected.layer, id: this.selected.id },
          { selected: false }
        )
        this.selected.layer = null
        this.selected.id = null
      }
    },
    onZoom(map) {
      const MAX_ZOOM = 20
      const MIN_ZOOM = 11
      const MAX_WIDTH = 22
      const MIN_WIDTH = 4

      const zoom = map.getZoom()
      if (zoom >= MAX_ZOOM) {
        map.setPaintProperty('freeShore', 'line-width', MAX_WIDTH)
        map.setPaintProperty('reservedShore', 'line-width', MAX_WIDTH)
        map.setPaintProperty('cleanedShore', 'line-width', MAX_WIDTH)
        if (this.adminmode) {
          map.setPaintProperty('hiddenShore', 'line-width', MAX_WIDTH)
        }
      } else if (zoom < MIN_ZOOM) {
        map.setPaintProperty('freeShore', 'line-width', MIN_WIDTH)
        map.setPaintProperty('reservedShore', 'line-width', MIN_WIDTH)
        map.setPaintProperty('cleanedShore', 'line-width', MIN_WIDTH)
        if (this.adminmode) {
          map.setPaintProperty('hiddenShore', 'line-width', MIN_WIDTH)
        }
      } else {
        const zoomfactor = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)
        const width = MIN_WIDTH + zoomfactor * (MAX_WIDTH - MIN_WIDTH)
        map.setPaintProperty('freeShore', 'line-width', width)
        map.setPaintProperty('reservedShore', 'line-width', width)
        map.setPaintProperty('cleanedShore', 'line-width', width)
        if (this.adminmode) {
          map.setPaintProperty('hiddenShore', 'line-width', width)
        }
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
      this.map = map
      map.addControl(
        new mapboxgl.AttributionControl({ compact: false }),
        'bottom-right'
      )

      this.addShoreType(map, 'freeShore', this.freeshores, '#f82828', '#ffb1b7')
      this.addShoreType(
        map,
        'reservedShore',
        this.reservedshores,
        '#fda218',
        '#eee350'
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
          '#2e318e',
          '#00a0ff'
        )
      }

      this.addShoreClickHandler(map, 'free')
      if (this.adminmode) {
        this.addShoreClickHandler(map, 'hidden')
      } else {
        this.addShoreClickHandler(map, 'reserved')
        this.addShoreClickHandler(map, 'cleaned')
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
  height: 100%;
  cursor: pointer;

  .clickdetector {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
  }
}
#map {
  height: 100vh;
  width: 100%;
}

.mapboxgl-ctrl-bottom-right {
  bottom: 80px;
  right: 220px;

  @media only screen and (max-width: 768px) {
    bottom: 64px;
  }

  .mapbox-improve-map {
    display: none;
  }
}

.mapboxgl-ctrl-top-right {
  top: 90px;
  right: 5vw;

  .mapboxgl-ctrl {
    width: 50px;

    .mapboxgl-ctrl-zoom-in,
    .mapboxgl-ctrl-zoom-out {
      height: 50px;
    }

    .mapboxgl-ctrl-compass {
      display: none;
    }
  }
}

.mapboxgl-canvas-container.mapboxgl-interactive {
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
