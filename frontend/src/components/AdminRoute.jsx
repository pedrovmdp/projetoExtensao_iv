import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, isAuthenticatedLoading } = useSelector(
    (state) => state.auth
  );

  console.log({
    isAuthenticated,
    user,
    isAuthenticatedLoading,
  });

  // Loading
  if (isAuthenticatedLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Não é admin
  if (user?.role?.name !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Admin autorizado
  return children;
}