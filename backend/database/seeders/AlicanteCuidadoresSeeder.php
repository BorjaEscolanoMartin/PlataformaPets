<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AlicanteCuidadoresSeeder extends Seeder
{
    public function run(): void
    {
        $cuidadores = [
            [
                'user' => [
                    'name'               => 'María García Sánchez',
                    'email'              => 'maria.garcia@plataformapets.test',
                    'password'           => Hash::make('password123'),
                    'role'               => 'cuidador',
                    'postal_code'        => '03001',
                    'latitude'           => 38.3452,
                    'longitude'          => -0.4810,
                    'servicios_ofrecidos'=> ['paseo', 'alojamiento', 'guarderia'],
                    'tamanos_aceptados'  => ['pequeño', 'mediano', 'grande'],
                    'especie_preferida'  => ['perro', 'gato'],
                ],
                'host' => [
                    'name'               => 'María García Sánchez',
                    'title'              => 'Cuidadora apasionada con 5 años de experiencia',
                    'description'        => 'Llevo más de 5 años cuidando mascotas en Alicante. Tengo un piso amplio en el centro con zona de juegos. Me adapto a las rutinas de tu mascota y envío fotos y actualizaciones diarias.',
                    'type'               => 'particular',
                    'location'           => 'Alicante, Alicante',
                    'latitude'           => 38.3452,
                    'longitude'          => -0.4810,
                    'phone'              => '612345678',
                    'experience_years'   => 5,
                    'experience_details' => 'He cuidado más de 80 mascotas distintas. Formación en primeros auxilios para animales.',
                    'has_own_pets'       => false,
                    'profile_photo'      => 'https://loremflickr.com/300/300/woman,dog?lock=11',
                ],
                'precios' => [
                    ['service_type' => 'paseo',         'price' => 12.00, 'price_unit' => 'por_hora'],
                    ['service_type' => 'alojamiento',   'price' => 25.00, 'price_unit' => 'por_noche'],
                    ['service_type' => 'guarderia',     'price' => 20.00, 'price_unit' => 'por_dia'],
                ],
            ],
            [
                'user' => [
                    'name'               => 'Carlos Martínez López',
                    'email'              => 'carlos.martinez@plataformapets.test',
                    'password'           => Hash::make('password123'),
                    'role'               => 'cuidador',
                    'postal_code'        => '03690',
                    'latitude'           => 38.3978,
                    'longitude'          => -0.5153,
                    'servicios_ofrecidos'=> ['paseo', 'alojamiento', 'cuidado_a_domicilio'],
                    'tamanos_aceptados'  => ['mediano', 'grande'],
                    'especie_preferida'  => ['perro'],
                ],
                'host' => [
                    'name'               => 'Carlos Martínez López',
                    'title'              => 'Especialista en perros de razas grandes',
                    'description'        => 'Vivo en San Vicente del Raspeig con jardín privado. Soy el cuidador ideal para perros grandes que necesitan espacio. Paseos diarios por los parques de la zona y mucho cariño garantizado.',
                    'type'               => 'particular',
                    'location'           => 'San Vicente del Raspeig, Alicante',
                    'latitude'           => 38.3978,
                    'longitude'          => -0.5153,
                    'phone'              => '623456789',
                    'experience_years'   => 7,
                    'experience_details' => 'Ex-trabajador de protectora de animales. Especializado en razas como Pastor Alemán, Labrador y Golden Retriever.',
                    'has_own_pets'       => true,
                    'own_pets_description' => 'Tengo un Golden Retriever de 3 años, muy sociable.',
                    'profile_photo'      => 'https://loremflickr.com/300/300/man,dog?lock=22',
                ],
                'precios' => [
                    ['service_type' => 'paseo',               'price' => 14.00, 'price_unit' => 'por_hora'],
                    ['service_type' => 'alojamiento',         'price' => 30.00, 'price_unit' => 'por_noche'],
                    ['service_type' => 'cuidado_a_domicilio', 'price' => 22.00, 'price_unit' => 'por_dia'],
                ],
            ],
            [
                'user' => [
                    'name'               => 'Ana Rodríguez Pérez',
                    'email'              => 'ana.rodriguez@plataformapets.test',
                    'password'           => Hash::make('password123'),
                    'role'               => 'cuidador',
                    'postal_code'        => '03110',
                    'latitude'           => 38.4311,
                    'longitude'          => -0.4500,
                    'servicios_ofrecidos'=> ['guarderia', 'visitas_a_domicilio', 'cuidado_a_domicilio'],
                    'tamanos_aceptados'  => ['pequeño', 'mediano'],
                    'especie_preferida'  => ['perro', 'gato', 'otro'],
                ],
                'host' => [
                    'name'               => 'Ana Rodríguez Pérez',
                    'title'              => 'Amante de los animales, cuidado con cariño',
                    'description'        => 'Ofrezco guardería diurna y visitas a domicilio en Mutxamel y alrededores. Me encargo de alimentación, paseos cortos y compañía. Tu mascota estará como en casa.',
                    'type'               => 'particular',
                    'location'           => 'Mutxamel, Alicante',
                    'latitude'           => 38.4311,
                    'longitude'          => -0.4500,
                    'phone'              => '634567890',
                    'experience_years'   => 3,
                    'experience_details' => 'Veterinaria en formación. Experiencia con animales de diversas especies.',
                    'has_own_pets'       => true,
                    'own_pets_description' => 'Tengo dos gatos y un conejo enano.',
                    'profile_photo'      => 'https://loremflickr.com/300/300/woman,cat?lock=33',
                ],
                'precios' => [
                    ['service_type' => 'guarderia',           'price' => 18.00, 'price_unit' => 'por_dia'],
                    ['service_type' => 'visitas_a_domicilio', 'price' => 10.00, 'price_unit' => 'por_visita'],
                    ['service_type' => 'cuidado_a_domicilio', 'price' => 20.00, 'price_unit' => 'por_dia'],
                ],
            ],
            [
                'user' => [
                    'name'               => 'Pedro Gómez Navarro',
                    'email'              => 'pedro.gomez@plataformapets.test',
                    'password'           => Hash::make('password123'),
                    'role'               => 'cuidador',
                    'postal_code'        => '03560',
                    'latitude'           => 38.4375,
                    'longitude'          => -0.3947,
                    'servicios_ofrecidos'=> ['alojamiento', 'paseo', 'guarderia'],
                    'tamanos_aceptados'  => ['pequeño', 'mediano', 'grande'],
                    'especie_preferida'  => ['perro'],
                ],
                'host' => [
                    'name'               => 'Pedro Gómez Navarro',
                    'title'              => 'Cuidador certificado con jardín amplio',
                    'description'        => 'Casa con jardín de 200m² en El Campello, a 5 minutos de la playa. Ofrezco alojamiento y guardería con atención personalizada. Certificado en bienestar animal y primeros auxilios caninos.',
                    'type'               => 'particular',
                    'location'           => 'El Campello, Alicante',
                    'latitude'           => 38.4375,
                    'longitude'          => -0.3947,
                    'phone'              => '645678901',
                    'experience_years'   => 6,
                    'experience_details' => 'Certificado en bienestar animal por la Universidad de Alicante. He alojado más de 120 perros.',
                    'has_own_pets'       => false,
                    'profile_photo'      => 'https://loremflickr.com/300/300/man,dog,garden?lock=44',
                ],
                'precios' => [
                    ['service_type' => 'alojamiento', 'price' => 28.00, 'price_unit' => 'por_noche'],
                    ['service_type' => 'paseo',       'price' => 13.00, 'price_unit' => 'por_hora'],
                    ['service_type' => 'guarderia',   'price' => 22.00, 'price_unit' => 'por_dia'],
                ],
            ],
            [
                'user' => [
                    'name'               => 'Laura Fernández Torres',
                    'email'              => 'laura.fernandez@plataformapets.test',
                    'password'           => Hash::make('password123'),
                    'role'               => 'cuidador',
                    'postal_code'        => '03550',
                    'latitude'           => 38.4036,
                    'longitude'          => -0.4211,
                    'servicios_ofrecidos'=> ['visitas_a_domicilio', 'paseo', 'cuidado_a_domicilio'],
                    'tamanos_aceptados'  => ['pequeño', 'mediano'],
                    'especie_preferida'  => ['perro', 'gato'],
                ],
                'host' => [
                    'name'               => 'Laura Fernández Torres',
                    'title'              => 'Tu mascota en las mejores manos',
                    'description'        => 'Ofrezco visitas a domicilio y paseos en Sant Joan d\'Alacant y zonas cercanas. Soy flexible con horarios y envío actualizaciones con fotos durante cada servicio. Discreción y confianza garantizadas.',
                    'type'               => 'particular',
                    'location'           => 'Sant Joan d\'Alacant, Alicante',
                    'latitude'           => 38.4036,
                    'longitude'          => -0.4211,
                    'phone'              => '656789012',
                    'experience_years'   => 4,
                    'experience_details' => 'Trabajé 2 años en una clínica veterinaria y llevo 4 años como cuidadora independiente.',
                    'has_own_pets'       => true,
                    'own_pets_description' => 'Tengo una gata persa muy tranquila.',
                    'profile_photo'      => 'https://loremflickr.com/300/300/woman,pet?lock=55',
                ],
                'precios' => [
                    ['service_type' => 'visitas_a_domicilio', 'price' => 11.00, 'price_unit' => 'por_visita'],
                    ['service_type' => 'paseo',               'price' => 12.00, 'price_unit' => 'por_hora'],
                    ['service_type' => 'cuidado_a_domicilio', 'price' => 21.00, 'price_unit' => 'por_dia'],
                ],
            ],
        ];

        $empresas = [
            [
                'user' => [
                    'name'               => 'Clínica Veterinaria AlicantePets',
                    'email'              => 'info@alicantepets-vet.test',
                    'password'           => Hash::make('password123'),
                    'role'               => 'empresa',
                    'postal_code'        => '03002',
                    'latitude'           => 38.3550,
                    'longitude'          => -0.4800,
                    'servicios_ofrecidos'=> ['guarderia', 'visitas_a_domicilio'],
                    'tamanos_aceptados'  => ['pequeño', 'mediano', 'grande'],
                    'especie_preferida'  => ['perro', 'gato', 'otro'],
                ],
                'host' => [
                    'name'               => 'Clínica Veterinaria AlicantePets',
                    'title'              => 'Clínica veterinaria integral en el centro de Alicante',
                    'description'        => 'Somos una clínica veterinaria con más de 15 años de experiencia en Alicante. Ofrecemos servicio de guardería supervisada por veterinarios, visitas a domicilio y atención de urgencias. Tu mascota siempre bajo supervisión profesional.',
                    'type'               => 'empresa',
                    'location'           => 'Alicante, Alicante',
                    'latitude'           => 38.3550,
                    'longitude'          => -0.4800,
                    'phone'              => '965111222',
                    'experience_years'   => 15,
                    'experience_details' => 'Equipo de 8 veterinarios colegiados y 5 auxiliares. Instalaciones modernas con quirófano, laboratorio y UCI.',
                    'has_own_pets'       => false,
                    'profile_photo'      => 'https://loremflickr.com/300/300/veterinary,clinic?lock=66',
                    'cif'                => 'B03112233',
                    'fiscal_address'     => 'Calle Mayor 45, 03002 Alicante',
                    'licenses'           => 'Autorización sanitaria nº ALI-VET-2008-045. Colegio Oficial de Veterinarios de Alicante.',
                    'team_info'          => '8 veterinarios colegiados, 5 auxiliares veterinarios y 2 recepcionistas especializados.',
                ],
                'precios' => [
                    ['service_type' => 'guarderia',           'price' => 35.00, 'price_unit' => 'por_dia'],
                    ['service_type' => 'visitas_a_domicilio', 'price' => 45.00, 'price_unit' => 'por_visita'],
                ],
            ],
            [
                'user' => [
                    'name'               => 'Escuela Canina Costa Blanca',
                    'email'              => 'info@escuelacaninacb.test',
                    'password'           => Hash::make('password123'),
                    'role'               => 'empresa',
                    'postal_code'        => '03003',
                    'latitude'           => 38.3700,
                    'longitude'          => -0.4950,
                    'servicios_ofrecidos'=> ['paseo', 'guarderia', 'cuidado_a_domicilio'],
                    'tamanos_aceptados'  => ['pequeño', 'mediano', 'grande'],
                    'especie_preferida'  => ['perro'],
                ],
                'host' => [
                    'name'               => 'Escuela Canina Costa Blanca',
                    'title'              => 'Adiestramiento y cuidado canino profesional',
                    'description'        => 'Centro especializado en educación canina y cuidado de perros en Alicante. Ofrecemos adiestramiento, guardería con actividades de enriquecimiento y paseos en grupo con monitores certificados. Instalaciones de 1.500m² con zona de agility.',
                    'type'               => 'empresa',
                    'location'           => 'Alicante, Alicante',
                    'latitude'           => 38.3700,
                    'longitude'          => -0.4950,
                    'phone'              => '965333444',
                    'experience_years'   => 10,
                    'experience_details' => 'Centro afiliado a la Asociación Nacional de Educadores Caninos. Más de 500 perros adiestrados.',
                    'has_own_pets'       => false,
                    'profile_photo'      => 'https://loremflickr.com/300/300/dog,training?lock=77',
                    'cif'                => 'B03998877',
                    'fiscal_address'     => 'Avenida de la Costa 120, 03003 Alicante',
                    'licenses'           => 'Centro homologado por la Conselleria de Agricultura. Educadores certificados ICAN nivel 3.',
                    'team_info'          => '4 educadores caninos certificados y 3 auxiliares de guardería.',
                ],
                'precios' => [
                    ['service_type' => 'paseo',               'price' => 15.00, 'price_unit' => 'por_hora'],
                    ['service_type' => 'guarderia',           'price' => 30.00, 'price_unit' => 'por_dia'],
                    ['service_type' => 'cuidado_a_domicilio', 'price' => 40.00, 'price_unit' => 'por_dia'],
                ],
            ],
        ];

        foreach (array_merge($cuidadores, $empresas) as $data) {
            $user = User::create($data['user']);

            $host = $user->host()->create([
                ...$data['host'],
                'user_id' => $user->id,
            ]);

            foreach ($data['precios'] as $precio) {
                $host->servicePrices()->create($precio);
            }
        }
    }
}
