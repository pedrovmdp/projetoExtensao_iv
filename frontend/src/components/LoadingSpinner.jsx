/**
 * LoadingSpinner Component - Spinner de carregamento reutilizável
 * 
 * Props:
 * - text: string - Texto a exibir durante o carregamento (opcional)
 * - size: 'sm' | 'md' | 'lg' - Tamanho do spinner (padrão: 'md')
 * - fullHeight: boolean - Se deve ocupar altura total (padrão: false)
 * 
 * Exemplo:
 * <LoadingSpinner text="Carregando dados..." size="lg" />
 */

export default function LoadingSpinner({ text, size = "md", fullHeight = false }) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const heightClass = fullHeight ? "h-screen" : "";

  return (
    <div className={`flex items-center justify-center ${heightClass}`}>
      <div className="flex flex-col items-center gap-3">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeMap[size]}`}></div>
        {text && <p className="text-gray-500">{text}</p>}
      </div>
    </div>
  );
}
