import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'
import MapaGoogle from './MapaGoogle'

export default function Cuidadores() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cuidadores, setCuidadores] = useState([])
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Filtros desde la URL
  const especie = searchParams.get('especie') || ''
  const tamaño = searchParams.get('tamano') || ''
  const serviciosSeleccionados = searchParams.getAll('servicio')

  // Cargar cuidadores con filtros
  useEffect(() => {
    const fetchCuidadores = async () => {
      try {
        const query = []
        if (especie) query.push(`especie=${especie}`)
        if (tamaño) query.push(`tamano=${tamaño}`)
        serviciosSeleccionados.forEach(s => {
          query.push(`servicio=${encodeURIComponent(s)}`)
        })

        const res = await api.get(`/cuidadores${query.length ? `?${query.join('&')}` : ''}`)
        setCuidadores(res.data)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los cuidadores.')
      }
    }

    fetchCuidadores()
  }, [especie, tamaño, serviciosSeleccionados.join()])

  // Actualizar select de especie o tamaño
  const actualizarFiltro = (clave, valor) => {
    const nuevosParams = new URLSearchParams(searchParams)
    if (valor) {
      nuevosParams.set(clave, valor)
    } else {
      nuevosParams.delete(clave)
    }
    setSearchParams(nuevosParams)
  }

  // Alternar servicios (checkbox)
  const toggleServicio = (valor) => {
    const nuevos = new URLSearchParams(searchParams)
    const actuales = nuevos.getAll('servicio')

    if (actuales.includes(valor)) {
      const actualizados = actuales.filter(s => s !== valor)
      nuevos.delete('servicio')
      actualizados.forEach(s => nuevos.append('servicio', s))
    } else {
      nuevos.append('servicio', valor)
    }

    setSearchParams(nuevos)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cuidadores disponibles</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Tipo de mascota</label>
          <select
            value={especie}
            onChange={e => actualizarFiltro('especie', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Todas</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Tamaño</label>
          <select
            value={tamaño}
            onChange={e => actualizarFiltro('tamano', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
            <option value="gigante">Gigante</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Servicios ofrecidos</label>
          <div className="flex flex-wrap gap-3 border rounded px-3 py-2">
            {['paseo', 'guardería', 'alojamiento', 'cuidado a domicilio', 'visitas a domicilio'].map((serv) => (
              <label key={serv} className="inline-flex items-center gap-2 text-sm capitalize">
                <input
                  type="checkbox"
                  checked={serviciosSeleccionados.includes(serv)}
                  onChange={() => toggleServicio(serv)}
                />
                {serv}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {(serviciosSeleccionados.length > 0 || especie || tamaño) && (
        <div className="text-sm text-gray-500 mb-4">
          <p><strong>Filtros activos:</strong></p>
          {serviciosSeleccionados.map((s, i) => (
            <p key={`serv-${i}`}>- Servicio: {s}</p>
          ))}
          {especie && <p>- Especie: {especie}</p>}
          {tamaño && <p>- Tamaño: {tamaño}</p>}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Listado de cuidadores */}
        <ul className="space-y-3">
          {cuidadores.length === 0 && !error && (
            <p className="text-gray-600">No se encontraron cuidadores con esos filtros.</p>
          )}

          {cuidadores.map(cuidador => (
            <li key={cuidador.id} className="bg-white p-4 rounded shadow">
              <p className="text-lg font-semibold text-gray-800">{cuidador.name}</p>
              <p className="text-sm text-gray-600 mb-2">{cuidador.email}</p>

              <div className="flex flex-wrap gap-2 mb-2">
                {cuidador.especie_preferida?.map((tipo, idx) => (
                  <span key={`esp-${cuidador.id}-${idx}`} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </span>
                ))}
                {cuidador.tamanos_aceptados?.map((t, idx) => (
                  <span key={`tam-${cuidador.id}-${idx}`} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                ))}
                {cuidador.servicios_ofrecidos?.map((s, idx) => (
                  <span key={`serv-${cuidador.id}-${idx}`} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                ))}
              </div>

              <div className="mt-2">
                <button
                  onClick={() => {
                    const ruta = `/cuidadores/${cuidador.id}`
                    if (!user) localStorage.setItem('redirectAfterLogin', ruta)
                    navigate(ruta)
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver perfil →
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Mapa con cuidadores */}
        <MapaGoogle cuidadores={cuidadores} />
      </div>
    </div>
  )
}
