import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FormularioBusqueda() {
  const navigate = useNavigate()
  const [especie, setEspecie] = useState('')
  const [tamano, setTamano] = useState('')
  const [servicio, setServicio] = useState('')
  const [direccion, setDireccion] = useState('')

  const handleSubmit = e => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (especie) params.set('especie', especie)
    if (tamano) params.set('tamano', tamano)
    if (servicio) params.set('servicio', servicio)
    if (direccion) params.set('direccion', direccion)

    navigate(`/cuidadores?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold">Buscar cuidadores</h2>

      <div>
        <label className="block mb-1 font-medium">Especie</label>
        <select value={especie} onChange={e => setEspecie(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="">-- Selecciona --</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Tamaño aceptado</label>
        <select value={tamano} onChange={e => setTamano(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="">-- Selecciona --</option>
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
          <option value="gigante">Gigante</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Tipo de servicio</label>
        <select value={servicio} onChange={e => setServicio(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="">-- Selecciona --</option>
          <option value="paseo">Paseo</option>
          <option value="alojamiento">Alojamiento</option>
          <option value="guarderia">Guardería</option>
          <option value="cuidado_a_domicilio">Cuidado a domicilio</option>
          <option value="visitas_a_domicilio">Visitas a domicilio</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Dirección / ciudad</label>
        <input
          type="text"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Buscar
      </button>
    </form>
  )
}
