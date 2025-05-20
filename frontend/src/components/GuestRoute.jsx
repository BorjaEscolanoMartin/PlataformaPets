import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <p>Cargando autenticación...</p>

  return !user ? children : <Navigate to="/" />
}
