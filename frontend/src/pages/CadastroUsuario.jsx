import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoles } from "../../store/features/roleSlice";
import { createUser } from "../../store/features/usersSlice";

export default function CadastroUsuario() {
  const dispatch = useDispatch();
  const { list: roles, isLoading: rolesLoading } = useSelector(
    (state) => state.roles,
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "", // ✅ Agora envia o ID da role
  });

  const [loading, setLoading] = useState(false);

  // 🔥 Carregar roles do backend
  useEffect(() => {
    if (roles.length === 0) {
      dispatch(getAllRoles());
    }
  }, [dispatch, roles.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.roleId
    ) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const loadingToast = toast.loading("Cadastrando usuário...");

    try {
      setLoading(true);

      // ✅ Envia para o backend NestJS
      await dispatch(
        createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleId: parseInt(formData.roleId), // ✅ Converte para número
        }),
      ).unwrap();

      toast.success("✅ Usuário cadastrado com sucesso!", { id: loadingToast });
      // Limpa o formulário
      setFormData({ name: "", email: "", password: "", roleId: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erro ao cadastrar usuário!", {
        id: loadingToast,
      });
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
            Nome completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome do usuário"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-mail *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="usuario@email.com"
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        {/* Função (Role) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Função *
          </label>
          {rolesLoading ? (
            <div className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
              Carregando funções...
            </div>
          ) : (
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione uma função</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading || rolesLoading}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : "Cadastrar Usuário"}
        </button>
      </form>
    </main>
  );
}