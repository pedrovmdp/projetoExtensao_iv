import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import { Toaster } from "sonner";
import "./App.css";

// Store
import { store } from "../store/index.js";

// Layout e proteção
import Sidebar from "./components/SideBar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Páginas principais
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
import { useDispatch } from "react-redux";
import { getMe } from "../store/features/authSlice.js";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (token) {
      dispatch(getMe());
    }
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Routes>
      {/* 🔓 ROTA PÚBLICA */}
      <Route path="/login" element={<Login />} />

      {/* 🔐 ROTAS PROTEGIDAS */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-50">
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header mobile */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">
                      Instituto Diomício Freitas
                    </h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(true)}
                      className="text-gray-600"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <main className="flex-1 overflow-auto p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/cadastro-aluno" element={<CadastroAluno />} />
                    <Route
                      path="/cadastro-empresa"
                      element={<CadastroEmpresa />}
                    />
                    <Route path="/historico" element={<HistoricoAluno />} />
                    <Route path="/avaliacao" element={<AvaliacaoAluno />} />
                    <Route
                      path="/acompanhamento"
                      element={<AcompanhamentoAluno />}
                    />
                    <Route path="/empresas" element={<EmpresasParceiras />} />
                    <Route path="/editar-perfil" element={<EditarPerfil />} />

                    {/* 🔐 ADMIN */}
                    <Route
                      path="/cadastro-usuario"
                      element={
                        <AdminRoute>
                          <CadastroUsuario />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
