import { useLocation } from "react-router-dom"
import { BarChart3, ClipboardList, FileText, HousePlus, UserPlus, Users, X } from "lucide-react"
import UserProfile from "./UserProfile"
import NavItem from "./NavItem"
import { Button } from '@/components/ui/button.jsx'



export default function Sidebar ({ isOpen, onClose }) {
    const location = useLocation()
  
    const navItems = [
        { to: '/', icon: BarChart3, label: 'Dashboard' },
        { to: '/cadastroAluno', icon: UserPlus, label: 'Cadastro aluno' },
        { to: '/cadastroEmpresa', icon: HousePlus, label: 'Cadastro empresa'},
        { to: '/historico', icon: FileText, label: 'Histórico aluno' },
        { to: '/avaliacao', icon: ClipboardList, label: 'Avaliação aluno' },
        { to: '/acompanhamento', icon: Users, label: 'Acompanhamento aluno' },
    ]

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && (
                <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-50 lg:hidden"
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
                {/* <Logo /> */}
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
                {/* <Logo /> */}
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
                        onClick={onClose}
                    >
                        {item.label}
                    </NavItem>
                ))}
                </nav>
            </div>
        </>
    )
}