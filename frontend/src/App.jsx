import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import "./App.css";

// Redux
import { Provider } from "react-redux";
import { store } from "../store/index.js";





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

// Layout
import Sidebar from "./components/SideBar";


function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Oculta Sidebar em rotas de autenticação (login)
  const isAuthRoute = location.pathname.startsWith("/login");

  if (isAuthRoute) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-200 relative">
        <div className="pointer-events-none fixed inset-0 [background-image:radial-gradient(#00000011_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 w-full max-w-5xl">
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Conteúdo principal */}
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

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cadastro-aluno" element={<CadastroAluno />} />
            <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />
            <Route path="/historico" element={<HistoricoAluno />} />
            <Route path="/avaliacao" element={<AvaliacaoAluno />} />
            <Route path="/acompanhamento" element={<AcompanhamentoAluno />} />
            <Route path="/empresas" element={<EmpresasParceiras />} />
            <Route path="/editar-perfil" element={<EditarPerfil />} /> {/* 🔹 nova rota */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Componente principal com Provider + Router
export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppShell />
      </Router>
    </Provider>
  );
}
