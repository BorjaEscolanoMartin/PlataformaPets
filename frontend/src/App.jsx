import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './layout/Layout';
import Inicio from './pages/Inicio';

const Pets = lazy(() => import('./pages/Pets'));
const PetsDetail = lazy(() => import('./pages/PetsDetail'));
const Cuidadores = lazy(() => import('./components/Cuidadores'));
const Empresas = lazy(() => import('./components/Empresas'));
const HostProfile = lazy(() => import('./pages/HostProfile'));
const PerfilCuidador = lazy(() => import('./pages/PerfilCuidador'));
const MisReservas = lazy(() => import('./pages/MisReservas'));
const ReservasRecibidas = lazy(() => import('./pages/ReservasRecibidas'));
const Chat = lazy(() => import('./pages/Chat'));
const RegisterEmpresa = lazy(() => import('./pages/RegisterEmpresa'));
const Notificaciones = lazy(() => import('./components/Notificaciones'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Layout><Inicio /></Layout>} />
          <Route path="/cuidadores" element={<Layout><Cuidadores /></Layout>} />
          <Route path="/registro-empresa" element={<Layout><RegisterEmpresa /></Layout>} />
          <Route path="/empresas" element={<Layout><Empresas /></Layout>} />

          <Route
            path="/mascotas"
            element={
              <Layout>
                <PrivateRoute>
                  <Pets />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/mascotas/:id"
            element={
              <Layout>
                <PrivateRoute>
                  <PetsDetail />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/mi-perfil-cuidador"
            element={
              <Layout>
                <PrivateRoute>
                  <HostProfile />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/cuidadores/:id"
            element={
              <Layout>
                <PrivateRoute>
                  <PerfilCuidador />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/mis-reservas"
            element={
              <Layout>
                <PrivateRoute>
                  <MisReservas />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/reservas-recibidas"
            element={
              <Layout>
                <PrivateRoute>
                  <ReservasRecibidas />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/notificaciones"
            element={
              <Layout>
                <PrivateRoute>
                  <Notificaciones />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
