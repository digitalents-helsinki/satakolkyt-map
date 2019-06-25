// Copyright (C) 2019 Digitalents Helsinki

<template>
  <div class="map-view">
    <map-box
      :access-token="accessToken"
      :map-options="mapOptions"
      :nav-control="navControl"
      @map-load="mapLoaded"
      ref="map"
    />
  </div>
</template>

<script>
/* eslint-disable */
import MapBox from 'mapbox-gl-vue'
import libraries from '../libraries.json'
import trashbins from '../roskikset_wgs84.json'

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
        attributionControl: false,
        logoPosition: 'top-left'
      },
      navControl: {
        show: true,
        position: 'top-right'
      },
      selected: [],
      hoveredIds: {},
      vh: 0,
      trashmarkers: null
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
        //remove highlighting on all shores if we clicked on a non-free, non-reserved shore or
        //if a non-free, non-reserved shore was already highlighted
        if (
          this.selected[0] &&
          ((shoretype !== 'free' && shoretype !== 'reserved') ||
            (this.selected[0].layer !== 'freeShore' &&
              this.selected[0].layer !== 'reservedShore'))
        ) {
          this.unHighlightAll()
        }

        const clickedShore = e.features[0]
        const clickpos = [e.lngLat.lng, e.lngLat.lat]

        //zoom to on map where we clicked:
        map.flyTo({ center: clickpos, zoom: 15 })

        //let parent know:
        this.$emit(shoretype + '-click', clickedShore.properties)
      })
    },
    highlight(id, layername) {
      this.selected.push({ id: id, layer: layername })
      this.map.setFeatureState(
        { source: layername, id: id },
        { selected: true }
      )
    },
    unHighlight(id) {
      const newlist = []
      for (let s of this.selected) {
        if (id === s.id) {
          this.map.setFeatureState(
            { source: s.layer, id: s.id },
            { selected: false }
          )
        } else {
          newlist.push(s)
        }
      }
      this.selected = newlist
    },
    unHighlightAll() {
      for (let s of this.selected) {
        this.map.setFeatureState(
          { source: s.layer, id: s.id },
          { selected: false }
        )
      }
      this.selected = []
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
      map.resize()
      window.addEventListener('resize', () => {
        map.resize()
      })

      //Add library/equipment loan markers
      for (let lib of libraries) {
        const el = document.createElement('div')
        el.className = 'marker'
        //el.innerHTML = '&#128214;'
        //el.innerHTML = '&#128295;'
        const pop = new mapboxgl.Popup({
          closeButton: false,
          maxWidth: '320px'
        }).setHTML(`
          <h1>Talkootarvikkeiden lainaus</h1>
          <h2>${lib.name}</h2>
          <h3>${lib.address}</h3>
          <h3>&#128231; ${lib.email}</h3>
          <h3>&#128222; ${lib.phone}</h3>
          <a href="${
            lib.site
          }" target="_blank">Lisätietoja, kuten aukioloajat, löydät kirjaston sivuilta</a>
        `)
        new mapboxgl.Marker(el)
          .setLngLat([lib.coords.long, lib.coords.lat])
          .setPopup(pop)
          .addTo(map)
      }

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
    },
    addTrashBins() {
      if (this.trashmarkers) {
        for (let m of this.trashmarkers) {
          m.addTo(this.map)
        }
      } else {
        this.trashmarkers = []
        const bins = trashbins.features
        for (let i = 0; i < bins.length; i++) {
          const el = document.createElement('div')
          el.className = 'trashbin'
          el.innerHTML = '&#128465;'
          const mark = new mapboxgl.Marker(el)
            .setLngLat(bins[i].geometry.coordinates)
            .addTo(this.map)
          this.trashmarkers[i] = mark
        }
      }
    },
    removeTrashBins() {
      for (let m of this.trashmarkers) {
        m.remove()
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

  .marker {
    cursor: pointer;
    //padding-top: 4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 3px dotted #ddc;
    //background-color: #eee350;
    background-color: #933486;
    //font-size: 19px;
    //font-weight: bold;
    //text-align: center;
  }

  .trashbin {
    font-size: 14px;
    padding: 0px 2px;
    border: 1px solid black;
    border-radius: 5px;
    background-color: white;
  }

  .mapboxgl-popup-content {
    min-width: 200px;
    padding: 20px;
    background-color: #eee350;
    cursor: default;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

    h1 {
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 20px;
    }

    h3 {
      font-size: 16px;
      margin: 8px 0;
    }

    a {
      display: block;
      margin-top: 15px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .mapboxgl-popup-tip {
    //border-top-color: #555;
    border-top-color: #eee350;
  }
}
#map {
  width: 100%;
  height: 100%;
}

.mapboxgl-ctrl-bottom-right {
  bottom: 80px;
  right: 220px;

  @media only screen and (max-width: 768px) {
    bottom: 64px;
  }
}

.mapboxgl-ctrl-top-left {
  top: 80px;
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
