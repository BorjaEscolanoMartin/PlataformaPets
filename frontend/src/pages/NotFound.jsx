import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-sm font-medium text-blue-600">404</p>
        <h1 className="text-3xl font-semibold">Página no encontrada</h1>
        <p className="text-gray-600">
          La dirección que has visitado no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
