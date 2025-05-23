import { useEffect, useRef, useState } from 'react'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function RegisterEmpresa() {
  const [host, setHost] = useState({
    name: '',
    type: 'empresa',
    location: '',
    description: '',
    title: '',
    phone: '',
  })

  const [profilePhotoFile, setProfilePhotoFile] = useState(null)

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const { setUser } = useAuth()
  const navigate = useNavigate()
  const locationRef = useRef(null)

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
        formData.append(key, value !== null && value !== undefined ? value : '')
      })

      if (profilePhotoFile instanceof File) {
        formData.append('profile_photo', profilePhotoFile)
      }

      await api.post('/hosts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const userResponse = await api.get('/user')
      setUser(userResponse.data)

      setSuccess('Perfil de empresa creado correctamente ✅')
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Error al registrar la empresa')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registro de Empresa</h1>

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
          placeholder="Nombre de la empresa"
          value={host.name}
          onChange={e => setHost({ ...host, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <input
          ref={locationRef}
          type="text"
          placeholder="Dirección"
          value={host.location}
          onChange={e => setHost({ ...host, location: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="tel"
          placeholder="Número de contacto"
          value={host.phone}
          onChange={e => setHost({ ...host, phone: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Descripción de servicios"
          value={host.description}
          onChange={e => setHost({ ...host, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <div>
          <label className="block font-semibold mb-1">Logo o imagen principal</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setProfilePhotoFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Registrar empresa
        </button>
      </form>
    </div>
  )
}
