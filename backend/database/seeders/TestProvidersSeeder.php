<?php

namespace Database\Seeders;

use App\Models\Host;
use App\Models\ServicePrice;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestProvidersSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        $cuidadores = [
            [
                'email'    => 'ana.garcia@test.local',
                'name'     => 'Ana García',
                'photo'    => 'hosts/profile_photos/ana.jpg',
                'postal'   => '28001', 'lat' => 40.4168, 'lng' => -3.7038,
                'location' => 'Madrid',
                'title'    => 'Cuidadora con casa y jardín en Madrid centro',
                'desc'     => 'Vivo en un piso amplio con terraza, paseos diarios por el Retiro. Tengo experiencia con perros pequeños y medianos.',
                'phone'    => '600123001',
                'exp'      => 5, 'own_pets' => true, 'own_desc' => 'Un mestizo de 6 años llamado Toby.',
                'servicios'  => ['alojamiento', 'paseo'],
                'especies'   => ['perro'],
                'tamanos'    => ['pequeño', 'mediano'],
                'prices'     => [
                    ['service_type' => 'alojamiento', 'price' => 25.00, 'unit' => 'por_noche', 'desc' => 'Incluye 2 paseos diarios y comidas a horario.'],
                    ['service_type' => 'paseo',       'price' => 12.00, 'unit' => 'por_hora',  'desc' => 'Paseos individuales o en pequeños grupos.'],
                ],
            ],
            [
                'email'    => 'carlos.ruiz@test.local',
                'name'     => 'Carlos Ruiz',
                'photo'    => 'hosts/profile_photos/carlos.jpg',
                'postal'   => '46001', 'lat' => 39.4699, 'lng' => -0.3763,
                'location' => 'Valencia',
                'title'    => 'Cuidado a domicilio y visitas flexibles en Valencia',
                'desc'     => 'Voy a casa del cliente, doy de comer, paseo, administro medicación. Trabajo con perros y gatos de cualquier tamaño.',
                'phone'    => '600123002',
                'exp'      => 8, 'own_pets' => false, 'own_desc' => null,
                'servicios'  => ['cuidado_a_domicilio', 'visitas_a_domicilio'],
                'especies'   => ['perro', 'gato'],
                'tamanos'    => ['pequeño', 'mediano', 'grande', 'gigante'],
                'prices'     => [
                    ['service_type' => 'cuidado_a_domicilio', 'price' => 35.00, 'unit' => 'por_dia',    'desc' => 'Estancia completa en tu casa para que tu mascota mantenga su rutina.'],
                    ['service_type' => 'visitas_a_domicilio', 'price' => 15.00, 'unit' => 'por_visita', 'desc' => 'Visita de 30-45 minutos con paseo y comida.'],
                ],
            ],
            [
                'email'    => 'lucia.fernandez@test.local',
                'name'     => 'Lucía Fernández',
                'photo'    => 'hosts/profile_photos/lucia.jpg',
                'postal'   => '08001', 'lat' => 41.3851, 'lng' => 2.1734,
                'location' => 'Barcelona',
                'title'    => 'Guardería de día y paseos por Ciutat Vella',
                'desc'     => 'Ofrezco guardería diurna en mi local habilitado y paseos por el centro de Barcelona. Ideal si trabajas fuera.',
                'phone'    => '600123003',
                'exp'      => 3, 'own_pets' => true, 'own_desc' => 'Dos gatos adoptados, Nala y Simba.',
                'servicios'  => ['guarderia', 'paseo'],
                'especies'   => ['perro', 'gato'],
                'tamanos'    => ['pequeño', 'mediano'],
                'prices'     => [
                    ['service_type' => 'guarderia', 'price' => 20.00, 'unit' => 'por_dia',  'desc' => 'De 8:00 a 19:00, con horarios flexibles.'],
                    ['service_type' => 'paseo',     'price' => 10.00, 'unit' => 'por_hora', 'desc' => 'Paseos cortos y largos, zonas verdes incluidas.'],
                ],
            ],
            [
                'email'    => 'david.torres@test.local',
                'name'     => 'David Torres',
                'photo'    => 'hosts/profile_photos/david.jpg',
                'postal'   => '41001', 'lat' => 37.3891, 'lng' => -5.9845,
                'location' => 'Sevilla',
                'title'    => 'Especialista en gatos en Sevilla',
                'desc'     => 'Cuidador especializado en felinos. Alojamiento en casa tranquila sin perros, cuidado a domicilio y visitas.',
                'phone'    => '600123004',
                'exp'      => 10, 'own_pets' => true, 'own_desc' => 'Tres gatos propios, ambiente 100% felino.',
                'servicios'  => ['alojamiento', 'cuidado_a_domicilio', 'visitas_a_domicilio'],
                'especies'   => ['gato'],
                'tamanos'    => ['pequeño', 'mediano'],
                'prices'     => [
                    ['service_type' => 'alojamiento',         'price' => 18.00, 'unit' => 'por_noche',  'desc' => 'Habitación dedicada y zonas de altura para gatos.'],
                    ['service_type' => 'cuidado_a_domicilio', 'price' => 30.00, 'unit' => 'por_dia',    'desc' => 'Presencia continua si tu gato sufre estrés fuera de casa.'],
                    ['service_type' => 'visitas_a_domicilio', 'price' => 13.00, 'unit' => 'por_visita', 'desc' => 'Comida, limpieza del arenero y juego.'],
                ],
            ],
            [
                'email'    => 'marta.lopez@test.local',
                'name'     => 'Marta López',
                'photo'    => 'hosts/profile_photos/marta.jpg',
                'postal'   => '48001', 'lat' => 43.2630, 'lng' => -2.9350,
                'location' => 'Bilbao',
                'title'    => 'Paseos enérgicos y visitas en Bilbao',
                'desc'     => 'Perros activos bienvenidos. Rutas largas por el monte Artxanda y visitas flexibles a domicilio.',
                'phone'    => '600123005',
                'exp'      => 6, 'own_pets' => false, 'own_desc' => null,
                'servicios'  => ['paseo', 'visitas_a_domicilio'],
                'especies'   => ['perro'],
                'tamanos'    => ['pequeño', 'mediano', 'grande', 'gigante'],
                'prices'     => [
                    ['service_type' => 'paseo',               'price' => 14.00, 'unit' => 'por_hora',   'desc' => 'Paseos largos, incluye zonas de monte si el tiempo acompaña.'],
                    ['service_type' => 'visitas_a_domicilio', 'price' => 16.00, 'unit' => 'por_visita', 'desc' => 'Visita, paseo corto y tiempo de juego.'],
                ],
            ],
        ];

        foreach ($cuidadores as $c) {
            $user = User::updateOrCreate(
                ['email' => $c['email']],
                [
                    'name'                => $c['name'],
                    'password'            => $password,
                    'role'                => 'cuidador',
                    'postal_code'         => $c['postal'],
                    'latitude'            => $c['lat'],
                    'longitude'           => $c['lng'],
                    'servicios_ofrecidos' => $c['servicios'],
                    'especie_preferida'   => $c['especies'],
                    'tamanos_aceptados'   => $c['tamanos'],
                ]
            );

            $host = Host::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'name'                 => $c['name'],
                    'type'                 => 'particular',
                    'location'             => $c['location'],
                    'latitude'             => $c['lat'],
                    'longitude'            => $c['lng'],
                    'title'                => $c['title'],
                    'description'          => $c['desc'],
                    'phone'                => $c['phone'],
                    'experience_years'     => $c['exp'],
                    'experience_details'   => 'Atención personalizada, fotos y vídeos diarios.',
                    'has_own_pets'         => $c['own_pets'],
                    'own_pets_description' => $c['own_desc'],
                    'profile_photo'        => $c['photo'],
                ]
            );

            foreach ($c['prices'] as $p) {
                ServicePrice::updateOrCreate(
                    ['host_id' => $host->id, 'service_type' => $p['service_type']],
                    ['price' => $p['price'], 'price_unit' => $p['unit'], 'description' => $p['desc']]
                );
            }
        }

        $empresas = [
            [
                'email'    => 'adiestracanes@test.local',
                'name'     => 'Adiestracanes Madrid',
                'photo'    => 'hosts/profile_photos/adiestramiento.webp',
                'postal'   => '28002', 'lat' => 40.4376, 'lng' => -3.6795,
                'location' => 'Madrid',
                'title'    => 'Centro de adiestramiento canino profesional',
                'desc'     => 'Adiestramiento en positivo, obediencia básica y avanzada, modificación de conductas problemáticas.',
                'phone'    => '910001122',
                'cif'      => 'B87654321',
                'fiscal'   => 'Calle del Arenal 15, 28013 Madrid',
                'licenses' => 'Registro nº 28/ADI/00123 de la Comunidad de Madrid. Adiestrador titulado por la AEPE.',
                'team'     => 'Equipo de 3 adiestradores certificados con más de 8 años de experiencia media.',
                'exp'      => 12,
                'servicios'  => ['adiestramiento_basico', 'adiestramiento_avanzado', 'modificacion_conducta'],
                'prices'     => [
                    ['service_type' => 'adiestramiento_basico',   'price' => 45.00,  'unit' => 'por_sesion', 'desc' => 'Sesiones individuales de 1h para obediencia básica.'],
                    ['service_type' => 'adiestramiento_avanzado', 'price' => 60.00,  'unit' => 'por_sesion', 'desc' => 'Habilidades avanzadas, agility, señales a distancia.'],
                    ['service_type' => 'modificacion_conducta',   'price' => 350.00, 'unit' => 'por_sesion', 'desc' => 'Programa completo para ansiedad, agresividad o miedos (paquete de 6 sesiones).'],
                ],
            ],
            [
                'email'    => 'vet.patita@test.local',
                'name'     => 'Clínica Veterinaria Patita',
                'photo'    => 'hosts/profile_photos/veterinario.jpg',
                'postal'   => '46002', 'lat' => 39.4740, 'lng' => -0.3773,
                'location' => 'Valencia',
                'title'    => 'Clínica veterinaria 24 horas',
                'desc'     => 'Servicios veterinarios completos: consultas, vacunación, cirugía y emergencias 24h.',
                'phone'    => '960221133',
                'cif'      => 'B12345678',
                'fiscal'   => 'Gran Vía Marqués del Turia 40, 46005 Valencia',
                'licenses' => 'Registro nº 46/CV/00567 del Colegio Oficial de Veterinarios de Valencia.',
                'team'     => '4 veterinarios, 2 auxiliares técnicos y servicio de urgencias 24/7.',
                'exp'      => 15,
                'servicios'  => ['veterinario', 'vacunacion', 'emergencias', 'cirugia'],
                'prices'     => [
                    ['service_type' => 'veterinario',  'price' => 40.00,  'unit' => 'por_consulta',     'desc' => 'Consulta general con exploración y diagnóstico.'],
                    ['service_type' => 'vacunacion',   'price' => 25.00,  'unit' => 'por_vacuna',       'desc' => 'Incluye vacuna, revisión y cartilla.'],
                    ['service_type' => 'emergencias',  'price' => 90.00,  'unit' => 'por_consulta',     'desc' => 'Atención urgente 24h, 365 días al año.'],
                    ['service_type' => 'cirugia',      'price' => 250.00, 'unit' => 'por_intervencion', 'desc' => 'Cirugías programadas, incluye anestesia y recuperación.'],
                ],
            ],
        ];

        foreach ($empresas as $e) {
            $user = User::updateOrCreate(
                ['email' => $e['email']],
                [
                    'name'        => $e['name'],
                    'password'    => $password,
                    'role'        => 'empresa',
                    'postal_code' => $e['postal'],
                    'latitude'    => $e['lat'],
                    'longitude'   => $e['lng'],
                    'servicios_ofrecidos' => $e['servicios'],
                ]
            );

            $host = Host::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'name'             => $e['name'],
                    'type'             => 'empresa',
                    'location'         => $e['location'],
                    'latitude'         => $e['lat'],
                    'longitude'        => $e['lng'],
                    'title'            => $e['title'],
                    'description'      => $e['desc'],
                    'phone'            => $e['phone'],
                    'experience_years' => $e['exp'],
                    'cif'              => $e['cif'],
                    'fiscal_address'   => $e['fiscal'],
                    'licenses'         => $e['licenses'],
                    'team_info'        => $e['team'],
                    'profile_photo'    => $e['photo'],
                ]
            );

            foreach ($e['prices'] as $p) {
                ServicePrice::updateOrCreate(
                    ['host_id' => $host->id, 'service_type' => $p['service_type']],
                    ['price' => $p['price'], 'price_unit' => $p['unit'], 'description' => $p['desc']]
                );
            }
        }

        $this->command->info('Seed OK: 5 cuidadores + 2 empresas (password: password123).');
    }
}
