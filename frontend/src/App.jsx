import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  ClipboardList, 
  Users, 
  BarChart3, 
  User,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'
import Login from './components/ui/Login'

// Páginas
import Dashboard from './components/Dashboard'
import CadastroAluno from './components/CadastroAluno'
import HistoricoAluno from './components/HistoricoAluno'
import AvaliacaoAluno from './components/AvaliacaoAluno'
import AcompanhamentoAluno from './components/AcompanhamentoAluno'

// Logo
const Logo = () => (
  <div className="flex items-center gap-3 p-4">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 flex items-center justify-center">
      <div className="w-6 h-6 bg-white rounded-full"></div>
    </div>
    <div className="text-white">
      <h1 className="text-lg font-bold">Instituto Diomício Freitas</h1>
    </div>
  </div>
)

// Perfil
const UserProfile = () => (
  <div className="p-4 border-b border-blue-600">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-purple-600" />
      </div>
      <div className="text-white">
        <p className="font-medium">Professor</p>
        <p className="text-sm text-blue-200">Login:</p>
      </div>
    </div>
  </div>
)

// Item navegação
const NavItem = ({ to, icon: Icon, children, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-600 transition-colors ${
      isActive ? 'bg-blue-600 border-r-2 border-white' : ''
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </Link>
)

// Sidebar
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navItems = [
    { to: '/', icon: BarChart3, label: 'Dashboard' },
    { to: '/cadastro', icon: Plus, label: 'Cadastro aluno' },
    { to: '/historico', icon: FileText, label: 'Histórico Aluno' },
    { to: '/avaliacao', icon: ClipboardList, label: 'Avaliação aluno' },
    { to: '/acompanhamento', icon: Users, label: 'Acompanhamento aluno' },
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-blue-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Logo />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="hidden lg:block">
          <Logo />
        </div>
        <UserProfile />
        <nav className="mt-4">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              isActive={location.pathname === item.to}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
      </div>
    </>
  )
}

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

  // Layout padrão (com sidebar)
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cadastro" element={<CadastroAluno />} />
            <Route path="/historico" element={<HistoricoAluno />} />
            <Route path="/avaliacao" element={<AvaliacaoAluno />} />
            <Route path="/acompanhamento" element={<AcompanhamentoAluno />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// App
export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}
