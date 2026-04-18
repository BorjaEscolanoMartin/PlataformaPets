const toggleArrayValue = (array, value) =>
  array.includes(value) ? array.filter(item => item !== value) : [...array, value]

export default function ServicesSection({
  isEmpresa,
  serviciosDisponibles,
  servicios,
  setServicios,
}) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          🏥
        </div>
        {isEmpresa ? '¿Qué servicios profesionales ofreces?' : '¿Qué servicios ofreces?'}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {serviciosDisponibles.map(({ key, label }) => (
          <label key={key} className="group cursor-pointer">
            <div className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
              servicios.includes(key)
                ? 'border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 shadow-md'
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
            }`}>
              <input
                type="checkbox"
                checked={servicios.includes(key)}
                onChange={() => setServicios(prev => toggleArrayValue(prev, key))}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className={`ml-3 font-medium ${
                servicios.includes(key) ? 'text-green-700' : 'text-gray-700'
              }`}>
                {label}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
