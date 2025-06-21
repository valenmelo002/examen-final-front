<template>
  <v-btn icon size="small" color="primary" @click="handleClick">
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps<{ item: any }>()
const emit = defineEmits(['edit'])

function handleClick() {
  emit('edit', props.item)
}
</script>
