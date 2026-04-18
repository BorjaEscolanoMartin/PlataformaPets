const UNIT_LABEL = {
  por_hora:   'Por hora',
  por_noche:  'Por noche',
  por_dia:    'Por día',
  por_visita: 'Por visita',
}

export default function ServicePricesSection({
  serviciosDisponibles,
  servicios,
  precios,
  setPrecios,
}) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
          💰
        </div>
        Precios de tus servicios
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Configura los precios para los servicios que ofreces. Solo aparecerán en tu perfil los servicios que tengan precio configurado.
      </p>

      <div className="space-y-4">
        {serviciosDisponibles.map(({ key, label, unidad }) => {
          if (!servicios.includes(key)) return null

          return (
            <div key={key} className="bg-white p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{label}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {UNIT_LABEL[unidad] || unidad}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 15.00"
                    value={precios[key]?.price || ''}
                    onChange={e => setPrecios(prev => ({
                      ...prev,
                      [key]: { ...prev[key], price: e.target.value, price_unit: unidad },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción adicional (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Incluye paseo de 1 hora"
                    value={precios[key]?.description || ''}
                    onChange={e => setPrecios(prev => ({
                      ...prev,
                      [key]: { ...prev[key], description: e.target.value, price_unit: unidad },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )
        })}

        {servicios.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>Primero selecciona los servicios que ofreces para configurar sus precios.</p>
          </div>
        )}
      </div>
    </div>
  )
}
