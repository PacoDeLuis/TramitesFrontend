import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ConsultaTramite from "./pages/cuidadano/ConsultaTramite";
import Dashboard from "./pages/Dashboard";
import CrearTramite from "./pages/recibos/CrearTramite";
import Caja from "./pages/caja/Caja";
import ListaTramites from "./pages/trami/ListaTramites";
import Recibos from "./pages/recibos/Recibos";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";

// ADMIN
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import CrearUsuario from "./pages/admin/CrearUsuario";
import ConfiguracionSistema from "./pages/admin/ConfiguracionSistema";
import Reportes from "./pages/admin/Reportes";
import Recibo from "./pages/trami/Recibo";
import AdminDocumentosFinales from "./pages/admin/AdminDocumentosFinales";

function App() {
  return (
    <Routes>

      {/* 🌍 RUTAS PÚBLICAS */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />

      <Route
        path="/consulta"
        element={
          <PublicRoute>
            <ConsultaTramite />
          </PublicRoute>
        }
      />

      {/* 🔐 PRIVADAS */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 📄 RECIBOS */}
      <Route
        path="/tramites/crear"
        element={
          <ProtectedRoute roles={["RECIBOS"]}>
            <Layout>
              <CrearTramite />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recibos"
        element={
          <ProtectedRoute roles={["RECIBOS"]}>
            <Layout>
              <Recibos />
            </Layout>
          </ProtectedRoute>
        }
      />
  
      <Route
        path="/recibo/:tramiteId"
        element={
          <ProtectedRoute>
            <Layout>
              <Recibo />
            </Layout>
          </ProtectedRoute>
        }
      />
     


      {/* 📂 TRÁMITES */}
      <Route
        path="/tramites"
        element={
          <ProtectedRoute roles={["TRAMITES"]}>
            <Layout>
              <ListaTramites />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tramites/procesar"
        element={
          <ProtectedRoute roles={["TRAMITES"]}>
            <Layout>
              <ListaTramites />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 💰 CAJA */}
      <Route
        path="/caja"
        element={
          <ProtectedRoute roles={["CAJA"]}>
            <Layout>
              <Caja />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 👑 ADMIN */}
      <Route
        path="/admin/reportes"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Layout>
              <Reportes />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Layout>
              <GestionUsuarios />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/usuarios/crear"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Layout>
              <CrearUsuario />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/configuracion"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Layout>
              <ConfiguracionSistema />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/documentos-finales"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Layout>
              <AdminDocumentosFinales />
            </Layout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
