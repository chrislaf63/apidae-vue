<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  label: { type :String, default: '' }
})

const mapEl = ref(null)
let map = null

onMounted(() => {
  map = L.map(mapEl.value).setView([props.lat, props.lon], 15)

  L.tileLayer('https:/{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; contributeurs OpenStreetMap',
    maxZoom: 19
  }).addTo(map)

  const marker = L.marker([props.lat, props.lon]).addTo(map)
  if (props.label) marker.bindPopup(props.label)
})

onUnmounted(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div ref="mapEl" class="map"></div>
</template>

<style scoped>
.map {
  height: 300px;
  width: 85%;
}
</style>