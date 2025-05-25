import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/axios'
import { Link } from 'react-router-dom'

export default function PetDetail() {
  const { id } = useParams()
  const [pet, setPet] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`)
        console.log('Pet recibida:', res.data)
        setPet(res.data)
      } catch (err) {
        setError('No se pudo cargar la mascota')
        console.error(err)
      }
    }

    fetchPet()
  }, [id])
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center border border-red-200">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Error al cargar</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/mascotas"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="text-lg">🏠</span>
            Volver a mis mascotas
          </Link>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-blue-100">
          {/* Animated loading icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cargando mascota</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Obteniendo la información de tu compañero peludo...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <span className="text-white text-2xl">
                {pet.species === 'perro' ? '🐕' : 
                 pet.species === 'gato' ? '🐱' : 
                 pet.species === 'ave' ? '🐦' : 
                 pet.species === 'hamster' ? '🐹' : 
                 pet.species === 'conejo' ? '🐰' : '🐾'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{pet.name}</h1>
            <p className="text-gray-600">Información detallada de tu mascota</p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Foto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
                  <span className="text-white text-xl">📸</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Foto</h2>
              </div>
              
              {pet.photo_url ? (
                <div className="relative group">
                  <img
                    src={`http://localhost:8000${pet.photo_url}`}
                    alt={`Foto de ${pet.name}`}
                    className="w-full h-80 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">📷</span>
                    <p className="text-gray-500 font-medium">Sin foto</p>
                    <p className="text-gray-400 text-sm">No hay imagen disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
                  <span className="text-white text-xl">📋</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Información general</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Especie */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🐾</span>
                    <h3 className="font-semibold text-gray-800">Especie</h3>
                  </div>
                  <p className="text-gray-700 capitalize">{pet.species}</p>
                </div>

                {/* Raza */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🧬</span>
                    <h3 className="font-semibold text-gray-800">Raza</h3>
                  </div>
                  <p className="text-gray-700">{pet.breed || 'No especificada'}</p>
                </div>

                {/* Edad */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🎂</span>
                    <h3 className="font-semibold text-gray-800">Edad</h3>
                  </div>
                  <p className="text-gray-700">
                    {pet.age ? `${pet.age} año${pet.age > 1 ? 's' : ''}` : 'No especificada'}
                  </p>
                </div>

                {/* Tamaño */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">📏</span>
                    <h3 className="font-semibold text-gray-800">Tamaño</h3>
                  </div>
                  <p className="text-gray-700 capitalize">{pet.size || 'No especificado'}</p>
                </div>
              </div>

              {/* Descripción */}
              {pet.description && (
                <div className="mt-6 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">📝</span>
                    <h3 className="font-semibold text-gray-800">Descripción</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{pet.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center pt-4">
          <Link
            to="/mascotas"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-lg">🏠</span>
            Volver a mis mascotas
          </Link>
        </div>
      </div>
    </div>
  )
}