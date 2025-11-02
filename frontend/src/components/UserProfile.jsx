import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import loucao from "/loucao.png";

export default function UserProfile() {
  const navigate = useNavigate();

  // 🔹 Obtém o usuário logado diretamente do Redux
  const user = useSelector((state) => state.auth.user);

  // 🔹 Fallback se não houver usuário (ex: não logado)
  const defaultUser = {
    name: "Usuário não identificado",
    email: "sem-email@exemplo.com",
    img: loucao,
  };

  const currentUser = user || defaultUser;

  // 🔹 Se o backend retornar apenas a URL da imagem
  const profileImage =
    currentUser.img && currentUser.img.startsWith("http")
      ? currentUser.img
      : loucao;

  const handleEditProfile = () => {
    navigate("/editar-perfil");
  };

  return (
    <div className="p-4 border-b border-blue-600 bg-blue-700 text-white flex flex-col items-center gap-3">
      {/* Avatar */}
      <img
        src={profileImage}
        alt={`Foto de perfil de ${currentUser.name}`}
        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
      />

      {/* Informações */}
      <div className="text-center">
        <p className="text-lg font-semibold truncate max-w-[200px]">
          {currentUser.name}
        </p>
        <p className="text-sm text-white/80 truncate max-w-[200px]">
          {currentUser.email}
        </p>
      </div>

      {/* Botão editar perfil */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handleEditProfile}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium mt-2 transition-all"
      >
        <UserCog className="w-4 h-4" />
        Editar Perfil
      </Button>
    </div>
  );
}
