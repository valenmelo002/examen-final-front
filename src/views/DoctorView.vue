<template>
  <v-container class="pa-4" style="max-width: 1400px;" fluid>
    <!-- Formulario -->
    <div class="mb-6">
      <v-form ref="formRef">
        <v-row dense>
          <v-col cols="4">
            <v-text-field label="Nombre completo" v-model="form.nombre_completo" :rules="[rules.required, rules.minName, rules.maxName]" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Documento" v-model="form.documento" :rules="[rules.required, rules.minDoc, rules.maxDoc]" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Correo" v-model="form.correo" :rules="[rules.required, rules.email]" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Teléfono" v-model="form.telefono" :rules="[rules.required, rules.minPhone, rules.maxPhone]" />
          </v-col>
          <v-col cols="4">
            <v-select
              label="Especialidad"
              :items="especialidades"
              item-title="nombre"
              item-value="id"
              v-model="form.especialidad_id"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <v-switch v-model="form.activo" label="Activo" />
          </v-col>
        </v-row>

        <div class="mt-4">
          <v-btn color="primary" @click="checkFormBeforeConfirm" :loading="loading" class="mr-2">
            {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
          </v-btn>
          <v-btn @click="resetForm">Cancelar</v-btn>
        </div>

        <ConfirmDialog
          v-model="confirmDialog"
          :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
          :message="mode === 'create' ? '¿Desea guardar este doctor?' : '¿Desea actualizar la información de este doctor?'"
          @confirm="submit"
          @cancel="confirmDialog = false"
        />
      </v-form>
    </div>

    <!-- Tabla -->
    <v-data-table-server
      class="mt-8"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.nombre_completo="{ item }">
        {{ item.nombre_completo }}
      </template>

      <template v-slot:item.especialidad="{ item }">
        {{ item.especialidad }}
      </template>

      <template v-slot:item.activo="{ item }">
        <v-chip :color="item.activo ? 'green' : 'red'" text-color="white" size="small">
          {{ item.activo ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>

      <template v-slot:item.acciones="{ item }">
        <div class="d-flex ga-1">
          <EditButtonComponent :item="item" @edit="editItem" />
          <DeleteButtonComponent :item="item" resource="doctor" @confirm-delete="deleteItem" />
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DoctorService from '@/services/DoctorService'
import EspecialidadService from '@/services/EspecialidadService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

// Tabla
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre_completo' },
  { title: 'Documento', key: 'documento' },
  { title: 'Correo', key: 'correo' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Especialidad', key: 'especialidad', sortable: false },
  { title: 'Activo', key: 'activo', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false },
])

const itemsPerPage = ref(5)
const serverItems = ref([])
const totalItems = ref(0)
const search = ref('')
const currentOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })
const loading = ref(false)
const formRef = ref()

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  minName: (v: string) => v.length >= 3 || 'Mínimo 3 caracteres',
  maxName: (v: string) => v.length <= 20 || 'Máximo 20 caracteres',
  minDoc: (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
  maxDoc: (v: string) => v.length <= 15 || 'Máximo 15 caracteres',
  minPhone: (v: string) => v.length >= 7 || 'Mínimo 7 caracteres',
  maxPhone: (v: string) => v.length <= 15 || 'Máximo 15 caracteres',
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Correo inválido',
}

const mode = ref<'create' | 'update'>('create')
const confirmDialog = ref(false)
const especialidades = ref([])

const form = ref({
  id: null,
  nombre_completo: '',
  documento: '',
  correo: '',
  telefono: '',
  activo: true,
  especialidad_id: null,
})

function resetForm() {
  form.value = {
    id: null,
    nombre_completo: '',
    documento: '',
    correo: '',
    telefono: '',
    activo: true,
    especialidad_id: null,
  }
  mode.value = 'create'
}

function checkFormBeforeConfirm() {
  formRef.value?.validate().then((valid: boolean) => {
    if (valid) confirmDialog.value = true
  })
}

async function submit() {
  confirmDialog.value = false
  loading.value = true
  try {
    const payload = { ...form.value }
    if (mode.value === 'create') await DoctorService.create(payload)
    else await DoctorService.update(form.value.id!, payload)
    resetForm()
    loadItems(currentOptions.value)
  } catch (e) {
    console.error('Error al guardar doctor:', e)
  } finally {
    loading.value = false
  }
}

function editItem(item: any) {
  form.value = {
    id: item.id ?? null,
    nombre_completo: item.nombre_completo ?? '',
    documento: item.documento ?? '',
    correo: item.correo ?? '',
    telefono: item.telefono ?? '',
    activo: item.activo ?? true,
    especialidad_id: item.especialidad_id ?? null,
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


async function deleteItem(item: { id: number }) {
  try {
    await DoctorService.delete(item.id)
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar doctor:', error)
  }
}

async function loadItems(options: any) {
  loading.value = true
  currentOptions.value = options
  try {
    const { data, total } = await DoctorService.getAll({
      page: options.page,
      limit: options.itemsPerPage,
    })

    serverItems.value = data.map((item: any) => ({
      id: item.id,
      nombre_completo: item.nombreCompleto ?? '',
      documento: item.documento ?? '',
      correo: item.correo ?? '',
      telefono: item.telefono ?? '',
      especialidad_id: item.especialidadId ?? null,
      especialidad: item.especialidad?.nombre ?? 'Sin asignar',
      activo: item.activo === 1, // Asegura que sea booleano
    }))

    totalItems.value = total
  } catch (e) {
    console.error('Error al cargar doctores:', e)
  } finally {
    loading.value = false
  }
}


async function loadSelects() {
  especialidades.value = await EspecialidadService.getAll()
}

watch(search, () => loadItems(currentOptions.value))
onMounted(() => {
  loadItems(currentOptions.value)
  loadSelects()
})
</script>
