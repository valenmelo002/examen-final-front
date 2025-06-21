<template>
  <div>
    <v-btn icon size="small" color="error" @click="openDialog">
      <v-icon size="small">mdi-delete</v-icon>
    </v-btn>

    <ConfirmDialog
      v-model="showDialog"
      :title="`¿Eliminar ${resource}?`"
      :message="`¿Estás seguro de que deseas eliminar este ${resource}?`"
      @confirm="confirmDelete"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/ModalComponent.vue'

const props = defineProps<{
  item: { id: number }
  resource: string
}>()

const emit = defineEmits<{
  (e: 'confirm-delete', item: { id: number }): void
}>()

const showDialog = ref(false)

function openDialog() {
  showDialog.value = true
}

function confirmDelete() {
  emit('confirm-delete', props.item)
  showDialog.value = false
}
</script>
