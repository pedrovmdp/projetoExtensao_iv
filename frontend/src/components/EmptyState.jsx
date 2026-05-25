/**
 * EmptyState Component - Estado vazio reutilizável
 * 
 * Props:
 * - icon: React Component - Ícone a exibir
 * - title: string - Título
 * - description: string - Descrição (opcional)
 * - action: ReactNode - Botão de ação (opcional)
 * 
 * Exemplo:
 * <EmptyState 
 *   icon={Users}
 *   title="Nenhum aluno encontrado"
 *   description="Comece adicionando um novo aluno"
 *   action={<Button>Adicionar aluno</Button>}
 * />
 */

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
      <p className="text-gray-500 text-lg">{title}</p>
      {description && <p className="text-gray-400 text-sm mt-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
