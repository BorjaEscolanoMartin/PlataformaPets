import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/axios'
import ReservaForm from '../components/ReservaForm'

export default function PerfilCuidador() {
  const { id } = useParams()
  const [cuidador, setCuidador] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/cuidadores/${id}`)
      .then(res => setCuidador(res.data))
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
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{cuidador.name}</h1>
      <p className="text-sm text-gray-600 mb-2">Email: {cuidador.email}</p>

      {cuidador.especie_preferida?.length > 0 && (
        <p className="mb-1 text-sm">
          <strong>Acepta:</strong> {cuidador.especie_preferida.join(', ')}
        </p>
      )}
      {cuidador.tamanos_aceptados?.length > 0 && (
        <p className="mb-4 text-sm">
          <strong>Tamaños:</strong> {cuidador.tamanos_aceptados.join(', ')}
        </p>
      )}

      {host ? (
        <>
          <p className="text-sm text-gray-600 mb-2">Tipo: {host.type}</p>
          <p className="text-sm text-gray-600 mb-2">Ubicación: {host.location}</p>
          <p className="whitespace-pre-wrap mb-4">{host.description || 'Sin descripción.'}</p>

          <ReservaForm hostId={host.id} />
        </>
      ) : (
        <p className="text-sm italic text-gray-500 mb-4">Este cuidador aún no ha completado su perfil.</p>
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
