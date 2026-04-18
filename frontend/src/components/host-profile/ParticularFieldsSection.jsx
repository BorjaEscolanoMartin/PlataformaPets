export default function ParticularFieldsSection({ host, setHost }) {
  return (
    <>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-orange-600">⭐</span>
          Años de experiencia
        </label>
        <input
          type="number"
          min="0"
          placeholder="Número de años"
          value={host.experience_years}
          onChange={e => setHost({ ...host, experience_years: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 outline-none text-sm font-medium"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-purple-600">📝</span>
          Cuéntanos tu experiencia con mascotas
        </label>
        <textarea
          placeholder="Describe tu experiencia personal cuidando mascotas, certificaciones, cursos realizados..."
          value={host.experience_details}
          onChange={e => setHost({ ...host, experience_details: e.target.value })}
          rows="4"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <span className="text-indigo-600">💬</span>
          Descripción de tu servicio
        </label>
        <textarea
          placeholder="Presenta tu servicio personal, horarios, metodología, qué hace especial tu cuidado..."
          value={host.description}
          onChange={e => setHost({ ...host, description: e.target.value })}
          rows="4"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
        />
      </div>
    </>
  )
}
