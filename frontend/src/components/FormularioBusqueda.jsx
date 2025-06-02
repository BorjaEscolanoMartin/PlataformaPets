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
  const [errorFecha, setErrorFecha] = useState('')

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

      autocomplete.addListener('place_changed', () => {        const place = autocomplete.getPlace()
        if (!place.geometry) return

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        setDireccion(place.formatted_address)
        setLatLng({ lat, lng })
      })
    }).catch(() => {
      // Error loading Google Maps
    })
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (entrada && salida && new Date(salida) < new Date(entrada)) {
      setErrorFecha('La fecha de salida no puede ser anterior a la de entrada.')
      return
    }

    setErrorFecha('')

    const params = new URLSearchParams()
    if (especie) params.set('especie', especie)
    if (tamano) params.set('tamano', tamano)
    if (servicio) params.set('servicio', servicio)
    if (direccion) params.set('location', direccion)
    if (entrada) params.set('fecha_entrada', entrada)
    if (salida) params.set('fecha_salida', salida)
    if (latLng) {
      params.set('lat', latLng.lat)
      params.set('lon', latLng.lng)
    }
    navigate(`/cuidadores?${params.toString()}`)
  }
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-4 rounded-2xl shadow-xl border border-blue-100">      {/* Header principal compacto */}      <div className="text-center mb-4 flex items-center justify-center gap-4">
        <img 
          src="/LogoWeb-sinfondo.png" 
          alt="Pet Hosting Logo"
          className="w-22 h-22 object-contain animate-bounce hover:animate-pulse hover:scale-110 transition-all duration-500 cursor-pointer drop-shadow-lg hover:drop-shadow-xl"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '0.5s'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'inline';
          }}
        />
        <PawPrint className="w-8 h-8 text-blue-600 hidden animate-bounce" style={{
          animation: 'float 3s ease-in-out infinite',
          animationDelay: '0.5s'
        }} />
        <div className="text-left">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Encuentra el cuidador perfecto
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Tu mascota merece el mejor cuidado
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-4 space-y-4 max-w-6xl mx-auto border border-blue-100">
        {/* Selección de especie */}
        <div className="text-center">
          <h2 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-2">
            <span className="text-lg">🐾</span>
            ¿Para qué mascota buscas cuidado?
          </h2>
          <div className="flex items-center gap-3 justify-center">
            {['perro', 'gato'].map((tipo) => (
              <label key={tipo} className="cursor-pointer transition-all duration-300 group">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                  especie === tipo
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-blue-200'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
                }`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    especie === tipo 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {especie === tipo && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`text-base font-semibold transition-colors duration-300 capitalize ${
                    especie === tipo 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                      : 'text-gray-700 group-hover:text-blue-600'
                  }`}>
                    {tipo}
                  </span>
                  <input 
                    type="radio" 
                    checked={especie === tipo} 
                    onChange={() => setEspecie(tipo)}
                    className="hidden"
                  />
                </div>
              </label>
            ))}
          </div>
        </div>      {/* Servicios */}
      <div className="border-t border-gray-100 pt-4">
        <div className="text-center mb-3">
          <h3 className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <span className="text-lg">🏠</span>
            Selecciona un tipo de servicio
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {/* eslint-disable-next-line no-unused-vars */}
          {servicios.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setServicio(value)}
              className={`p-2 rounded-xl border-2 transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg ${
                servicio === value 
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 text-purple-700 shadow-purple-200 scale-105' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  servicio === value 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg' 
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`w-3 h-3 ${servicio === value ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className={`leading-tight text-center ${
                  servicio === value 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                    : 'text-gray-700'
                }`}>
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>      {/* Dirección y fechas */}
      <div className="border-t border-gray-100 pt-4">
        <div className="text-center mb-3">
          <h3 className="text-base font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <span className="text-lg">📍</span>
            Ubicación y fechas
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1 space-y-1">
            <label className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-1">
                <span className="text-green-600">🗺️</span>
                Alojamiento cerca de
              </span>
            </label>
            <input
              ref={direccionRef}
              type="text"
              placeholder="Código postal o dirección"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              className="w-full pl-3 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-1">
                <span className="text-blue-600">📅</span>
                Fecha de entrada
              </span>
            </label>
            <input
              type="date"
              value={entrada}
              onChange={e => setEntrada(e.target.value)}
              className="w-full pl-3 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-1">
                <span className="text-purple-600">📅</span>
                Fecha de salida
              </span>
            </label>
            <input
              type="date"
              value={salida}
              onChange={e => setSalida(e.target.value)}
              className="w-full pl-3 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm"
            />
          </div>
        </div>
        {errorFecha && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <p className="text-red-600 text-sm font-medium">{errorFecha}</p>
          </div>
        )}
      </div>      {/* Tamaños y botón de búsqueda */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Sección de tamaños - 70% del espacio en escritorio */}          <div className="w-full lg:w-[70%]">
            <h3 className="text-base font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-2">
              <span className="text-lg">📏</span>
              ¿Cuál es el tamaño de tu mascota?
            </h3>            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {tamaños.map(({ value, label, rango }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTamano(value)}
                  className={`flex flex-col items-center px-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm font-medium min-w-[100px] flex-1 lg:flex-none lg:min-w-[120px] shadow-md hover:shadow-lg hover:scale-105 ${
                    tamano === value 
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-purple-50 text-orange-700 shadow-orange-200 scale-105' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-purple-50'
                  }`}
                ><div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                    tamano === value 
                      ? 'bg-gradient-to-br from-orange-600 to-purple-600' 
                      : 'bg-gray-100'
                  }`}>
                    <span className={`text-sm ${tamano === value ? 'text-white' : 'text-gray-600'}`}>
                      {value === 'pequeño' ? '🐕‍🦺' : value === 'mediano' ? '🐕' : value === 'grande' ? '🐕‍🦮' : '🦮'}
                    </span>
                  </div>                  <span className={`font-bold text-xs ${
                    tamano === value 
                      ? 'bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent' 
                      : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                  <span className="text-xs text-gray-500">{rango}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Botón de búsqueda - 30% del espacio en escritorio */}
          <div className="w-full lg:w-[30%] flex justify-center lg:justify-start">
            <button 
              type="submit" 
              className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-bold px-5 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 min-w-[180px]"
            >
              <span className="text-lg">🔍</span>
              <span>Buscar cuidadores</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
  )
}
