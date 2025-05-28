import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'
import Pets from './pages/Pets'
import PetsDetail from './pages/PetsDetail'
import Cuidadores from './components/Cuidadores'
import Empresas from './components/Empresas'
import HostProfile from './pages/HostProfile'
import PerfilCuidador from './pages/PerfilCuidador'
import MisReservas from './pages/MisReservas'
import ReservasRecibidas from './pages/ReservasRecibidas'
import Inicio from './pages/Inicio'
import Layout from './layout/Layout'
import RegisterEmpresa from './pages/RegisterEmpresa'
import ChatPage from './pages/ChatPage';
import Notificaciones from "./components/Notificaciones";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas con Layout */}
        <Route path="/" element={<Layout><Inicio /></Layout>} />
        <Route path="/cuidadores" element={<Layout><Cuidadores /></Layout>} />

        {/* Rutas de invitado (sin layout) */}
        <Route path="/registro-empresa" element={<RegisterEmpresa />} />

        {/* Rutas protegidas con Layout */}
        <Route
          path="/mascotas"
          element={
            <PrivateRoute>
              <Layout><Pets /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mascotas/:id"
          element={
            <PrivateRoute>
              <Layout><PetsDetail /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/empresas"
          element={
            <PrivateRoute>
              <Layout><Empresas /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mi-perfil-cuidador"
          element={
            <PrivateRoute>
              <Layout><HostProfile /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cuidadores/:id"
          element={
            <PrivateRoute>
              <Layout><PerfilCuidador /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mis-reservas"
          element={
            <PrivateRoute>
              <Layout><MisReservas /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reservas-recibidas"
          element={
            <PrivateRoute>
              <Layout><ReservasRecibidas /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notificaciones"
          element={
            <PrivateRoute>
              <Layout><Notificaciones /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <Layout><ChatPage /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/debug"
          element={
            <PrivateRoute>
              <Layout><div className="text-center text-red-500 p-8">DebugChat no disponible</div></Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App