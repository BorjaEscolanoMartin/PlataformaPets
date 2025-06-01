import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'
import { useModal } from '../hooks/useModal'
import MapaGoogle from './MapaGoogle'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function Cuidadores() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cuidadores, setCuidadores] = useState([])
  const [error, setError] = useState(null)
  const [direccion, setDireccion] = useState('')
  const { user } = useAuth()
  const { openLogin } = useModal()
  const navigate = useNavigate()
  const [errorFecha, setErrorFecha] = useState('')

  const autocompleteRef = useRef(null)

  const especie = searchParams.get('especie') || ''
  const tamaño = searchParams.get('tamano') || ''
  const serviciosSeleccionados = searchParams.getAll('servicio')
  const fechaEntrada = searchParams.get('fecha_entrada') || ''
  const fechaSalida = searchParams.get('fecha_salida') || ''
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  const servicios = [
    { value: 'paseo', label: 'Paseo' },
    { value: 'guarderia', label: 'Guardería' },
    { value: 'alojamiento', label: 'Alojamiento' },
    { value: 'cuidado_a_domicilio', label: 'Cuidado a domicilio' },
    { value: 'visitas_a_domicilio', label: 'Visitas a domicilio' },
  ]

  useEffect(() => {
    if (fechaEntrada && fechaSalida && new Date(fechaSalida) < new Date(fechaEntrada)) {
      setErrorFecha('La fecha de salida no puede ser anterior a la de entrada.')
    } else {
      setErrorFecha('')
    }
  }, [fechaEntrada, fechaSalida])
  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchCuidadores = async () => {
        try {
          const query = []
          if (especie) query.push(`especie=${especie}`)
          if (tamaño) query.push(`tamano=${tamaño}`)
          if (lat && lon) {
            query.push(`lat=${lat}`)
            query.push(`lon=${lon}`)
          }
          if (fechaEntrada) query.push(`fecha_entrada=${fechaEntrada}`)
          if (fechaSalida) query.push(`fecha_salida=${fechaSalida}`)
          serviciosSeleccionados.forEach(s => {
            query.push(`servicio=${encodeURIComponent(s)}`)
          })

          const res = await api.get(`/cuidadores${query.length ? `?${query.join('&')}` : ''}`)
          setCuidadores(res.data)
        } catch (err) {
          console.error(err)
          setError('No se pudieron cargar los cuidadores.')        }
      }

      fetchCuidadores()
    }, 500)

    return () => clearTimeout(timeout)
  }, [especie, tamaño, lat, lon, fechaEntrada, fechaSalida, serviciosSeleccionados.join(',')])

  const actualizarFiltro = (clave, valor) => {
    const nuevosParams = new URLSearchParams(searchParams)
    if (valor) {
      nuevosParams.set(clave, valor)
    } else {
      nuevosParams.delete(clave)
    }
    setSearchParams(nuevosParams)
  }

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

  useEffect(() => {
    const initialLocation =
      searchParams.get('location') ||
      searchParams.get('postal_code') ||
      ''
    setDireccion(initialLocation)
  }, [searchParams])

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!autocompleteRef.current) return

      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'es' },
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry) {
          const lat = place.geometry.location.lat().toFixed(6)
          const lon = place.geometry.location.lng().toFixed(6)
          const location = place.formatted_address || place.name || ''

          const nuevosParams = new URLSearchParams(searchParams)
          nuevosParams.set('lat', lat)
          nuevosParams.set('lon', lon)
          nuevosParams.set('location', location)

          navigate({
            pathname: '/cuidadores',
            search: `?${nuevosParams.toString()}`
          })
        }      })
    })
  }, [])
  const searchLocation = lat && lon
    ? { lat: parseFloat(lat), lng: parseFloat(lon) }
    : null;
      return (
    <div className="py-2">
      <div className="p-2 max-w-none mx-auto px-6">{/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">          <h2 className="text-lg font-semibold text-gray-800 mb-3">Filtros de búsqueda</h2>          {/* Primera fila: 4 filtros principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de mascota</label>
              <select
                value={especie}
                onChange={e => actualizarFiltro('especie', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Todas</option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tamaño</label>
              <select
                value={tamaño}
                onChange={e => actualizarFiltro('tamano', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Todos</option>
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
                <option value="gigante">Gigante</option>
              </select>
            </div>            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fecha entrada</label>
              <input
                type="date"
                value={fechaEntrada}
                onChange={(e) => actualizarFiltro('fecha_entrada', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fecha salida</label>
              <input
                type="date"
                value={fechaSalida}
                onChange={(e) => actualizarFiltro('fecha_salida', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>          {/* Segunda fila: Servicios y Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Servicios ofrecidos */}
            <div className="md:col-span-2">              <label className="block text-xs font-medium text-gray-700 mb-2">🎯 Servicios ofrecidos</label>
              <div className="bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {servicios.map(serv => (
                    <label 
                      key={serv.value} 
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 text-xs ${
                        serviciosSeleccionados.includes(serv.value)
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={serv.value}
                        checked={serviciosSeleccionados.includes(serv.value)}
                        onChange={() => toggleServicio(serv.value)}
                        className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="font-medium">{serv.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">📍 Ubicación</label>
              <input
                ref={autocompleteRef}
                type="text"
                placeholder="Código postal"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={direccion}
                onChange={(e) => {
                  const value = e.target.value
                  setDireccion(value)

                  if (value.trim() === '') {
                    const nuevosParams = new URLSearchParams(searchParams)
                    nuevosParams.delete('lat')
                    nuevosParams.delete('lon')
                    nuevosParams.delete('location')
                    setSearchParams(nuevosParams)
                  }
                }}
              />
            </div>
          </div>{errorFecha && (
            <div className="mt-3">
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600 flex items-center gap-2">
                  <span className="font-medium">⚠️</span>
                  {errorFecha}
                </p>
              </div>
            </div>
          )}
        </div>        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 flex items-center gap-2 text-sm">
              <span className="font-medium">❌</span>
              {error}
            </p>
          </div>
        )}        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Lista de cuidadores */}
          <div className="lg:col-span-3 space-y-4">
            {cuidadores.length === 0 && !error && (
              <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No se encontraron cuidadores</h3>
                <p className="text-gray-600">Prueba ajustando los filtros de búsqueda</p>
              </div>
            )}

            {cuidadores.map(cuidador => {
              console.log(cuidador); 

              return (
                <div
                  key={cuidador.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100"
                >
                  {/* Layout responsivo: columna en móvil, fila en desktop */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 gap-4">
                    <div className="flex items-start gap-4">
                      {/* Foto de perfil */}
                      {cuidador.host?.profile_photo ? (
                        <img
                          src={cuidador.host.profile_photo_url}
                          alt={`Foto de ${cuidador.name}`}
                          className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border border-gray-300 transform transition-transform duration-300 hover:scale-105 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium border border-gray-300 transform transition-transform duration-300 hover:scale-105 shadow-sm">
                          {cuidador.name?.charAt(0) || "?"}
                        </div>
                      )}

                      {/* Info del cuidador */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{cuidador.name}</h3>
                        <p className="text-gray-600 text-sm">{cuidador.email}</p>
                        {cuidador.host?.average_rating ? (
                          <p className="text-sm text-yellow-600 font-medium mt-1">
                            ⭐ {cuidador.host.average_rating.toFixed(1)} / 5
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">Sin reseñas aún</p>
                        )}
                      </div>
                    </div>

                    {/* Precio y botones - en columna en móvil, en fila en desktop */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                      {/* Precio del servicio principal */}
                      <div className="w-full sm:w-auto">
                        {(() => {
                          // Buscar precio de alojamiento primero
                          const alojamientoPrice = cuidador.host?.service_prices?.find(p => p.service_type === 'alojamiento');
                          if (alojamientoPrice) {
                            return (
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">🏠</span>
                                  <span className="text-xs font-medium text-gray-600">Alojamiento/noche</span>
                                </div>
                                <div className="text-lg font-bold text-green-700">{alojamientoPrice.price}€</div>
                              </div>
                            );
                          }
                          
                          // Si no tiene alojamiento, buscar otros servicios
                          const otherServices = cuidador.host?.service_prices || [];
                          if (otherServices.length > 0) {
                            const firstService = otherServices[0];
                            const serviceLabels = {
                              'paseo': { icon: '🚶', label: 'Paseo/hora' },
                              'guarderia': { icon: '🏢', label: 'Guardería/día' },
                              'cuidado_a_domicilio': { icon: '🏡', label: 'Cuidado/día' },
                              'visitas_a_domicilio': { icon: '🚪', label: 'Visita' }
                            };
                            
                            const serviceInfo = serviceLabels[firstService.service_type] || { icon: '💼', label: 'Servicio' };
                            
                            return (
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{serviceInfo.icon}</span>
                                  <span className="text-xs font-medium text-gray-600">{serviceInfo.label}</span>
                                </div>
                                <div className="text-lg font-bold text-blue-700">{firstService.price}€</div>
                              </div>
                            );
                          }
                          
                          // Si no tiene precios configurados
                          return (
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg px-3 py-2">
                              <div className="text-xs font-medium text-gray-500">Consultar precio</div>
                            </div>
                          );                        })()}
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        {cuidador.distance && (
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            📍 {Number(cuidador.distance).toFixed(1)} km
                          </div>
                        )}
                        <button
                          onClick={() => {
                            const ruta = `/cuidadores/${cuidador.id}`;
                            if (!user) {
                              localStorage.setItem('redirectAfterLogin', ruta);
                              openLogin();
                            } else {
                              navigate(ruta);
                            }
                          }}
                          className="group relative bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <span>Ver perfil</span>
                            <svg
                              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {cuidador.especie_preferida?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">🐕 Mascotas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {cuidador.especie_preferida.map((tipo, idx) => (
                            <span
                              key={`esp-${cuidador.id}-${idx}`}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cuidador.tamanos_aceptados?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">📏 Tamaños:</h4>
                        <div className="flex flex-wrap gap-1">
                          {cuidador.tamanos_aceptados.map((t, idx) => (
                            <span
                              key={`tam-${cuidador.id}-${idx}`}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cuidador.servicios_ofrecidos?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">⭐ Servicios:</h4>
                        <div className="flex flex-wrap gap-1">
                          {cuidador.servicios_ofrecidos.map((s, idx) => (
                            <span
                              key={`serv-${cuidador.id}-${idx}`}
                              className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>          {/* Mapa */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🗺️ Ubicación de cuidadores</h3>
            <div className="rounded-lg overflow-hidden">
              <MapaGoogle cuidadores={cuidadores} searchLocation={searchLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}