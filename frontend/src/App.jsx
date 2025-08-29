import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

// Componentes das páginas
import Dashboard from './components/Dashboard'
import CadastroAluno from './components/CadastroAluno'
import HistoricoAluno from './components/HistoricoAluno'
import AvaliacaoAluno from './components/AvaliacaoAluno'
import AcompanhamentoAluno from './components/AcompanhamentoAluno'
import UserProfile from './components/UserProfile'
import NavItem from './components/NavItem'
import Logo from './components/Logo'

// Componente da Sidebar
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
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-blue-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header da sidebar */}
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
        
        {/* Logo para desktop */}
        <div className="hidden lg:block">
          <Logo />
        </div>
        
        {/* Perfil do usuário */}
        <UserProfile />
        
        {/* Navegação */}
        <nav className="mt-5">
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

// Componente principal do App
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/cadastro" element={<CadastroAluno />} />
              <Route path="/historico" element={<HistoricoAluno />} />
              <Route path="/avaliacao" element={<AvaliacaoAluno />} />
              <Route path="/acompanhamento" element={<AcompanhamentoAluno />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

