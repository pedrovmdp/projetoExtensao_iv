import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/features/authSlice";
import { User, Save } from "lucide-react";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditarPerfil() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // 🔹 Preenche o formulário com os dados atuais do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.name || "",
        email: user.email || "",
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha)
      newErrors.confirmarSenha = "As senhas não coincidem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // 🔹 Prepara os dados atualizados
      const updatedUser = {
        name: formData.nome,
        email: formData.email,
        password: formData.novaSenha ? formData.novaSenha : user.password,
        role: user.role,
      };

      // 🔹 Atualiza o usuário no JSON Server
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar o perfil no servidor.");
      }

      // 🔹 Atualiza Redux e localStorage
      dispatch(updateProfile(updatedUser));
      toast.success("Perfil atualizado com sucesso!");

      // Limpa senhas e encerra loading
      setFormData((prev) => ({
        ...prev,
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      }));
    } catch (err) {
      console.error(err);
      toast.error("Falha ao atualizar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
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

        <Button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  );
}
