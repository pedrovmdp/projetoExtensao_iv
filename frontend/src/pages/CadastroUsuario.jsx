import { useState } from "react";
import { toast } from "sonner";

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "professor",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Atualiza os campos dinamicamente
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Envia o usuário pro backend (json-server)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          img: `https://i.pravatar.cc/150?u=${formData.email}`,

        }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar usuário!");

      toast.success("Usuário cadastrado com sucesso!");
      setFormData({ name: "", email: "", password: "", role: "professor" });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar no servidor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Cadastro de Usuário
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome do usuário"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="usuario@email.com"
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        {/* Função */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Função
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="professor">Professor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Cadastrar Usuário"}
        </button>
      </form>
    </main>
  );
}
