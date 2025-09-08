// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6
                    bg-gradient-to-br from-slate-50 to-slate-200 relative">
      {/* pattern sutil de fundo */}
      <div className="pointer-events-none fixed inset-0 
          [background-image:radial-gradient(#00000011_1px,transparent_1px)]
          [background-size:16px_16px]" />
      <div className="relative z-10 w-full max-w-5xl">
        <Outlet />
      </div>
    </div>
  );
}
