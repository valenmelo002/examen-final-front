<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import WireframeLayout from './layouts/WireframeLayout.vue'

const route = useRoute()
const layouts = { WireframeLayout }
const layout = computed(() => layouts[route.meta.layout])
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
