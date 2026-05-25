/**
 * SearchInput Component - Campo de busca reutilizável
 * 
 * Props:
 * - placeholder: string - Texto de placeholder
 * - value: string - Valor atual da busca
 * - onChange: function - Callback ao mudar o valor
 * - totalCount: number - Número total de itens (opcional)
 * - countLabel: string - Label para o total (opcional, padrão: 'Resultados')
 * 
 * Exemplo:
 * <SearchInput 
 *   placeholder="Buscar por nome..."
 *   value={searchTerm}
 *   onChange={(e) => setSearchTerm(e.target.value)}
 *   totalCount={20}
 *   countLabel="Empresas"
 * />
 */

import { Search } from "lucide-react";

export default function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
  totalCount,
  countLabel = "Resultados",
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Campo de busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Total de itens */}
        {totalCount !== undefined && (
          <div className="md:w-48">
            <div className="relative text-center">
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
              <p className="text-xs text-gray-600">{countLabel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
