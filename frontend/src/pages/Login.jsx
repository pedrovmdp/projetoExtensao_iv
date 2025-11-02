import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/features/authSlice";
import { toast } from "sonner";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Validação simples de formulário
  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "E-mail inválido.";
    if (!password.trim()) next.password = "Informe sua senha.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ✅ Autenticação real com json-server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:3000/users?email=${email}`);
      const data = await res.json();
      const user = data[0];

      if (user && user.password === password) {
        dispatch(login(user));
        toast.success(`Bem-vindo, ${user.name}!`);
        navigate("/");
      } else {
        toast.error("E-mail ou senha inválidos.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-200 relative">
      {/* Padrão visual de fundo */}
      <div className="pointer-events-none fixed inset-0 [background-image:radial-gradient(#00000011_1px,transparent_1px)] [background-size:16px_16px]" />

      <section
        className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-xl shadow-xl overflow-hidden"
        aria-labelledby="titulo-login"
      >
        {/* Painel lateral */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <header className="flex items-center gap-3">
            <img src="./logo.png" alt="logo IEEDF" className="w-18" />
            <h2 className="font-semibold">Instituto Diomício Freitas</h2>
          </header>

          <div>
            <h3 className="text-2xl font-semibold leading-tight">
              Bem-vindo de volta!
            </h3>
            <p className="mt-2 text-white/90">
              Acesse o painel para acompanhar alunos, avaliações e
              encaminhamentos.
            </p>
          </div>

          <footer className="text-sm text-white/80">
            Dica: use um e-mail válido para ver a validação em ação.
          </footer>
        </div>

        {/* Formulário */}
        <div className="p-8 sm:p-10">
          <h1 id="titulo-login" className="text-2xl font-semibold text-slate-900">
            Entrar na plataforma
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Digite suas credenciais para continuar.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  className={`w-full rounded-xl border px-4 py-3 bg-white/80 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-rose-500" : "border-slate-300"
                  }`}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-rose-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full rounded-xl border px-4 py-3 bg-white/80 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-rose-500" : "border-slate-300"
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600 hover:underline"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
              )}
            </div>

            {/* Opções */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-slate-300"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Lembrar de mim
              </label>
              <button
                type="button"
                className="text-sm text-blue-700 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full rounded-xl px-4 py-3 font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>

            <p className="text-center text-xs text-slate-500 mt-3">
              Ao continuar, você concorda com os termos de uso.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
