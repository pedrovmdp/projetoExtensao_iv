/**
 * StatCard Component - Cartão reutilizável para exibir estatísticas
 * 
 * Props:
 * - title: string - Título da estatística
 * - value: number|string - Valor a exibir
 * - icon: React Component - Ícone (opcional)
 * - color: string - Cor de fundo (classe Tailwind, ex: 'bg-blue-500')
 * - subtitle: string - Subtítulo (opcional)
 * - loading: boolean - Estado de carregamento (opcional)
 * - variant: 'default' | 'compact' - Tamanho do cartão (opcional)
 * 
 * Exemplos:
 * <StatCard title="Alunos" value={120} icon={Users} color="bg-blue-500" />
 * <StatCard title="Ativos" value="85%" variant="compact" color="bg-green-500" />
 */

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = "bg-gray-500", 
  subtitle,
  loading = false,
  variant = "default"
}) {
  const isCompact = variant === "compact";

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isCompact ? 'p-4' : 'p-6'}`}>
      <div className={isCompact ? "text-center" : "flex items-center justify-between"}>
        <div>
          <p className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
            {title}
          </p>
          <p className={`${isCompact ? 'text-xl' : 'text-3xl'} font-bold text-gray-900 mt-2`}>
            {loading ? '...' : value}
          </p>
          {subtitle && !isCompact && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && !isCompact && (
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}