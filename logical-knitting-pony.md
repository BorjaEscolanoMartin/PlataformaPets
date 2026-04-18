# Auditoría Técnica — Plataforma Pets

## Contexto

Plataforma de cuidado/alojamiento de mascotas que conecta **clientes** con **cuidadores particulares** y **empresas**. Stack: Laravel 12 + Sanctum + PostgreSQL + Redis + Laravel Echo (backend) y React 19 + Vite + Tailwind (frontend), orquestado con Docker Compose. El proyecto lleva ~3 meses de desarrollo (abril–junio 2025), tiene funcionalidad end-to-end de un MVP (auth, mascotas, búsqueda geolocalizada, reservas, chat realtime, reseñas, notificaciones) pero arrastra deuda técnica significativa y **no está listo para producción**. Este informe identifica los riesgos, prioriza los fixes y propone una hoja de ruta de saneamiento.

---

## 1. Comprensión del proyecto

### Qué hace
Una plataforma web donde:
- **Clientes** registran sus mascotas y reservan servicios (alojamiento, paseo, guardería, visitas, domicilio) con cuidadores.
- **Cuidadores particulares** crean un perfil de `Host` con experiencia, fotos, tarifas por servicio y reciben reservas.
- **Empresas** (veterinarios, adiestradores, etc.) publican perfil con CIF, dirección fiscal, licencias y tarifas.
- Todos pueden chatear entre sí en tiempo real, recibir notificaciones de reservas y dejar reseñas.

### Organización real
- `backend/` → Laravel 12 monolítico plano (11 controladores, 8 modelos, sin capas de servicio/repositorio/policy, ~1359 LOC en Controllers).
- `frontend/` → React 19 + Vite, JavaScript (no TS), estructura clásica por `pages/`, `components/`, `context/`, `hooks/`, `lib/`.
- `docker-compose.yml` levanta: app (php-fpm), web (nginx), db (postgres:15), redis, echo-server (node 18), queue-worker.

### Flujos principales detectados
- **Cliente**: registro → login → crear mascotas → buscar cuidadores por geolocalización/servicio/especie/tamaño/fechas → reservar → chatear → reseñar.
- **Cuidador/Empresa**: registro (inicial como cliente) → crear perfil Host (cambio automático de rol) → definir tarifas → recibir/aceptar/rechazar reservas → chatear → recibir reseñas.
- **Admin**: **no existe** (no hay panel ni rol admin).

### Lo que está BIEN hecho
- Separación frontend/backend limpia, contenedorizado con Docker.
- Autenticación con Sanctum y bcrypt correctamente implementada, tokens previos revocados al login.
- `$fillable` explícito en todos los modelos (mass assignment protegido).
- Eager loading razonable con `with()` en varios controllers.
- Cliente axios centralizado con interceptor 401 → logout.
- Sistema de broadcasting (Echo + Redis + canales privados con auth) correctamente estructurado a nivel backend.
- Contextos React bien separados (`AuthContext`, `ChatContext`, `ModalContext`, `ToastContext`).
- Notificaciones Laravel usando canal `database` con `ShouldQueue`.

---

## 2. Hallazgos técnicos

### 2.1 Arquitectura (backend)

| # | Problema | Por qué es problema | Impacto | Fix |
|---|----------|---------------------|---------|-----|
| A1 | Sin `app/Http/Requests/` — **0 Form Requests** | Validación inline duplicada (29 usos de `$request->validate()`), difícil de testear y reusar | Código repetido, mantenibilidad baja | Extraer `PetStoreRequest`, `PetUpdateRequest`, `HostRequest`, `ReservationStoreRequest`, `MessageRequest`, etc. |
| A2 | Sin `app/Http/Resources/` — **0 API Resources** | Responses inconsistentes: unos `{success, data, message}`, otros arrays crudos, otros spread con `photo_url` | Cliente acopla al shape de BD; cambios de modelo rompen frontend | Crear `UserResource`, `PetResource`, `HostResource`, `ReservationResource`, `ChatResource`, `MessageResource` |
| A3 | Sin `app/Policies/` — autorización inline repetida | Checks `if ($x->user_id !== Auth::id()) return 403` esparcidos en 5+ controllers | Fácil olvidar un check = IDOR | `HostPolicy`, `PetPolicy`, `ReservationPolicy`, `ChatPolicy`, `MessagePolicy`, `ReviewPolicy` + `authorize()` en controllers |
| A4 | Fat controllers (`MessageController` 344 LOC, `ChatController` 248, `HostController` 204) | Lógica de negocio mezclada con HTTP | Imposibles de testear aisladamente | Extraer `MessageService`, `ChatService`, `ReservationService`, `GeolocationSearchService` |
| A5 | `routes/web.php` duplica `POST /login` que ya vive en `api.php` | Endpoint muerto que confunde | Bajo | Eliminar |

### 2.2 Base de datos

| # | Problema | Por qué es problema | Impacto | Fix |
|---|----------|---------------------|---------|-----|
| D1 | **`hosts.user_id` sin UNIQUE** pero modelo define `hasOne(Host)` | Un usuario puede tener N hosts → datos inconsistentes | Medio-alto | Migración: `$table->unique('user_id')` en `hosts` |
| D2 | Sin CHECK `start_date <= end_date` en `reservations` | Solo validado en controller; alguien con acceso DB/otro endpoint puede insertar inválido | Medio | Constraint a nivel DB + mantener validación en Request |
| D3 | Sin CHECK `rating BETWEEN 1 AND 5` en `reviews` | Mismo problema | Bajo | CHECK constraint |
| D4 | **Inconsistencia semántica** `service_type`: `reservations` es ENUM (5 valores: alojamiento, domicilio, visitas, guarderia, paseo) vs `service_prices` es STRING libre (13+ valores: veterinario, adiestrador…) | Un cliente puede pedir `paseo` pero el cuidador vende `adiestrador` — no hay forma de reservar eso | **ALTO funcional**: flujo roto para empresas | Normalizar: crear tabla `service_types` o alinear ENUMs entre ambas tablas |
| D5 | Columna `reservations.frequency` fue **parcialmente eliminada** (migración `2025_05_31_160537_remove_frequency_...`) pero queda referenciada | Confusión y posibles errores si alguna parte aún la usa | Bajo | Verificar que ninguna referencia residual exista |
| D6 | Falta índice en `reservations(host_id, status, start_date, end_date)` | Query de disponibilidad (`whereHas('reservations', ... status=aceptada ... dates...)`) en `CuidadoresController::index` es full scan | Rendimiento (crítico con datos reales) | Índice compuesto |
| D7 | Columnas JSON (`servicios_ofrecidos`, `especie_preferida`, `tamanos_aceptados`, `participants`) sin índices funcionales | `whereJsonContains` es lento sin soporte | Rendimiento | Índices GIN (PostgreSQL) sobre columnas JSON críticas, o normalizar a tablas relacionales (`user_services`, `user_species_preference`…) |
| D8 | `chats.participants` JSON-array para relación N:N | Imposible hacer JOIN eficiente, hasParticipant itera en PHP | Rendimiento + integridad | Tabla pivote `chat_user(chat_id, user_id)` con FKs |
| D9 | `Host::getAverageRatingAttribute()` hace query en cada acceso — appended al model | **N+1 agravado**: listar 100 hosts → 100+ queries | Rendimiento crítico | `withAvg('reviews', 'rating')` en queries, quitar del `$appends` |
| D10 | Sin soft deletes en `reservations`, `reviews`, `users`, `hosts` | Auditoría/disputa imposible tras delete; cascades pueden borrar histórico | Medio | `SoftDeletes` trait en modelos que lo necesiten |
| D11 | `ON DELETE CASCADE` masivo (user → pets, hosts, reservations, reviews, chats, messages) | Borrar un usuario destruye histórico de otros (p.ej., reseñas que otros clientes vieron) | Alto regulatorio | Revisar política: `SET NULL` en FKs donde el histórico deba mantenerse |

### 2.3 Backend — Seguridad

| # | Problema | Por qué es problema | Impacto | Fix |
|---|----------|---------------------|---------|-----|
| S1 | **IDOR en `POST /reservations`**: no valida que `pet_id` pertenezca al usuario | Cliente A puede reservar mascota del cliente B | **CRÍTICO** | `Pet::where('id', $petId)->where('user_id', Auth::id())->firstOrFail()` en el Request/Controller |
| S2 | `sanctum.expiration = null` → tokens eternos | Token robado/leak = acceso indefinido | **CRÍTICO** | `config/sanctum.php`: `'expiration' => 60 * 24 * 7` (1 semana), rotar refresh |
| S3 | Sin rate-limit en `POST /login`, `POST /register`, `GET /cuidadores` | Fuerza bruta y scraping | **CRÍTICO** | `throttle:5,1` en login, `throttle:3,1` en register, `throttle:30,1` en /cuidadores |
| S4 | Upload validation solo `image\|max:XXX` | `image` valida extensión, no contenido MIME real; tamaños inconsistentes (2048 store / 5120 update) | Alto (subida de archivos maliciosos) | `image\|mimes:jpeg,png,jpg,webp\|dimensions:max_width=4000,max_height=4000\|max:2048` |
| S5 | **CORS en Nginx refleja `$http_origin`** (`nginx/default.conf` sección `/broadcasting/auth`) | Cualquier origen válido para auth → ataques cross-site | **CRÍTICO** | Lista blanca fija con `map $http_origin $cors_origin { … }` |
| S6 | `config/cors.php` con `allowed_methods=['*']`, `allowed_headers=['*']` y 6 orígenes localhost | En prod si no se cambia, rechaza dominios reales; demasiado permisivo | Alto | Usar `env('CORS_ALLOWED_ORIGINS')` y restringir a lo necesario |
| S7 | `EnsureFrontendRequestsAreStateful` **comentado** en `Kernel.php` | Sanctum SPA stateful no activo | Medio (si SPA usa cookies) | Descomentar si frontend opera con cookies; irrelevante si siempre usa Bearer |
| S8 | `APP_DEBUG=true` en `.env` | Stack traces, rutas internas y env expuestos ante cualquier excepción | **CRÍTICO en prod** | `APP_DEBUG=false` y `APP_ENV=production` al desplegar |
| S9 | **`VITE_GOOGLE_MAPS_KEY` en frontend `.env`** (necesariamente expuesta al cliente) | OK técnicamente (todas las keys de Maps lo están), **pero** sin restricciones de referer/quota se convierte en vector de abuso | Alto económico | Restringir key en Google Cloud Console a dominios (referer) + API concretas (Maps JS + Places) + quota |
| S10 | Sin email verification, sin reset password | Cuentas no verificables, imposible recuperar cuenta olvidada | Alto UX + compliance | `MustVerifyEmail`, rutas `/password/forgot` y `/password/reset` con notificación |
| S11 | Password mínimo 6 caracteres | Débil | Medio | `Password::min(10)->letters()->numbers()->mixedCase()` |
| S12 | No hay `authorize()` de rol en endpoints sensibles (`POST /hosts`, `GET /reservations/host`) | Cualquier autenticado puede llamar; lógica se basa en que no haya datos | Medio | Middleware/Policy de rol |

### 2.4 Backend — Rendimiento

| # | Problema | Impacto | Fix |
|---|----------|---------|-----|
| P1 | D9 — `average_rating` N+1 | Dashboard lento con muchos hosts | `withAvg('reviews', 'rating as average_rating')` |
| P2 | `GET /cuidadores` sin paginación | Crecimiento lineal hasta timeout | `->paginate(20)` + frontend scroll/pager |
| P3 | Haversine en SQL sin índice espacial | En > ~1k registros empieza a arrastrar | Bounding box pre-filter (`WHERE lat BETWEEN … AND lng BETWEEN …`) antes del Haversine; o PostGIS con `geography` |
| P4 | Cache driver = `database`, queue = `database` | Latencia vs Redis (que ya está desplegado en compose) | `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis` |
| P5 | `notifyNow()` en `ReservationController` aunque la notif implementa `ShouldQueue` | Bloquea request HTTP | `->notify()` (no `notifyNow`) |

### 2.5 Frontend — Arquitectura / Calidad

| # | Problema | Por qué es problema | Impacto | Fix |
|---|----------|---------------------|---------|-----|
| F1 | **`LoginCard.jsx` contiene código de otro proyecto ("ShipX")** | Archivo residual no usado pero en repo | Bajo (no se importa) pero es señal de desorden | Borrar |
| F2 | **God components**: `HostProfile.jsx` 761 LOC, `Cuidadores.jsx` 448, `Header.jsx` 457, `Empresas.jsx` 392 (duplica lógica de Cuidadores) | Imposibles de testear, entender, reutilizar | Alto | Descomposición (ver §5) |
| F3 | `chatContext.js` **duplica** `ChatContext.jsx` | Archivos fantasma generan imports confusos | Bajo | Borrar el duplicado |
| F4 | `socket.io-client` en `package.json` **sin usar** (el realtime usa Laravel Echo + Pusher JS) | Bundle inflado (~40KB extra) | Medio | `npm rm socket.io-client` |
| F5 | **Sin librería de formularios/validación** (no Yup, Zod, React Hook Form) | Validación ausente o manual; errores de servidor ignorados o genéricos | Alto UX | Adoptar `react-hook-form` + `zod` (o `yup`) con resolver |
| F6 | **Sin abstracción de servicios API** — llamadas inline en componentes, con duplicaciones (`fetchPets` llamado 2x en `Pets.jsx`) | Lógica dispersa, difícil de cachear/invalidar | Medio-alto | Capa `src/services/` con funciones puras + `@tanstack/react-query` para cache, retries y sync |
| F7 | Realtime **no funcional**: `lib/echo.js` retorna `null` y `ChatContext` hace polling cada 2s a varios endpoints | Backend invierte esfuerzo en broadcasting pero frontend no lo usa; polling saturará red | **ALTO** | Inicializar Echo correctamente con `VITE_PUSHER_*`, token Sanctum en auth header, y eliminar polling |
| F8 | Naming mezcla español/inglés (`cuidadores` vs `pets`, `tamaño` vs `size`, `fecha_entrada` vs `start_date`) | Cognitive load, bugs de mapping | Medio | Regla: **UI en español, código en inglés**; nombres de campos alineados al backend |
| F9 | Accesibilidad **casi nula** (2 atributos ARIA en todo el código) | WCAG AA probablemente no se pasa | Medio-alto (legal/UX) | Labels en inputs, `aria-label` en iconos-botón, focus visible, skip-links |
| F10 | Sin rutas lazy (`React.lazy` + `Suspense`) | Bundle inicial grande | Medio | Code-split por ruta |
| F11 | Sin Error Boundary global | Una excepción tumba toda la app | Alto | `ErrorBoundary` wrapper en `main.jsx` |
| F12 | `useEffect` con dependencias rotas en `useNotifications`, `useChatUnreadCount` (usan `user` pero no está en deps) | Stale closures, requests con token incorrecto | Medio | Añadir deps o usar refs; mejor aún, `react-query` |
| F13 | Google Maps cargado múltiples veces (`ReservaForm`, `FormularioBusqueda`, `Cuidadores`, `HostProfile`) | Parpadeos, consumo de cuota | Medio | Loader idempotente en `utils/loadGoogleMaps.js` ya existe — asegurar que todos lo usen |
| F14 | Sin redirección post-login a la ruta solicitada (`redirectAfterLogin` referenciado pero nunca seteado en el guard) | UX: tras login, siempre vuelves a `/` | Bajo | En `PrivateRoute`: guardar `location.pathname` en state, leerlo en login |
| F15 | `PrivateRoute` tiene dos loaders idénticos duplicados y lógica de roles mezclada | Mantenibilidad | Bajo | Extraer a un `RoleGuard` por rol |
| F16 | Sin 404 / NotFound route | Rutas inválidas quedan colgadas | Bajo | `<Route path="*" element={<NotFound />}/>` |

### 2.6 UX

- Toasts y modales bien resueltos, pero errores de servidor frecuentemente se tragan (ej.: `HostProfile.jsx` línea ~218 ignora errores de validación del backend).
- No hay skeletons (solo spinners) → layout shift.
- Formularios sin feedback de validación en tiempo real.
- `MisReservas` no muestra precio porque el modelo de reserva no tiene campo de precio → **flujo de pago ausente**.

### 2.7 Testing / Observabilidad / DX

- **0 tests funcionales** (solo los `ExampleTest.php` vacíos). Riesgo muy alto para una plataforma con transacciones económicas implícitas.
- Sin logging estructurado — `Log::info("🟡 ...")` con emojis.
- Sin Sentry/monitoring.
- Sin CI/CD detectado.
- Sin `README.md` útil ni documentación de API.

---

## 3. Prioridad

### Crítico (bloquean producción)
- **S1** IDOR en reservas
- **S2** Tokens Sanctum eternos
- **S3** Rate limiting en login/register/cuidadores
- **S5** CORS en Nginx reflejando origen
- **S8** `APP_DEBUG=true`
- **S10** Sin recovery de contraseña
- **D4** Desalineación `service_type` reservations ↔ service_prices (flujo de empresas roto)
- **F7** Realtime frontend deshabilitado (aunque polling mitiga — sigue siendo crítico por carga)
- **Ausencia de tests y de flujo de pago** (este último: decisión de producto, pero sin él no hay negocio real)

### Importante
- A1 Form Requests, A2 API Resources, A3 Policies, A4 Fat controllers
- D1 `hosts.user_id` unique, D6 índice reservations, D8 tabla pivote chat_user, D9 N+1 average_rating, D10 soft deletes
- P1-P5 rendimiento
- S4 validación MIME uploads, S6 CORS Laravel, S11 password strength, S12 RBAC por rol
- F2 God components, F5 validación de formularios, F6 capa servicios + React Query, F11 Error Boundary, F9 accesibilidad
- D11 estrategia de cascades

### Mejora recomendada
- A5 limpiar `routes/web.php`
- D2/D3 CHECK constraints
- D7 índices GIN/normalización JSON
- F1 borrar LoginCard.jsx, F3 borrar duplicado, F4 quitar socket.io-client
- F8 consistencia naming, F10 lazy routes, F12 deps de hooks, F13 loader GMaps único, F14 redirectAfterLogin, F15 RoleGuard, F16 404
- Sustituir emojis de logs, añadir Sentry, CI
- Documentación: README, OpenAPI/Swagger

---

## 4. Propuesta de mejora — hoja de ruta por fases

### Fase 0 — Pre-producción crítica (1–2 semanas)
**Bloqueantes de seguridad y flujo:**
1. Fix IDOR reservas (S1) + tests feature del flujo.
2. Activar expiración de tokens Sanctum (S2).
3. Rate limiting en auth y búsqueda pública (S3).
4. Corregir CORS Nginx (S5) y Laravel (S6).
5. `APP_DEBUG=false` + checklist de `.env` producción (S8).
6. Validación MIME + dimensiones en uploads (S4).
7. Reactivar Echo/Pusher en frontend y eliminar polling (F7).
8. Alinear `service_type` entre `reservations` y `service_prices` (D4).
9. Endpoints `forgot-password` + `reset-password` + `email-verify` (S10).
10. **Decisión de producto: precio en reservas** (añadir columna `total_price`, snapshot de tarifa al crear).

### Fase 1 — Cimentación arquitectónica (2–3 semanas)
11. Introducir **Form Requests** y migrar validaciones inline (A1).
12. Introducir **API Resources** y normalizar todas las respuestas (A2).
13. Introducir **Policies** y reemplazar checks inline (A3).
14. Extraer `MessageService`, `ChatService`, `ReservationService`, `GeolocationSearchService` (A4).
15. `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`, `notifyNow()` → `notify()` (P4, P5).
16. Índices y constraints DB (D1, D2, D3, D6), unique en `hosts.user_id`.
17. Soft deletes en reservas/reviews/users (D10) y revisión de cascades (D11).

### Fase 2 — Frontend robustez (2–3 semanas)
18. Capa `services/` + `@tanstack/react-query` (F6).
19. `react-hook-form` + `zod` en todos los formularios (F5).
20. Descomponer god components (F2): `HostProfile` → 5 subcomponentes; `Cuidadores`/`Empresas` → unificar en `<ProvidersList>` con props; `Header` → `DesktopNav`/`MobileNav`/`UserMenu`.
21. `ErrorBoundary` global + rutas `lazy` + `<Route path="*">` (F10, F11, F16).
22. Accesibilidad: labels, ARIA, focus, contraste (F9).
23. Limpieza: borrar `LoginCard.jsx`, `chatContext.js`, `socket.io-client`, `ModalController.jsx` (F1, F3, F4).

### Fase 3 — Rendimiento y escalabilidad (1–2 semanas)
24. `withAvg` para rating, paginación en `/cuidadores` y `/empresas` (P1, P2).
25. Bounding box + Haversine o migración a PostGIS (P3).
26. Tabla pivote `chat_user` (D8).
27. Evaluar índices GIN sobre JSON o normalización de `servicios_ofrecidos`, etc. (D7).

### Fase 4 — Calidad y operación (continuo)
28. **Tests**: PHPUnit feature-tests de cada flujo crítico (auth, reservas, chat, uploads); Vitest + React Testing Library en componentes clave.
29. Sentry (backend + frontend), logs estructurados (`Log::info(...)` con contexto JSON, sin emojis).
30. CI: lint + tests en PR.
31. Documentación: README detallado, OpenAPI (con `dedoc/scramble` o `knuckleswtf/scribe`).

### Fase 5 — Funcionalidad de producto pendiente
32. Pagos (Stripe/Redsys), pay-outs a cuidadores.
33. Panel admin.
34. Notificaciones multi-canal (email, push).
35. 2FA opcional.

---

## 5. Refactorización — ejemplos concretos

### 5.1 Fix IDOR en `ReservationController::store`
**Antes** (`backend/app/Http/Controllers/ReservationController.php`):
```php
$validated = $request->validate([
    'pet_id'       => 'required|exists:pets,id',
    'host_id'      => 'required|exists:hosts,id',
    'service_type' => 'required|in:alojamiento,domicilio,visitas,guarderia,paseo',
    'start_date'   => 'required|date',
    'end_date'     => 'required|date|after_or_equal:start_date',
    // ...
]);
$reservation = $request->user()->reservations()->create($validated);
```

**Después** — con Form Request + ownership:
```php
// app/Http/Requests/ReservationStoreRequest.php
class ReservationStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'pet_id' => [
                'required',
                Rule::exists('pets', 'id')->where('user_id', $this->user()->id),
            ],
            'host_id'      => ['required', 'exists:hosts,id'],
            'service_type' => ['required', Rule::in(ServiceType::cases())],
            'start_date'   => ['required', 'date', 'after_or_equal:today'],
            'end_date'     => ['required', 'date', 'after_or_equal:start_date'],
            'address'      => ['nullable', 'string', 'max:500'],
            'size'         => ['nullable', Rule::in(['pequeño','mediano','grande','gigante'])],
        ];
    }
}

// Controller
public function store(ReservationStoreRequest $request, ReservationService $svc)
{
    $reservation = $svc->create($request->user(), $request->validated());
    return new ReservationResource($reservation);
}
```

### 5.2 Eliminar N+1 en average_rating
**Antes** (`backend/app/Models/Host.php`):
```php
protected $appends = ['average_rating', 'profile_photo_url'];

public function getAverageRatingAttribute()
{
    return round($this->reviews()->avg('rating'), 1); // query por cada acceso
}
```

**Después**:
```php
// Quitar de $appends
protected $appends = ['profile_photo_url'];

// En controllers que listan hosts:
$hosts = Host::query()
    ->with('servicePrices')
    ->withAvg('reviews as average_rating', 'rating')
    ->withCount('reviews')
    ->paginate(20);
```

### 5.3 Reactivar Echo en frontend
**Antes** (`frontend/src/lib/echo.js`):
```js
export function getEcho() {
    return null; // ← realtime deshabilitado
}
```

**Después**:
```js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export function getEcho() {
    if (echoInstance) return echoInstance;

    const token = localStorage.getItem('auth-token');
    if (!token) return null;

    echoInstance = new Echo({
        broadcaster: 'pusher',
        key:       import.meta.env.VITE_PUSHER_APP_KEY,
        wsHost:    import.meta.env.VITE_PUSHER_HOST,
        wsPort:    Number(import.meta.env.VITE_PUSHER_PORT),
        forceTLS:  false,
        enabledTransports: ['ws'],
        cluster:   'mt1',
        authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
        auth: { headers: { Authorization: `Bearer ${token}` } },
    });
    return echoInstance;
}

export function resetEcho() {
    echoInstance?.disconnect();
    echoInstance = null;
}
```
Llamar `resetEcho()` en logout, y **eliminar el polling cada 2s** en `ChatContext.jsx`.

### 5.4 Policy para Host
```php
// app/Policies/HostPolicy.php
class HostPolicy
{
    public function update(User $user, Host $host): bool { return $host->user_id === $user->id; }
    public function delete(User $user, Host $host): bool { return $host->user_id === $user->id; }
}

// HostController::update()
public function update(HostUpdateRequest $req, Host $host)
{
    $this->authorize('update', $host);
    $host->update($req->validated());
    return new HostResource($host);
}
```

### 5.5 Descomposición de `HostProfile.jsx` (761 LOC)
```
pages/HostProfile.jsx               (~120 LOC — orquestador)
├── components/host-profile/
│   ├── IdentitySection.jsx         (nombre, tipo, título, descripción)
│   ├── CompanyFieldsSection.jsx    (CIF, dirección fiscal, licencias, equipo)
│   ├── ExperienceSection.jsx       (años, detalles, pets propios)
│   ├── ProfilePhotoUploader.jsx
│   ├── LocationSection.jsx         (Google Places + lat/lng)
│   └── ServicePricesEditor.jsx     (tabla dinámica)
└── hooks/
    └── useHostProfileForm.js       (react-hook-form + zod schema)
```

### 5.6 Capa de servicios + React Query (frontend)
```js
// src/services/reservations.js
import api from '@/lib/axios';

export const reservationsApi = {
  list:   () => api.get('/reservations').then(r => r.data),
  forHost:() => api.get('/reservations/host').then(r => r.data),
  create: (payload) => api.post('/reservations', payload).then(r => r.data),
  cancel: (id) => api.patch(`/reservations/${id}/cancel`).then(r => r.data),
  updateStatus: (id, status) => api.put(`/reservations/${id}`, { status }).then(r => r.data),
};

// src/hooks/useReservations.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '@/services/reservations';

export function useMyReservations() {
  return useQuery({ queryKey: ['reservations','mine'], queryFn: reservationsApi.list });
}
export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reservationsApi.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}
```

---

## 6. Validación de flujos

| Flujo | Estado | Notas |
|-------|--------|-------|
| Registro | **Mejorable** | Funciona pero sin email verification, password débil, postal_code sin formato validado |
| Login | **Correcto** | Bcrypt + Sanctum + revocación previa OK; falta rate-limit |
| Logout (single + all) | **Correcto** | Endpoints `/logout` y `/logout-all` bien |
| Gestión de perfil (User) | **Incompleto** | Solo actualiza `tamanos_aceptados/especie_preferida/servicios_ofrecidos`; **no hay cambio de password, email, foto ni ownership check** |
| CRUD Mascotas | **Correcto** | Ownership bien; max size inconsistente (2MB/5MB); MIME no validado |
| Búsqueda cuidadores | **Mejorable** | Funciona con filtros + Haversine; sin paginación ni ordenación |
| Búsqueda empresas | **Incompleto** | Solo listado plano, sin filtros backend ni geolocalización |
| CRUD Host (cuidador/empresa) | **Correcto/Mejorable** | Auto-cambio de rol OK, gallery nunca usada, sin validación CIF |
| Service prices | **Correcto** | Upsert bien; desconexión con enum de `reservations` (D4) |
| Crear reserva | **ROTO** | IDOR en `pet_id` (S1), sin conflicto de fechas, sin precio |
| Aceptar/Rechazar reserva | **Correcto** | Ownership OK, notifica al cliente |
| Cancelar reserva | **Correcto** | Limitado a estados `pendiente`/`aceptada` |
| Reseñas | **Mejorable** | Cualquiera puede reseñar sin haber completado reserva; updateOrCreate permite edición indefinida |
| Chat — listar/crear privado | **Correcto** | createPrivateChat detecta duplicados |
| Chat — enviar mensaje | **Correcto backend / roto frontend** | Broadcast bien; frontend no escucha, usa polling |
| Chat — marcar leído | **Correcto** | Endpoints individual y bulk |
| Notificaciones | **Básico** | Database-only, sin push/email, sin broadcast |
| Subida de imágenes | **Mejorable** | Sin MIME/dimensions; tamaños inconsistentes |
| Dashboards por rol | **Incompleto** | No hay dashboard admin; los de cuidador/cliente son páginas sueltas sin métricas |
| Navegación / guards | **Mejorable** | PrivateRoute OK funcional pero mezcla roles y duplica loaders; sin 404; sin redirectAfterLogin |

---

## 7. Recomendaciones profesionales

1. **Modularización del backend** por dominio (Auth, Pets, Hosts, Reservations, Chat) usando Service + Repository + Policy + Resource + Request, cada uno con su carpeta — facilita eventual extracción a microservicios.
2. **DTOs** (con `spatie/laravel-data`) para entrada/salida tipada en vez de arrays sueltos.
3. **Custom hooks React** por dominio: `useReservations`, `usePets`, `useCuidadores`, `useChat` — construidos sobre React Query para cache, invalidación y retry.
4. **Componentes reutilizables**: `<FormField>`, `<Avatar>`, `<EmptyState>`, `<Pagination>`, `<ServiceBadge>`, `<RatingStars>`, `<Spinner>` — todos ya parcialmente presentes pero inconsistentemente aplicados.
5. **Normalización de respuestas API**: `{ data, meta, links }` estilo JSON:API o Laravel Resource estándar — nunca mezclar `{success, data, message}` con arrays crudos.
6. **Validación robusta**: Form Requests con Rules (incluida `Rule::exists->where` para ownership), y en frontend Zod schemas compartibles si migran a TS.
7. **Políticas y gates** con middleware `can:` en rutas para checks declarativos.
8. **Logs estructurados** (`Log::info('reservation.created', ['reservation_id' => …, 'user_id' => …])`) y Sentry/Bugsnag.
9. **Tests**: mínimo coverage de 60% en controllers; tests E2E de los 3 flujos críticos (registro → reserva → chat); Playwright en frontend.
10. **Observabilidad**: Laravel Telescope en dev, métricas Prometheus en prod, dashboards Grafana.
11. **Optimización de queries**: `withAvg`, `withCount`, `withExists`, `select` específico, `chunk` para exports, índices compuestos.
12. **DX**: `.env.example` completo, `docker-compose up` debe arrancar todo en verde sin pasos manuales; `README.md` con setup + decisiones de diseño; pre-commit hooks (`pint`, `eslint`, `prettier`).
13. **Decisión TypeScript** en frontend: dado el tamaño ya alcanzado, migrar a TS en paralelo al refactor de god components evitará regresiones futuras. Zod schemas pueden inferir tipos.
14. **Feature flags** para activar/desactivar pagos, chat, etc., durante el despliegue gradual.
15. **RGPD**: política de retención, endpoint de export de datos de usuario, borrado real (distinto del soft delete) tras N días.

---

## Archivos críticos a modificar (resumen)

**Backend**
- [backend/routes/api.php](backend/routes/api.php) — rate limiters, eliminar `/login` duplicado de `web.php`
- [backend/app/Http/Controllers/ReservationController.php](backend/app/Http/Controllers/ReservationController.php) — IDOR fix (S1)
- [backend/app/Http/Controllers/MessageController.php](backend/app/Http/Controllers/MessageController.php) — extraer servicio (A4)
- [backend/app/Http/Controllers/HostController.php](backend/app/Http/Controllers/HostController.php) — policies, requests
- [backend/app/Http/Controllers/CuidadoresController.php](backend/app/Http/Controllers/CuidadoresController.php) — paginación, bbox + Haversine
- [backend/app/Models/Host.php](backend/app/Models/Host.php) — quitar `average_rating` de `$appends` (D9)
- [backend/config/sanctum.php](backend/config/sanctum.php) — expiration (S2)
- [backend/config/cors.php](backend/config/cors.php) — restringir (S6)
- [backend/app/Http/Kernel.php](backend/app/Http/Kernel.php) — descomentar stateful si aplica (S7)
- Nuevas carpetas: `app/Http/Requests/`, `app/Http/Resources/`, `app/Policies/`, `app/Services/`
- Nuevas migraciones: unique en `hosts.user_id`, índices reservations, tabla pivote `chat_user`, CHECK constraints, soft deletes
- [nginx/default.conf](nginx/default.conf) — CORS con whitelist (S5)

**Frontend**
- [frontend/src/lib/echo.js](frontend/src/lib/echo.js) — reactivar realtime (F7)
- [frontend/src/context/ChatContext.jsx](frontend/src/context/ChatContext.jsx) — quitar polling, usar Echo
- [frontend/src/pages/HostProfile.jsx](frontend/src/pages/HostProfile.jsx) — descomponer (F2)
- [frontend/src/components/Cuidadores.jsx](frontend/src/components/Cuidadores.jsx) + [frontend/src/components/Empresas.jsx](frontend/src/components/Empresas.jsx) — unificar (F2)
- [frontend/src/components/Header.jsx](frontend/src/components/Header.jsx) — descomponer (F2)
- [frontend/src/components/PrivateRoute.jsx](frontend/src/components/PrivateRoute.jsx) — simplificar + RoleGuard (F15)
- [frontend/src/components/LoginCard.jsx](frontend/src/components/LoginCard.jsx) — **borrar** (F1)
- [frontend/src/context/chatContext.js](frontend/src/context/chatContext.js) — **borrar duplicado** (F3)
- [frontend/package.json](frontend/package.json) — quitar `socket.io-client` (F4), añadir `@tanstack/react-query`, `react-hook-form`, `zod`
- [frontend/src/App.jsx](frontend/src/App.jsx) — lazy routes, `*` 404, `ErrorBoundary`

---

## Verificación

**Cómo validar los cambios de Fase 0 (crítico):**

1. **IDOR (S1)**: test feature:
   ```bash
   cd backend && php artisan test --filter=ReservationIdorTest
   ```
   caso: usuario A intenta reservar con `pet_id` del usuario B → espera 422/403.
2. **Rate limiting (S3)**: `for i in {1..10}; do curl -X POST .../login -d '...'; done` → el 6º debería devolver 429.
3. **Tokens expiran (S2)**: generar token, forzar `now()->addMinutes(X)` en test, llamar a `/user` → 401.
4. **CORS (S5, S6)**: `curl -H 'Origin: https://evil.com' -I http://localhost:8000/broadcasting/auth` → **sin** `Access-Control-Allow-Origin` en respuesta.
5. **Uploads (S4)**: intentar subir `.php` renombrado a `.jpg` → 422.
6. **Realtime (F7)**: abrir dos pestañas con usuarios distintos en un chat, enviar mensaje desde A → aparece en B **sin recargar y sin esperar 2s**; comprobar en DevTools → Network → WS que hay conexión activa y no hay polling a `/messages`.
7. **Flujos E2E** manuales: registro → login → crear mascota con foto → buscar cuidador → crear reserva → cuidador acepta → chat entre ambos → cliente deja reseña. Todos los pasos sin errores 500, sin 401 espurios, sin regresiones visibles.
8. `php artisan test` y `npm run test` (cuando existan) en verde en CI.

---

**Fin del informe.** Este plan está diseñado para ser ejecutado iterativamente: Fase 0 es innegociable antes de producción; Fases 1–3 pueden solaparse entre dos desarrolladores (uno backend, otro frontend); Fases 4–5 son continuas.

## Pendiente

Fase 0 residual (producto / decisiones)

B1/S10 Reset de contraseña + verificación de email — bloqueado por decisión de proveedor SMTP.
Fase 4 (calidad / tests)

Ampliar cobertura: PetTest, HostTest, ReviewTest, UserTest, MessageUpdate.
Revisar si los controllers deben filtrar contenido de usuarios soft-deleted (hoy withTrashed() no se usa — solo se impide login).
Fase 3 (rendimiento)

P3 Bounding box pre-filter en Haversine o migración a PostGIS.
D7 Índices GIN sobre columnas JSON (o normalizar servicios_ofrecidos, especie_preferida…).
D8 Tabla pivote chat_user sustituyendo chats.participants JSON.
Infraestructura / DX

Sentry (back + front), logs estructurados sin emojis, CI en PRs, README + OpenAPI.
F8 Unificar naming español/inglés (UI español, código inglés).
Producto (Fase 5)

Pagos (Stripe/Redsys), panel admin, push/email, 2FA.
Acciones tuyas fuera de código

Rotar y restringir la Google Maps API key (está committeada en frontend/.env).
APP_DEBUG=false en el .env real de producción.
