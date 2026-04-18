import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useConfirm } from '../hooks/useModal'
import { usePets, useCreatePet, useUpdatePet, useDeletePet } from '../hooks/usePets'

const EMPTY_FORM = {
  name: '',
  species: '',
  breed: '',
  age: '',
  size: '',
  description: '',
  photo: null,
}

export default function Pets() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const confirm = useConfirm()

  const { data: pets = [] } = usePets()
  const createPet = useCreatePet()
  const updatePet = useUpdatePet()
  const deletePet = useDeletePet()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'photo') {
      setForm({ ...form, photo: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      if (editingId) {
        await updatePet.mutateAsync({ id: editingId, data: form })
      } else {
        await createPet.mutateAsync(form)
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      setSuccess(true)
    } catch {
      setError('Error al guardar la mascota')
    }
  }

  const handleEdit = (pet) => {
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age || '',
      size: pet.size || '',
      description: pet.description || '',
      photo: null,
    })
    setEditingId(pet.id)
    setSuccess(false)
  }

  const handleDelete = async (id) => {
    try {
      await deletePet.mutateAsync(id)
    } catch {
      setError('Error al eliminar mascota')
    }
  }
  return (
    <div className="p-6">      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <span className="text-white text-2xl">🐾</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Mascotas</h1>
            <p className="text-gray-600">Gestiona la información de tus compañeros peludos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 sticky top-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
                  <span className="text-white text-xl">{editingId ? '✏️' : '➕'}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {editingId ? 'Editar mascota' : 'Nueva mascota'}
                </h2>
                <p className="text-sm text-gray-600">
                  {editingId ? 'Actualiza la información' : 'Añade una nueva mascota a tu perfil'}
                </p>
              </div>

              {/* Success/Error Messages */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-green-600 text-xl">✅</span>
                  <div>
                    <p className="text-green-800 font-medium">¡Éxito!</p>
                    <p className="text-green-700 text-sm">Mascota {editingId ? 'actualizada' : 'creada'} correctamente</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-red-600 text-xl">⚠️</span>
                  <div>
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="text-lg">🏷️</span>
                    Nombre
                  </label>
                  <input 
                    name="name" 
                    placeholder="Ej: Luna, Max, Bella..." 
                    value={form.name} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Especie */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="text-lg">🐕</span>
                    Especie
                  </label>
                  <select 
                    name="species" 
                    value={form.species} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                    required
                  >
                    <option value="">Selecciona la especie</option>
                    <option value="perro">🐕 Perro</option>
                    <option value="gato">🐱 Gato</option>
                  </select>
                </div>

                {/* Raza */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="text-lg">🧬</span>
                    Raza
                  </label>
                  <input 
                    name="breed" 
                    placeholder="Ej: Golden Retriever, Persa..." 
                    value={form.breed} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Edad y Tamaño */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-lg">🎂</span>
                      Edad
                    </label>
                    <input 
                      name="age" 
                      type="number" 
                      placeholder="Años" 
                      value={form.age} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      min="0"
                      max="30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-lg">📏</span>
                      Tamaño
                    </label>
                    <select 
                      name="size" 
                      value={form.size} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                    >
                      <option value="">Tamaño</option>
                      <option value="pequeño">🐁 Pequeño</option>
                      <option value="mediano">🐕 Mediano</option>
                      <option value="grande">🐕‍🦺 Grande</option>
                      <option value="gigante">🐕‍🦮 Gigante</option>
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="text-lg">📝</span>
                    Descripción
                  </label>
                  <textarea 
                    name="description" 
                    placeholder="Cuéntanos sobre su personalidad, cuidados especiales, gustos..." 
                    value={form.description} 
                    onChange={handleChange} 
                    rows="3"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Foto */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="text-lg">📸</span>
                    Foto
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">{editingId ? '💾' : '➕'}</span>
                    {editingId ? 'Actualizar mascota' : 'Guardar mascota'}
                  </button>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setForm(EMPTY_FORM)
                      setSuccess(false)
                    }}
                    className="w-full mt-2 bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancelar edición
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Lista de mascotas */}
          <div className="lg:col-span-2">

            {pets.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🐾</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">No hay mascotas registradas</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Añade información sobre tus mascotas para que los cuidadores puedan conocerlas mejor y ofrecerte el mejor servicio.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Info principal */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">
                              {pet.species === 'perro' ? '🐕' : 
                               pet.species === 'gato' ? '🐱' : 
                               pet.species === 'ave' ? '🐦' : 
                               pet.species === 'hamster' ? '🐹' : 
                               pet.species === 'conejo' ? '🐰' : '🐾'}
                            </span>
                          </div>
                          <div>
                            <Link 
                              to={`/mascotas/${pet.id}`} 
                              className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200"
                            >
                              {pet.name}
                            </Link>
                            <p className="text-sm text-gray-600">
                              {pet.species} {pet.breed && `• ${pet.breed}`} {pet.age && `• ${pet.age} años`}
                            </p>
                          </div>
                        </div>
                        
                        {pet.description && (
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">{pet.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {pet.size && (
                            <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              📏 {pet.size}
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                            🐾 {pet.species}
                          </span>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <button 
                          onClick={() => handleEdit(pet)} 
                          className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-2 px-4 rounded-xl transition-all duration-200"
                        >
                          <span className="text-sm">✏️</span>
                          Editar
                        </button>                        <button 
                          onClick={async () => {
                            const confirmed = await confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)
                            if (confirmed) {
                              handleDelete(pet.id)
                            }
                          }}
                          className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-xl transition-all duration-200"
                        >
                          <span className="text-sm">🗑️</span>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-lg">🏠</span>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
