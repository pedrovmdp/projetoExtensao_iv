// 📁 src/components/LogoutDialog.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "../../store/features/authSlice";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutDialog() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso!");
    setOpen(false);
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 🔹 Botão de sair na sidebar */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center justify-start w-full rounded-none gap-3 mt-3
                     text-white hover:text-white focus:text-white active:text-white
                     hover:bg-blue-600 focus:bg-blue-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className="text-white cursor-pointer">Sair</span>
        </Button>
      </DialogTrigger>

      {/* 🔹 Modal de confirmação */}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar saída</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja encerrar a sessão?  
            Você precisará fazer login novamente para acessar o sistema.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            Sim, sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
