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
  props: ['data','data2','data3'],
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
    generateLineStringStyle() {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#475DCC',
          'line-width': 1
        }
      }
    },
    generateLineStringStyle2() {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 1
        }
      }
    },
    generateLineStringStyle3() {
      return {
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#006625',
          'line-width': 5
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
      var data = {
        type: 'FeatureCollection',
        features: enhancedData2
      }
      this.map = map;
      map.addSource('shore2', { type: 'geojson', data:  data });
      map.addLayer({
        id: 'shore2',
        type: 'line',
        source: 'shore2',
        ...this.generateLineStringStyle2()
      })
      data = {
        type: 'FeatureCollection',
        features: enhancedData
      }
      map.addSource('shore', { type: 'geojson', data:  data });

      map.addLayer({
        id: 'shore',
        type: 'line',
        source: 'shore',
        ...this.generateLineStringStyle()
      })
      data = {
        type: 'FeatureCollection',
        features: enhancedData3
      }
      map.addSource('shore3', { type: 'geojson', data:  data });

      map.addLayer({
        id: 'shore3',
        type: 'line',
        source: 'shore3',
        ...this.generateLineStringStyle3()
      })

      this.$emit('map-loaded', map)

      map.on('zoom', function() {
        if (map.getZoom() > 15) {
          map.setPaintProperty('shore', 'line-width', 15)
          map.setPaintProperty('shore2', 'line-width', 15)
          map.setPaintProperty('shore3', 'line-width', 15)

        }
        else if (map.getZoom() > 13) {
          map.setPaintProperty('shore', 'line-width', 5)
          map.setPaintProperty('shore2', 'line-width', 5)
          map.setPaintProperty('shore3', 'line-width', 5)

        } else {
          map.setPaintProperty('shore', 'line-width', 1)
          map.setPaintProperty('shore2', 'line-width', 1)
          map.setPaintProperty('shore3', 'line-width', 1)

        }
      })

      map.on('click', 'shore', e => {
        this.$emit('shore-click', e.features[0].properties)
        map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 17 })
      })
      map.on('click', 'shore2', e => {
        this.$emit('shore-click', e.features[0].properties)
        map.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 17 })
      })

      const canv = map.getCanvas();
      map.on("mouseenter", "shore", e => {
        canv.style.cursor = "pointer";
      })
      map.on("mouseleave", "shore", e => {
        canv.style.cursor = "grab";
      })
      map.on("mouseenter", "shore2", e => {
        canv.style.cursor = "pointer";
      })
      map.on("mouseleave", "shore2", e => {
        canv.style.cursor = "grab";
      })
    }
  }
}
</script>

<style lang="scss" >
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

.mapboxgl-canvas-container.mapboxgl-interactive, .mapboxgl-ctrl-group > button.mapboxgl-ctrl-compass {
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
