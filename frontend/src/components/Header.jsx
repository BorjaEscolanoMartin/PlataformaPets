import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const esCliente = user?.role === 'cliente'
  const esCuidador = user?.role === 'cuidador'
  const esEmpresa = user?.role === 'empresa'

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-600">
        🐾 Pet Hosting
      </Link>

      <nav className="flex items-center gap-6 text-sm relative">
        {(!user || esCliente) && (
          <Link to="/cuidadores" className="hover:underline">Buscar cuidadores</Link>
        )}

        {esCliente && (
          <Link to="/empresas" className="hover:underline">Ver empresas</Link>
        )}

        {esCliente && (
          <Link
            to="/mi-perfil-cuidador"
            className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded hover:bg-green-200 transition"
          >
            Quiero ser cuidador
          </Link>
        )}

        {esCliente && (
          <Link
            to="/registro-empresa"
            className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded hover:bg-blue-200 transition"
          >
            Soy una empresa
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/register" className="hover:underline">Registrarse</Link>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
          </>
        ) : (
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="font-semibold text-gray-800 hover:underline">
              {user.name} ⌄
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow w-48 z-50">
                {esCliente && (
                  <>
                    <Link to="/mascotas" className="block px-4 py-2 hover:bg-gray-100">Mis mascotas</Link>
                    <Link to="/mis-reservas" className="block px-4 py-2 hover:bg-gray-100">Mis reservas</Link>
                  </>
                )}

                {(esCuidador || esEmpresa) && (
                  <>
                    <Link to="/mi-perfil-cuidador" className="block px-4 py-2 hover:bg-gray-100">
                      {esEmpresa ? 'Mi perfil de empresa' : 'Mi perfil de cuidador'}
                    </Link>
                    <Link to="/reservas-recibidas" className="block px-4 py-2 hover:bg-gray-100">
                      Reservas recibidas
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
