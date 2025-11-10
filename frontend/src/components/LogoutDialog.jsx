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

export default function LogoutDialog({ className = "" }) {
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
      {/* 🔹 Botão que abre o dialog */}
      <DialogTrigger asChild>
        <button
          className={`flex items-center gap-2 p-2 text-white hover:bg-blue-600 w-full text-left ${className}`}
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </DialogTrigger>

      {/* 🔹 Modal de confirmação */}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar saída</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja encerrar a sessão?
            <br />
            Você precisará fazer login novamente para acessar o sistema.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Sim, sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}