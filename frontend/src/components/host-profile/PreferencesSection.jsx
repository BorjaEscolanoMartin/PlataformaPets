const toggleArrayValue = (array, value) =>
  array.includes(value) ? array.filter(item => item !== value) : [...array, value]

export default function PreferencesSection({
  host,
  setHost,
  especies,
  setEspecies,
  tamanos,
  setTamanos,
}) {
  return (
    <>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
        <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={host.has_own_pets}
            onChange={e => setHost({ ...host, has_own_pets: e.target.checked })}
            className="w-5 h-5 text-yellow-600 border-2 border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2"
          />
          <span className="text-yellow-600">🐕</span>
          Tengo mascotas en casa
        </label>

        {host.has_own_pets && (
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-yellow-600">🏠</span>
              Describe a tus mascotas
            </label>
            <textarea
              placeholder="Cuéntanos sobre tus mascotas: raza, tamaño, temperamento, cómo se llevan con otros animales..."
              value={host.own_pets_description}
              onChange={e => setHost({ ...host, own_pets_description: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
            />
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            🐾
          </div>
          ¿Qué tipo de mascota aceptas?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {['perro', 'gato'].map(especie => (
            <label key={especie} className="group cursor-pointer">
              <div className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                especies.includes(especie)
                  ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 shadow-md'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
              }`}>
                <input
                  type="checkbox"
                  checked={especies.includes(especie)}
                  onChange={() => setEspecies(prev => toggleArrayValue(prev, especie))}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className={`ml-3 font-medium ${
                  especies.includes(especie) ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  {especie.charAt(0).toUpperCase() + especie.slice(1)}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            📏
          </div>
          ¿Qué tamaños aceptas?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {['pequeño', 'mediano', 'grande', 'gigante'].map(t => (
            <label key={t} className="group cursor-pointer">
              <div className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                tamanos.includes(t)
                  ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-cyan-100 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}>
                <input
                  type="checkbox"
                  checked={tamanos.includes(t)}
                  onChange={() => setTamanos(prev => toggleArrayValue(prev, t))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className={`ml-3 font-medium ${
                  tamanos.includes(t) ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </>
  )
}
