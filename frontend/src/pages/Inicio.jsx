import FormularioBusqueda from '../components/FormularioBusqueda'

export default function Inicio() {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Elementos decorativos flotantes específicos para la página de inicio */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-20 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-2/3 right-10 w-12 h-12 bg-pink-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Contenido principal centrado */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4">
        <FormularioBusqueda />
      </div>
      
      {/* Espaciador para empujar el footer hacia abajo */}
      <div className="h-20"></div>
      
      {/* Efectos adicionales en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
    </div>
  )
}
