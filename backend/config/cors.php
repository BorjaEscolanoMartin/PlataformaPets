<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth'],

    'allowed_methods' => ['*'],    'allowed_origins' => [
        'http://localhost:3000',  // Puerto de React
        'http://localhost:5173',  // Puerto de Vite
        'http://localhost:5174',  // Puerto alternativo de Vite
        'http://localhost:8000',
        'http://localhost',
        'http://127.0.0.1',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

