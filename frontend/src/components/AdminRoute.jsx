import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * 🔐 Protege rotas que só podem ser acessadas por administradores
 * Verifica se o usuário tem role.name === "ADMIN"
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, isAuthenticatedLoading } = useSelector(
    (state) => state.auth,
  );

  // ⏳ Aguarda carregar dados do usuário
  if (isAuthenticatedLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🚫 Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Se não for ADMIN, redireciona para home
  if (user?.role?.name !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // ✅ Se for ADMIN, permite acesso
  return children;
}
