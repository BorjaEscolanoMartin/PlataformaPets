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
import Chat from './pages/Chat'
import Layout from './layout/Layout'
import RegisterEmpresa from './pages/RegisterEmpresa'
import Notificaciones from "./components/Notificaciones";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas con Layout */}
        <Route path="/" element={<Layout><Inicio /></Layout>} />
        <Route path="/cuidadores" element={<Layout><Cuidadores /></Layout>} />        {/* Rutas con Layout para empresas */}
        <Route path="/registro-empresa" element={<Layout><RegisterEmpresa /></Layout>} />{/* Rutas protegidas con Layout */}
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
          path="/empresas"
          element={
            <Layout>
              <PrivateRoute>
                <Empresas />
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
      </Routes>
    </Router>
  )
}

export default App