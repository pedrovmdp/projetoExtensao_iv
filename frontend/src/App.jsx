import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from './components/ui/button' // ajuste se não tiver alias "@"
import './App.css'
import Login from './components/Login'
import { store } from '../store'

// Páginas
import Dashboard from './components/Dashboard'
import CadastroAluno from './components/CadastroAluno'
import CadastroEmpresa from './components/CadastroEmpresa'
import HistoricoAluno from './components/HistoricoAluno'
import AvaliacaoAluno from './components/AvaliacaoAluno'
import AcompanhamentoAluno from './components/AcompanhamentoAluno'
import Sidebar from './components/SideBar'
import EmpresasParceiras from './components/EmpresasParceias'
import { Provider } from 'react-redux'

// Shell que separa layout de auth do layout do app
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Qualquer rota que comece com /login NÃO mostra sidebar/header
  const isAuthRoute = location.pathname.startsWith('/login')

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
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/cadastro-aluno" element={<CadastroAluno />} />
            <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />
            <Route path="/historico" element={<HistoricoAluno />} />
            <Route path="/avaliacao" element={<AvaliacaoAluno />} />
            <Route path="/acompanhamento" element={<AcompanhamentoAluno />} />
            <Route path="/empresas" element={<EmpresasParceiras />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// Componente principal com o Router
export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppShell />
      </Router>
    </Provider>
  )
}