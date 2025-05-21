import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, PawPrint, Sun, Home, MapPin } from 'lucide-react'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function FormularioBusqueda() {
  const navigate = useNavigate()
  const [especie, setEspecie] = useState('perro')
  const [tamano, setTamano] = useState('')
  const [servicio, setServicio] = useState('')
  const [direccion, setDireccion] = useState('')
  const [entrada, setEntrada] = useState('')
  const [salida, setSalida] = useState('')
  const [latLng, setLatLng] = useState(null)
  const direccionRef = useRef(null)

  const servicios = [
    { value: 'alojamiento', label: 'Alojamiento de mascotas', icon: CalendarDays },
    { value: 'cuidado_a_domicilio', label: 'Cuidado a domicilio', icon: Home },
    { value: 'visitas_a_domicilio', label: 'Visitas a domicilio', icon: MapPin },
    { value: 'guarderia', label: 'Guardería de día', icon: Sun },
    { value: 'paseo', label: 'Paseo de perros', icon: PawPrint },
  ]

  const tamaños = [
    { value: 'pequeño', label: 'Pequeño', rango: '0 – 7 kg' },
    { value: 'mediano', label: 'Mediano', rango: '7 – 18 kg' },
    { value: 'grande', label: 'Grande', rango: '18 – 45 kg' },
    { value: 'gigante', label: 'Gigante', rango: '45+ kg' },
  ]

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!direccionRef.current) return

      const autocomplete = new window.google.maps.places.Autocomplete(direccionRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'es' },
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry) return

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        setDireccion(place.formatted_address)
        setLatLng({ lat, lng })
      })
    }).catch(console.error)
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (especie) params.set('especie', especie)
    if (tamano) params.set('tamano', tamano)
    if (servicio) params.set('servicio', servicio)
    if (direccion) params.set('direccion', direccion)
    if (entrada) params.set('entrada', entrada)
    if (salida) params.set('salida', salida)
    if (latLng) {
      params.set('lat', latLng.lat)
      params.set('lon', latLng.lng)
    }
    navigate(`/cuidadores?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-3 max-w-xl mx-auto">
      <div className="flex items-center gap-4 justify-center">
        <span className="font-medium">Estoy buscando un servicio para mi:</span>
        <label className="inline-flex items-center gap-2">
          <input type="radio" checked={especie === 'perro'} onChange={() => setEspecie('perro')} />
          Perro
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" checked={especie === 'gato'} onChange={() => setEspecie('gato')} />
          Gato
        </label>
      </div>

      {/* Todos los servicios en una fila */}
      <div className="text-center">
        <p className="text-sm font-semibold mb-2">Selecciona un tipo de servicio</p>
        <div className="flex flex-wrap justify-center gap-3">
          {/* eslint-disable-next-line no-unused-vars */}
          {servicios.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setServicio(value)}
              className={`min-w-[8rem] px-4 py-3 rounded border shadow-sm text-sm ${
                servicio === value ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'
              }`}
            >
              <span className="flex items-center gap-2 justify-center">
                <Icon className="w-5 h-5" />
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dirección y fechas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Alojamiento cerca de</label>
          <input
            ref={direccionRef}
            type="text"
            placeholder="Código postal o dirección"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Entrada</label>
          <input
            type="date"
            value={entrada}
            onChange={e => setEntrada(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Salida</label>
          <input
            type="date"
            value={salida}
            onChange={e => setSalida(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Tamaños y botón de búsqueda en una fila */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_auto] items-end justify-center gap-6">
        <div>
          <p className="text-sm font-semibold mb-2">Mi perro es</p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {tamaños.map(({ value, label, rango }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTamano(value)}
                className={`flex flex-col items-center px-4 py-3 rounded border shadow-sm text-sm ${
                  tamano === value ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'
                }`}
              >
                <span className="font-medium">{label}</span>
                <span className="text-xs text-gray-500">{rango}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center md:text-right mt-4 md:mt-0">
          <button type="submit" className="bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-blue-700">
            Buscar
          </button>
        </div>
      </div>
    </form>
  )
}
