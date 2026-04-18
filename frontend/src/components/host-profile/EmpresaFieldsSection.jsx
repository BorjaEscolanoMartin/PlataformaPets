export default function EmpresaFieldsSection({ host, setHost, fiscalAddressRef }) {
  return (
    <>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          🏢 Información de la empresa
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-green-600">🆔</span>
              CIF/NIF de la empresa
            </label>
            <input
              type="text"
              placeholder="Ej: B12345678"
              value={host.cif}
              onChange={e => setHost({ ...host, cif: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-green-600">⭐</span>
              Años en el mercado
            </label>
            <input
              type="number"
              min="0"
              placeholder="Años de actividad"
              value={host.experience_years}
              onChange={e => setHost({ ...host, experience_years: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-green-600">🏠</span>
            Dirección fiscal
          </label>
          <input
            ref={fiscalAddressRef}
            type="text"
            placeholder="Dirección completa de la empresa"
            value={host.fiscal_address}
            onChange={e => setHost({ ...host, fiscal_address: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-blue-600">📜</span>
          Licencias y certificaciones
        </label>
        <textarea
          placeholder="Describe las licencias, seguros, certificaciones y acreditaciones de tu empresa..."
          value={host.licenses}
          onChange={e => setHost({ ...host, licenses: e.target.value })}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-indigo-600">💼</span>
          Servicios profesionales
        </label>
        <textarea
          placeholder="Describe los servicios profesionales de tu empresa, instalaciones, equipo, metodología..."
          value={host.description}
          onChange={e => setHost({ ...host, description: e.target.value })}
          rows="4"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-purple-600">👥</span>
          Nuestro equipo
        </label>
        <textarea
          placeholder="Describe tu equipo de trabajo, profesionales, veterinarios, experiencia del personal..."
          value={host.team_info}
          onChange={e => setHost({ ...host, team_info: e.target.value })}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
        />
      </div>
    </>
  )
}
