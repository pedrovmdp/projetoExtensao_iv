// src/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Menu from "./../components/ui/Menu"; // ajuste o caminho

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-700 text-white">
        <Menu className="w-5 h-5" />
      </aside>

      {/* Área de conteúdo */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
