import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { 
  PawPrint, 
  Heart, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle
} from 'lucide-react'

export default function Footer() {
  const { user } = useAuth()
  
  // Determinar el tipo de usuario (igual que en Header.jsx)
  const esCliente = user?.role === 'cliente'
  const esCuidador = user?.role === 'cuidador'
  const esEmpresa = user?.role === 'empresa'
    return (
    <footer className="relative mt-12">
      {/* Contenedor principal del footer */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Sección: Acerca de */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12">
                  <img 
                    src="/LogoWeb-sinfondo.png" 
                    alt="Pet Hosting Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center rounded-xl" style={{display: 'none'}}>
                    <PawPrint className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pets
                </span>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Conectamos a dueños de mascotas con cuidadores de confianza. 
                Tu mascota en las mejores manos mientras estás fuera.
              </p>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">4.9/5 en reseñas</span>
              </div>
            </div>            {/* Sección: Enlaces rápidos */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <PawPrint className="w-3 h-3 text-blue-600" />
                </div>
                Enlaces rápidos
              </h3>
                <nav className="space-y-3">
                {/* Enlaces para usuarios no autenticados o clientes */}
                {(!user || esCliente) && (
                  <Link 
                    to="/cuidadores" 
                    className="block text-gray-600 hover:text-blue-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                  >
                    Buscar cuidadores
                  </Link>
                )}
                
                {/* Enlaces específicos para clientes */}
                {esCliente && (
                  <>
                    <Link 
                      to="/empresas" 
                      className="block text-gray-600 hover:text-purple-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Ver empresas
                    </Link>
                    <Link 
                      to="/mascotas" 
                      className="block text-gray-600 hover:text-green-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Mis mascotas
                    </Link>
                    <Link 
                      to="/mis-reservas" 
                      className="block text-gray-600 hover:text-orange-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Mis reservas
                    </Link>
                  </>
                )}
                
                {/* Enlaces específicos para cuidadores/empresas */}
                {(esCuidador || esEmpresa) && (
                  <>
                    <Link 
                      to="/reservas-recibidas" 
                      className="block text-gray-600 hover:text-indigo-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Reservas recibidas
                    </Link>
                    <Link 
                      to="/mi-perfil-cuidador" 
                      className="block text-gray-600 hover:text-purple-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      {esEmpresa ? 'Mi perfil de empresa' : 'Mi perfil de cuidador'}
                    </Link>
                    <Link 
                      to="/notificaciones" 
                      className="block text-gray-600 hover:text-orange-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Notificaciones
                    </Link>
                  </>
                )}
              </nav>
            </div>            {/* Sección: Para cuidadores/empresas o información para convertirse */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Heart className="w-3 h-3 text-purple-600" />
                </div>
                {(esCuidador || esEmpresa) ? 'Panel de gestión' : 'Únete como profesional'}
              </h3>
              
              <nav className="space-y-3">
                {(esCuidador || esEmpresa) ? (
                  /* Enlaces para cuidadores/empresas autenticados */
                  <>
                    <Link 
                      to="/mi-perfil-cuidador" 
                      className="block text-gray-600 hover:text-purple-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      {esEmpresa ? 'Gestionar perfil de empresa' : 'Gestionar perfil de cuidador'}
                    </Link>
                    <Link 
                      to="/reservas-recibidas" 
                      className="block text-gray-600 hover:text-indigo-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Gestionar reservas
                    </Link>
                    <Link 
                      to="/notificaciones" 
                      className="block text-gray-600 hover:text-orange-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Centro de notificaciones
                    </Link>
                  </>
                ) : (
                  /* Enlaces para visitantes y clientes */
                  <>
                    {(!user || esCliente) && (
                      <Link 
                        to="/mi-perfil-cuidador" 
                        className="block text-gray-600 hover:text-purple-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                      >
                        Convertirse en cuidador
                      </Link>
                    )}
                    {(!user || esCliente) && (
                      <Link 
                        to="/registro-empresa" 
                        className="block text-gray-600 hover:text-green-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                      >
                        Registrar empresa
                      </Link>
                    )}
                    <a 
                      href="#ayuda-cuidadores" 
                      className="block text-gray-600 hover:text-blue-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Información para cuidadores
                    </a>
                    <a 
                      href="#beneficios" 
                      className="block text-gray-600 hover:text-indigo-600 text-sm transition-colors duration-300 hover:pl-2 hover:font-medium"
                    >
                      Beneficios y comisiones
                    </a>
                  </>
                )}
              </nav>
            </div>

            {/* Sección: Contacto */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <MessageCircle className="w-3 h-3 text-green-600" />
                </div>
                Contacto
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Mail className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>soporte@pets.com</span>
                </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <Phone className="w-3 h-3 text-green-600" />
                  </div>
                  <span>+34 628 406 752</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-purple-600" />
                  </div>
                  <span>Novelda, Alicante</span>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Síguenos</p>
                <div className="flex items-center gap-3">
                  <a 
                    href="#facebook" 
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 hover:scale-110"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </a>
                  <a 
                    href="#twitter" 
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center hover:from-blue-200 hover:to-cyan-200 transition-all duration-300 hover:scale-110"
                  >
                    <Twitter className="w-4 h-4 text-blue-500" />
                  </a>
                  <a 
                    href="#instagram" 
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center hover:from-pink-200 hover:to-purple-200 transition-all duration-300 hover:scale-110"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de confianza y seguridad */}
          <div className="mt-12 pt-8 border-t border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Seguridad garantizada</h4>
                  <p className="text-xs text-gray-600">Verificación de cuidadores</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-purple-100">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Cuidado con amor</h4>
                  <p className="text-xs text-gray-600">Cuidadores apasionados</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-orange-100">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Soporte 24/7</h4>
                  <p className="text-xs text-gray-600">Ayuda cuando la necesites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              <span>© 2025 Pets. Todos los derechos reservados.</span>
              <div className="hidden md:flex items-center gap-4">
                <a href="#privacidad" className="hover:text-blue-200 transition-colors duration-300">
                  Privacidad
                </a>
                <a href="#terminos" className="hover:text-purple-200 transition-colors duration-300">
                  Términos
                </a>
                <a href="#cookies" className="hover:text-indigo-200 transition-colors duration-300">
                  Cookies
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span>para las mascotas</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
