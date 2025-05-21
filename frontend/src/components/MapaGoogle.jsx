import { useEffect, useRef } from 'react'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function MapaGoogle({ cuidadores, searchLocation }) {
  const mapRef = useRef(null)

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!mapRef.current) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 38.4, lng: -0.8 },
        zoom: 6,
      })

      const bounds = new window.google.maps.LatLngBounds()

      // Marcadores de cuidadores
      cuidadores.forEach(cuidador => {
        const host = cuidador.host
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

      // Marcador de ubicación buscada
      if (searchLocation) {
        new window.google.maps.Marker({
          position: searchLocation,
          map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          title: 'Ubicación buscada',
        })

        bounds.extend(searchLocation)

        if (cuidadores.length === 0) {
          map.setCenter(searchLocation)
          map.setZoom(13)
        }
      }

      // Ajustar límites
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds)
      }
    }).catch((err) => {
      console.error('Error al cargar Google Maps:', err)
    })
  }, [cuidadores, searchLocation])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '500px', borderRadius: '8px' }}
    />
  )
}


