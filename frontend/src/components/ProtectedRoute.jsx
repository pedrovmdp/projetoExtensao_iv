import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Se não estiver logado, redireciona para /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza a página normalmente
  return children;
}
