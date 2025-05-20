import { useEffect, useRef } from 'react'

export default function MapaGoogle({ cuidadores }) {
  const mapRef = useRef(null)

  useEffect(() => {
    if (!window.google || !mapRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 38.4, lng: -0.8 },
      zoom: 6, // Zoom por defecto si no hay cuidadores
    })

    const bounds = new window.google.maps.LatLngBounds()

    cuidadores.forEach(cuidador => {
      const host = cuidador.hosts?.[0]
      if (host?.latitude && host?.longitude) {
        const position = {
          lat: parseFloat(host.latitude),
          lng: parseFloat(host.longitude),
        }

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: cuidador.name,
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <strong>${cuidador.name}</strong><br/>
              <small>${host.location ?? 'Ubicación no especificada'}</small><br/>
              <a href="/cuidadores/${cuidador.id}">Ver perfil</a>
            </div>
          `,
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })

        bounds.extend(position)
      }
    })

    // Si al menos un cuidador tiene coordenadas → ajustar el mapa
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds)
    }

  }, [cuidadores])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '500px', borderRadius: '8px' }}
    />
  )
}
