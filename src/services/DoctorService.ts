const URL = 'http://localhost:3333/doctores'

export default class DoctorService {
  static async getAll({ page = 1, limit = 10, nombre = '' }) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}?page=${page}&limit=${limit}&nombre=${nombre}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al cargar los doctores')
    return await response.json()
  }

  static async getById(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al cargar el doctor')
    return await response.json()
  }

  static async create(data: any) {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('Error al crear el doctor')
    return await response.json()
  }

  static async update(id: number, data: any) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('Error al actualizar el doctor')
    return await response.json()
  }

  static async delete(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al eliminar el doctor')
    return true
  }
}
