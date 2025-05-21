let googleMapsPromise = null

export function loadGoogleMaps() {
  if (typeof window.google !== 'undefined') return Promise.resolve()

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('No se pudo cargar Google Maps'))
      document.head.appendChild(script)
    })
  }

  return googleMapsPromise
}
