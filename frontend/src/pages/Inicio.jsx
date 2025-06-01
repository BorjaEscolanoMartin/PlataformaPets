import FormularioBusqueda from '../components/FormularioBusqueda'

export default function Inicio() {
  return (
    <div 
      className="min-h-screen pt-4 relative overflow-hidden"      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%),
          url('/Fondo.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >      {/* Overlay para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-purple-50/40"></div>
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-60 right-10 w-12 h-12 bg-pink-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-4">
        <FormularioBusqueda />
      </div>
      
      {/* Efectos adicionales en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
    </div>
  )
}
