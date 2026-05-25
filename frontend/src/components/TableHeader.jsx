/**
 * TableHeader Component - Cabeçalho reutilizável para tabelas
 * 
 * Props:
 * - title: string - Título da seção
 * - description: string - Descrição (opcional)
 * - columns: array - Array com os nomes das colunas
 * 
 * Exemplo:
 * <TableHeader 
 *   title="Alunos Cadastrados" 
 *   description="Lista de todos os alunos"
 *   columns={['Nome', 'Email', 'Status', 'Ações']}
 * />
 */

export default function TableHeader({ title, description, columns }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>

      {/* Columns */}
      {columns && columns.length > 0 && (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      )}
    </div>
  );
}
