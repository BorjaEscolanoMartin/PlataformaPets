import FormularioBusqueda from '../components/FormularioBusqueda'

export default function Inicio() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative flex flex-col justify-center items-center text-center px-4">
        <FormularioBusqueda />
      </div>
    </div>
  )
}
