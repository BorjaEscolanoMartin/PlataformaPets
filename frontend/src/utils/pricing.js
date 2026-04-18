export const SERVICE_PRICE_ALIASES = {
  paseo:        ['paseo'],
  alojamiento:  ['alojamiento'],
  guarderia:    ['guarderia'],
  domicilio:            ['cuidado_a_domicilio', 'domicilio'],
  cuidado_a_domicilio:  ['cuidado_a_domicilio', 'domicilio'],
  visitas:              ['visitas_a_domicilio', 'visitas'],
  visitas_a_domicilio:  ['visitas_a_domicilio', 'visitas'],
}

export const UNIT_LABELS = {
  por_noche:  'por noche',
  por_dia:    'por día',
  por_hora:   'por hora',
  por_visita: 'por visita',
}

const MULTIPLIABLE_UNITS = ['por_noche', 'por_dia', 'por_visita']

export function daysBetween(start, end) {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) return 0
  const ms = e.getTime() - s.getTime()
  return Math.max(1, Math.round(ms / 86_400_000) + 1)
}

export function computeEstimatedPrice({ serviceType, startDate, endDate, servicePrices }) {
  if (!Array.isArray(servicePrices) || servicePrices.length === 0) {
    return { match: null }
  }
  const aliases = SERVICE_PRICE_ALIASES[serviceType] || [serviceType]
  const match = servicePrices.find(p => aliases.includes((p.service_type || '').toLowerCase()))
  if (!match) return { match: null }

  const unitPrice = parseFloat(match.price)
  const days      = daysBetween(startDate, endDate)
  const total     = MULTIPLIABLE_UNITS.includes(match.price_unit) && days > 0
    ? unitPrice * days
    : null

  return {
    match,
    unitPrice,
    unitLabel: UNIT_LABELS[match.price_unit] || match.price_unit?.replace(/_/g, ' '),
    days,
    total,
  }
}
