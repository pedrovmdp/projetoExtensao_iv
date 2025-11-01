import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  FileText,
  HousePlus,
  LogOut,
  UserPlus,
  Users,
  X,
  Building2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";
import UserProfile from "./UserProfile";
import NavItem from "./NavItem";
import ConfirmDialog from "./ConfirmDialog";
import { Button } from "@/components/ui/button.jsx";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);

  const navItems = [
    { to: "/", icon: BarChart3, label: "Dashboard" },
    { to: "/cadastro-aluno", icon: UserPlus, label: "Cadastro aluno" },
    { to: "/cadastro-empresa", icon: HousePlus, label: "Cadastro empresa" },
    { to: "/empresas", icon: Building2, label: "Empresas parceiras" },
    { to: "/historico", icon: FileText, label: "Histórico aluno" },
    { to: "/avaliacao", icon: ClipboardList, label: "Avaliação aluno" },
    { to: "/acompanhamento", icon: Users, label: "Acompanhamento aluno" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar principal */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-blue-700 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header mobile */}
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

        {/* Perfil do usuário */}
        <UserProfile />

        {/* Navegação */}
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

          {/* Botão de logout */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setOpenDialog(true)}
            className="flex items-center justify-start rounded-none w-full text-white cursor-pointer hover:text-white hover:bg-blue-600 gap-3 mt-3"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </nav>
      </div>

      {/* Dialog de confirmação de saída */}
      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Confirmar saída"
        description="Tem certeza de que deseja sair da plataforma?"
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={handleLogout}
      />
    </>
  );
}
