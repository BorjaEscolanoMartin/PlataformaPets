import { useEffect, useRef, useState } from 'react'
import api from '../lib/axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function HostProfile() {
  const [host, setHost] = useState({
    name: '',
    type: 'particular',
    location: '',
    description: '',
    title: '',
    phone: '',
    experience_years: '',
    experience_details: '',
    has_own_pets: false,
    own_pets_description: '',
  })

  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [tamanos, setTamanos] = useState([])
  const [especies, setEspecies] = useState([])
  const [servicios, setServicios] = useState([])

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const { user, setUser } = useAuth()
  const locationRef = useRef(null)

  useEffect(() => {
    api.get('/hosts')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0 && res.data[0]?.id) {
          setHost(res.data[0])
        }
      })

    api.get('/user')
      .then(res => {
        setTamanos(res.data.tamanos_aceptados || [])
        setEspecies(res.data.especie_preferida || [])
        setServicios(res.data.servicios_ofrecidos || [])
      })
      .catch(() => setError('Error al cargar tus datos'))
  }, [])

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!locationRef.current) return

      const autocomplete = new window.google.maps.places.Autocomplete(locationRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'es' },
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry) return

        setHost(prev => ({
          ...prev,
          location: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        }))
      })
    }).catch(console.error)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      Object.entries(host).forEach(([key, value]) => {
        if (key === 'profile_photo') return
        formData.append(key, value !== null && value !== undefined ? value : '')
      })

      formData.set('has_own_pets', host.has_own_pets ? 1 : 0)

      if (profilePhotoFile instanceof File) {
        formData.append('profile_photo', profilePhotoFile)
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      if (host?.id) {
        await api.post(`/hosts/${host.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/hosts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      await api.put('/user', {
        tamanos_aceptados: tamanos,
        especie_preferida: especies,
        servicios_ofrecidos: servicios,
      })

      const userResponse = await api.get('/user')
      setUser(userResponse.data)

      setSuccess('Perfil actualizado correctamente ✅')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('Errores de validación:', err.response.data.errors)
      } else {
        console.error(err)
      }

      setError('Error al guardar los datos')
    }
  }

  const toggleArrayValue = (array, value) =>
    array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {user?.role === 'empresa' ? 'Perfil de Empresa' : 'Perfil de Cuidador'}
      </h1>

      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título del perfil"
          value={host.title}
          onChange={e => setHost({ ...host, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Nombre del perfil"
          value={host.name}
          onChange={e => setHost({ ...host, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        {user?.role === 'empresa' ? (
          <div>
            <label className="block font-semibold mb-1">Tipo</label>
            <select
              value={host.type}
              onChange={e => setHost({ ...host, type: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="empresa">Empresa</option>
            </select>
          </div>
        ) : (
          <input type="hidden" name="type" value="particular" />
        )}

        <input
          ref={locationRef}
          type="text"
          placeholder="Ubicación"
          value={host.location}
          onChange={e => setHost({ ...host, location: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="tel"
          placeholder="Número de móvil"
          value={host.phone}
          onChange={e => setHost({ ...host, phone: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          min="0"
          placeholder="Años de experiencia"
          value={host.experience_years}
          onChange={e => setHost({ ...host, experience_years: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Cuéntanos tu experiencia con mascotas"
          value={host.experience_details}
          onChange={e => setHost({ ...host, experience_details: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Descripción"
          value={host.description}
          onChange={e => setHost({ ...host, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <div>
          <label className="block font-semibold mb-1">Foto de perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setProfilePhotoFile(e.target.files[0])}
          />
        </div>

        <label className="block mt-2 font-semibold">
          <input
            type="checkbox"
            checked={host.has_own_pets}
            onChange={e => setHost({ ...host, has_own_pets: e.target.checked })}
          />{' '}
          Tengo mascotas en casa
        </label>

        {host.has_own_pets && (
          <textarea
            placeholder="Describe a tus mascotas"
            value={host.own_pets_description}
            onChange={e => setHost({ ...host, own_pets_description: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-2"
          />
        )}

        <div>
          <h2 className="font-semibold mb-2">¿Qué tipo de mascota aceptas?</h2>
          {['perro', 'gato'].map(especie => (
            <label key={especie} className="block">
              <input
                type="checkbox"
                checked={especies.includes(especie)}
                onChange={() =>
                  setEspecies(prev => toggleArrayValue(prev, especie))
                }
              />{' '}
              {especie.charAt(0).toUpperCase() + especie.slice(1)}
            </label>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-2">¿Qué tamaños aceptas?</h2>
          {['pequeño', 'mediano', 'grande', 'gigante'].map(t => (
            <label key={t} className="block">
              <input
                type="checkbox"
                checked={tamanos.includes(t)}
                onChange={() =>
                  setTamanos(prev => toggleArrayValue(prev, t))
                }
              />{' '}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-2">¿Qué servicios ofreces?</h2>
          {['paseo', 'alojamiento', 'guarderia', 'cuidado a domicilio', 'visitas a domicilio'].map(servicio => (
            <label key={servicio} className="block">
              <input
                type="checkbox"
                checked={servicios.includes(servicio)}
                onChange={() =>
                  setServicios(prev => toggleArrayValue(prev, servicio))
                }
              />{' '}
              {servicio.charAt(0).toUpperCase() + servicio.slice(1)}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {host?.id ? 'Actualizar perfil' : 'Crear perfil'}
        </button>
      </form>

      <Link to="/" className="block mt-6 text-sm text-blue-600 hover:underline">
        ← Volver a inicio
      </Link>
    </div>
  )
}