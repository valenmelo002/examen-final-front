const API_URL = 'http://localhost:3333/doctor_horarios'

export default class DoctorHorarioService {
  static async getToken() {
    return localStorage.getItem('token')
  }

  static async getAll(params = {}) {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${await this.getToken()}`
      },
    })

    if (!response.ok) throw new Error('Error al cargar horarios')
    return await response.json()
  }

  static async getByDoctorId(doctorId: number) {
    const response = await fetch(`${API_URL}?doctor_id=${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) throw new Error('Error al cargar horarios del doctor')
    return await response.json()
  }

  static async create(data: any) {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('Error al crear horario')
    return await response.json()
  }

  static async update(id: number, data: any) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('Error al actualizar horario')
    return await response.json()
  }

  static async delete(id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) throw new Error('Error al eliminar horario')
    return await response.json()
  }
}
