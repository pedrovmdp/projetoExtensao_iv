import { useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dark, setDark] = useState(false);

  // persiste a escolha no localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "E-mail inválido.";
    if (!password.trim()) next.password = "Informe sua senha.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 relative">
      {/* botão dark/light */}
      <button
        onClick={() => setDark((d) => !d)}
        className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 shadow"
      >
        {dark ? "🌙 Dark" : "☀️ Light"}
      </button>

      {/* pattern sutil */}
      <div className="pointer-events-none fixed inset-0 [background-image:radial-gradient(#00000011_1px,transparent_1px)] [background-size:16px_16px]" />

      <section
        className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl overflow-hidden"
        aria-labelledby="titulo-login"
      >
        {/* Painel ilustrativo (desktop) */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <header className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20" />
            <h2 className="font-semibold">Instituto Diomício Freitas</h2>
          </header>
          <div>
            <h3 className="text-2xl font-semibold leading-tight">
              Bem-vindo de volta!
            </h3>
            <p className="mt-2 text-white/90">
              Acesse o painel para acompanhar alunos, avaliações e encaminhamentos.
            </p>
          </div>
          <footer className="text-sm text-white/80">
            Dica: use um e-mail válido para ver a validação em ação.
          </footer>
        </div>

        {/* Card do formulário */}
        <div className="p-8 sm:p-10">
          <h1 id="titulo-login" className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Entrar na plataforma
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Digite suas credenciais para continuar.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-mail
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className={`w-full rounded-xl border px-4 py-3 bg-white/80 dark:bg-slate-950/60 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-slate-400
                    ${errors.email ? "border-rose-500" : "border-slate-300 dark:border-slate-700"}
                  `}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-erro" : undefined}
                />
                {errors.email && (
                  <p id="email-erro" className="mt-1 text-sm text-rose-600" role="alert" aria-live="polite">
                    {errors.email}
                  </p>
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
                  autoComplete="current-password"
                  className={`w-full rounded-xl border px-4 py-3 bg-white/80 dark:bg-slate-950/60 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-slate-400
                    ${errors.password ? "border-rose-500" : "border-slate-300 dark:border-slate-700"}
                  `}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-erro" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-slate-600 dark:text-slate-300 hover:underline"
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
                {errors.password && (
                  <p id="password-erro" className="mt-1 text-sm text-rose-600" role="alert" aria-live="polite">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Opções */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-slate-700"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Lembrar de mim
              </label>
              <button
                type="button"
                className="text-sm text-blue-700 hover:underline dark:text-blue-400"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full rounded-xl px-4 py-3 font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>

            {/* Rodapé opcional */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Ao continuar, você concorda com os termos de uso.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
