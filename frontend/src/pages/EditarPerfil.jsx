import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Save, Lock } from "lucide-react";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login } from "../../store/features/authSlice";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function EditarPerfil() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    nome: user?.name || "",
    email: user?.email || "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";

    if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const updatedUser = {
        ...user,
        name: formData.nome,
        email: formData.email,
        password: formData.novaSenha || user.password, // mantém a senha antiga se não mudar
      };

      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Falha ao atualizar perfil.");

      const updatedData = await response.json();
      dispatch(login(updatedData)); // atualiza Redux
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        icon={<User className="w-8 h-8 text-blue-600" />}
        title="Editar Perfil"
        text="Atualize suas informações de acesso"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <FormInput
          label="Nome"
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          error={errors.nome}
        />

        <FormInput
          label="E-mail"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        {/* 🔹 Acordeon de troca de senha */}
        <Accordion type="single" collapsible>
          <AccordionItem value="senha">
            <AccordionTrigger className="text-blue-600 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Deseja alterar sua senha?
            </AccordionTrigger>
            <AccordionContent className="space-y-4 mt-2">
              <FormInput
                label="Senha Atual"
                type="password"
                name="senhaAtual"
                value={formData.senhaAtual}
                onChange={handleChange}
                placeholder="Digite sua senha atual"
              />

              <FormInput
                label="Nova Senha"
                type="password"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleChange}
              />

              <FormInput
                label="Confirmar Nova Senha"
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                error={errors.confirmarSenha}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  );
}
