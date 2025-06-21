const URL = 'http://localhost:3333/especialidades'

export default class EspecialidadService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al cargar las especialidades')
    return await response.json()
  }
}
