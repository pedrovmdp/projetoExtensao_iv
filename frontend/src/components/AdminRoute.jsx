import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * 🔐 Protege rotas que só podem ser acessadas por administradores
 * Exemplo de uso::
 * <Route path="/cadastro-usuario" element={<AdminRoute><CadastroUsuario /></AdminRoute>} />
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 🚫 Se não estiver logado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Se estiver logado mas não for admin
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Se for admin, permite acesso
  return children;
}