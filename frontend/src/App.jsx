import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./App.css";
import { Toaster } from "sonner";
import { getMe } from "../store/features/authSlice.js";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroAluno from "./pages/CadastroAluno";
import CadastroEmpresa from "./pages/CadastroEmpresa";
import HistoricoAluno from "./pages/HistoricoAluno";
import AvaliacaoAluno from "./pages/AvaliacaoAluno";
import AcompanhamentoAluno from "./pages/AcompanhamentoAluno";
import EmpresasParceiras from "./pages/EmpresasParceias";
import EditarPerfil from "./pages/EditarPerfil";
import CadastroUsuario from "./pages/CadastroUsuario";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <>
      {/* Toast */}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#fff",
          },
          className: "my-toast",
          duration: 4000,
        }}
      />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= PRIVATE ================= */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/cadastro-aluno"
            element={<CadastroAluno />}
          />

          <Route
            path="/cadastro-empresa"
            element={<CadastroEmpresa />}
          />

          <Route
            path="/historico"
            element={<HistoricoAluno />}
          />

          <Route
            path="/avaliacao"
            element={<AvaliacaoAluno />}
          />

          <Route
            path="/acompanhamento"
            element={<AcompanhamentoAluno />}
          />

          <Route
            path="/empresas"
            element={<EmpresasParceiras />}
          />

          <Route
            path="/editar-perfil"
            element={<EditarPerfil />}
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/cadastro-usuario"
            element={
              <AdminRoute>
                <CadastroUsuario />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}