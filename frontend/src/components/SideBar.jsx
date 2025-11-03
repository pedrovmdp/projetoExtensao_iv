// 📁 src/components/Sidebar.jsx
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BarChart3,
  ClipboardList,
  FileText,
  HousePlus,
  UserPlus,
  Users,
  X,
  Building2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";
import NavItem from "./NavItem";
import LogoutDialog from "./LogoutDialog"; // ✅ Confirmação de logout

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  // 🔹 Itens padrão de navegação
  const navItems = [
    { to: "/", icon: BarChart3, label: "Dashboard" },
    { to: "/cadastro-aluno", icon: UserPlus, label: "Cadastro aluno" },
    { to: "/cadastro-empresa", icon: HousePlus, label: "Cadastro empresa" },
    { to: "/empresas", icon: Building2, label: "Empresas parceiras" },
    { to: "/historico", icon: FileText, label: "Histórico aluno" },
    { to: "/avaliacao", icon: ClipboardList, label: "Avaliação aluno" },
    { to: "/acompanhamento", icon: Users, label: "Acompanhamento aluno" },
  ];

  // 🔸 Apenas administradores veem o Gerenciar Usuários
  if (role === "admin") {
    navItems.push({
      to: "/cadastro-usuario",
      icon: Settings,
      label: "Gerenciar Usuários",
    });
  }

  return (
    <>
      {/* 🔹 Overlay (somente em mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 🔹 Container da Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 🔹 Cabeçalho (mobile) */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 🔹 Perfil do usuário */}
        <UserProfile />

        {/* 🔹 Navegação */}
        <nav className="mt-5 flex flex-col gap-1">
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

          {/* 🔹 Logout (com confirmação) */}
          <div className="mt-2">
            <LogoutDialog />
          </div>
        </nav>
      </div>
    </>
  );
}
