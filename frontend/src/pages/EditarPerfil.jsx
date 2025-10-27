import { useState } from "react";
import { User, Save } from "lucide-react";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import { Button } from "@/components/ui/button.jsx";

export default function EditarPerfil() {
  const [formData, setFormData] = useState({
    nome: "Professor Marques",
    email: "professor@professor.com",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Perfil atualizado:", formData);
    setMessage("Perfil atualizado com sucesso!");

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="space-y-6">
      <Header
        icon={<User className="w-8 h-8 text-blue-600" />}
        title="Editar Perfil"
        text="Atualize suas informações de acesso"
      />

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg">
          {message}
        </div>
      )}

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
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
}
