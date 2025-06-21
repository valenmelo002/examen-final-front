<template>
  <v-container class="pa-4" style="max-width: 1400px;" fluid>
    <!-- Formulario -->
    <div class="mb-6">
      <v-form ref="formRef">
        <v-row dense>
          <v-col cols="4">
            <v-select
              label="Doctor"
              :items="doctores"
              item-title="nombreCompleto"
              item-value="id"
              v-model="form.doctorId"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              label="Día"
              :items="dias"
              v-model="form.dia"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="Hora inicio"
              type="time"
              v-model="form.horaInicio"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="Hora fin"
              type="time"
              v-model="form.horaFin"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="2">
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
          :message="mode === 'create' ? '¿Desea guardar este horario?' : '¿Desea actualizar este horario?'"
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
      <template v-slot:item.doctor_nombre="{ item }">
        {{ item.doctor_nombre }}
      </template>

      <template v-slot:item.activo="{ item }">
        <v-chip :color="item.activo ? 'green' : 'red'" text-color="white" size="small">
          {{ item.activo ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>

      <template v-slot:item.acciones="{ item }">
        <div class="d-flex ga-1">
          <EditButtonComponent :item="item" @edit="editItem" />
          <DeleteButtonComponent :item="item" resource="horario" @confirm-delete="deleteItem" />
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DoctorHorarioService from '@/services/DoctorHorarioService'
import DoctorService from '@/services/DoctorService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Doctor', key: 'doctor_nombre' },
  { title: 'Día', key: 'dia' },
  { title: 'Hora Inicio', key: 'hora_inicio' },
  { title: 'Hora Fin', key: 'hora_fin' },
  { title: 'Activo', key: 'activo', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false },
])

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const doctores = ref([])
const itemsPerPage = ref(5)
const serverItems = ref([])
const totalItems = ref(0)
const search = ref('')
const currentOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })
const loading = ref(false)
const formRef = ref()
const confirmDialog = ref(false)
const mode = ref<'create' | 'update'>('create')

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
}

const form = ref({
  id: null,
  doctorId: null,
  dia: '',
  horaInicio: '',
  horaFin: '',
  activo: true,
})

function resetForm() {
  form.value = {
    id: null,
    doctorId: null,
    dia: '',
    horaInicio: '',
    horaFin: '',
    activo: true,
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
    let horario

    if (mode.value === 'create') {
      horario = await DoctorHorarioService.create(payload)
    } else {
      horario = await DoctorHorarioService.update(form.value.id!, payload)
    }

    loadItems(currentOptions.value)
    resetForm()
  } catch (e) {
    console.error('Error al guardar horario:', e)
  } finally {
    loading.value = false
  }
}

// ✅ FUNCIÓN ACTUALIZADA
function editItem(item: any) {
  form.value = {
    id: item.id,
    doctorId: item.doctor_id ?? item.doctorId,
    dia: item.dia,
    horaInicio: item.hora_inicio ?? item.horaInicio,
    horaFin: item.hora_fin ?? item.horaFin,
    activo: item.activo === true || item.activo === 1,
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteItem(item: { id: number }) {
  try {
    await DoctorHorarioService.delete(item.id)
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar horario:', error)
  }
}

async function loadItems(options: any) {
  loading.value = true
  currentOptions.value = options
  try {
    const { data, total } = await DoctorHorarioService.getAll({
      page: options.page,
      limit: options.itemsPerPage,
    })

    serverItems.value = data.map((item: any) => ({
      id: item.id,
      doctor_id: item.doctorId,
      doctor_nombre: item.doctor?.nombreCompleto ?? 'Desconocido',
      dia: item.dia,
      hora_inicio: item.horaInicio,
      hora_fin: item.horaFin,
      activo: item.activo === 1,
    }))

    totalItems.value = total
  } catch (e) {
    console.error('Error al cargar horarios:', e)
  } finally {
    loading.value = false
  }
}

async function loadSelects() {
  const res = await DoctorService.getAll({ page: 1, limit: 100 })
  doctores.value = res.data.map((doc: any) => ({
    id: doc.id,
    nombreCompleto: doc.nombreCompleto,
  }))
}

watch(search, () => loadItems(currentOptions.value))
onMounted(() => {
  loadItems(currentOptions.value)
  loadSelects()
})
</script>
