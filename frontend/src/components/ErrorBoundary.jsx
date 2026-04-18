import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-semibold">Algo ha fallado</h1>
            <p className="text-gray-600">
              Hemos tenido un problema inesperado al cargar esta sección.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Reintentar
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
              >
                Ir al inicio
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
