import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import {  Menu } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

// Componentes das páginas
import Dashboard from './components/Dashboard'
import CadastroAluno from './components/CadastroAluno'
import CadastroEmpresa from './components/CadastroEmpresa'
import HistoricoAluno from './components/HistoricoAluno'
import AvaliacaoAluno from './components/AvaliacaoAluno'
import AcompanhamentoAluno from './components/AcompanhamentoAluno'
import Sidebar from './components/SideBar'

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
              <Route path="/cadastroAluno" element={<CadastroAluno />} />
              <Route path='/CadastroEmpresa' element={<CadastroEmpresa/>}/>
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