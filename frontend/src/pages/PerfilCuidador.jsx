import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/axios'
import ReservaForm from '../components/ReservaForm'

export default function PerfilCuidador() {
  const { id } = useParams()
  const [cuidador, setCuidador] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    api.get(`/cuidadores/${id}`)
      .then(res => {
        console.log('Datos del cuidador:', res.data) 
        setCuidador(res.data)
      })
      .catch(err => {
        console.error('Error cargando cuidador:', err)
        setCuidador(null)
      })
      .finally(() => setLoading(false))
  }, [id])


  if (loading) return <p className="text-center mt-10">Cargando cuidador...</p>
  if (!cuidador) return <p className="text-center mt-10 text-red-600">Cuidador no encontrado</p>

  const host = cuidador.host

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow space-y-4">
      <h1 className="text-3xl font-bold">{cuidador.name}</h1>
      <p className="text-sm text-gray-600">Email: {cuidador.email}</p>

      {cuidador.especie_preferida?.length > 0 && (
        <p className="text-sm">
          <strong>Acepta:</strong> {cuidador.especie_preferida.join(', ')}
        </p>
      )}
      {cuidador.tamanos_aceptados?.length > 0 && (
        <p className="text-sm">
          <strong>Tamaños:</strong> {cuidador.tamanos_aceptados.join(', ')}
        </p>
      )}

      {host ? (
        <>
          {host.profile_photo && (
            <img
              src={`http://localhost:8000/storage/${host.profile_photo}`}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border"
            />
          )}

          {host.title && (
            <p className="text-xl font-semibold mt-4">{host.title}</p>
          )}

          <p className="text-sm text-gray-600">Tipo: {host.type}</p>
          <p className="text-sm text-gray-600">Ubicación: {host.location}</p>
          {host.phone && (
            <p className="text-sm text-gray-600">📱 Móvil: {host.phone}</p>
          )}

          {host.experience_years && (
            <p className="text-sm text-gray-600">
              🐾 Años de experiencia: {host.experience_years}
            </p>
          )}

          {host.experience_details && (
            <p className="text-sm whitespace-pre-wrap">
              <strong>Sobre mi experiencia:</strong><br />
              {host.experience_details}
            </p>
          )}

          {host.has_own_pets && (
            <p className="text-sm whitespace-pre-wrap">
              <strong>🐶 Tiene mascotas propias:</strong><br />
              {host.own_pets_description || 'Sí'}
            </p>
          )}

          {host.description && (
            <p className="whitespace-pre-wrap text-sm">
              <strong>Entorno:</strong><br />
              {host.description}
            </p>
          )}

          {!mostrarFormulario ? (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Solicitar reserva
            </button>
          ) : (
            <div className="mt-6 space-y-2">
              <ReservaForm hostId={host.id} />
              <button
                onClick={() => setMostrarFormulario(false)}
                className="text-sm text-red-600 hover:underline"
              >
                Cancelar
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm italic text-gray-500">Este cuidador aún no ha completado su perfil.</p>
      )}

      <Link
        to="/cuidadores"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Volver a cuidadores
      </Link>
    </div>
  )
}

