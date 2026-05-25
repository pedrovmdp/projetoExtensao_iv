// src/components/AutoCompleteInput.jsx
import { useState, useEffect, useRef } from "react";
import { Search, X, User, Building, Loader2 } from "lucide-react";

const AutoCompleteInput = ({
  label,
  placeholder,
  onSelect,
  fetchData,
  error,
  displayField = "nome", // Campo principal a exibir (ex: 'nome', 'razao_social')
  secondaryField = "cpf", // Campo secundário (ex: 'cpf', 'cnpj')
  icon: IconComponent = User, // Ícone customizável
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // 🔥 BUSCA EM TEMPO REAL - SÓ SE NÃO TIVER SELECIONADO
  useEffect(() => {
    // ✅ SE JÁ TEM ALGUÉM/ALGO SELECIONADO, NÃO BUSCA
    if (selectedItem) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      if (inputValue.length >= 2) {
        setIsLoading(true);
        try {
          const results = await fetchData(inputValue);
          setSuggestions(results || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Erro ao buscar:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, fetchData, selectedItem]);

  // 🔥 FECHAR DROPDOWN AO CLICAR FORA
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    // ✅ SE LIMPAR O INPUT, REMOVE A SELEÇÃO
    if (!value) {
      setSelectedItem(null);
      onSelect(null);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setInputValue(item[displayField] || item.nome || "");
    setShowDropdown(false); // ✅ Fecha dropdown
    setSuggestions([]); // ✅ Limpa sugestões
    onSelect(item);
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedItem(null);
    setSuggestions([]);
    setShowDropdown(false);
    onSelect(null);
    inputRef.current?.focus();
  };

  // ✅ DESABILITA INPUT QUANDO SELECIONADO
  const isDisabled = !!selectedItem;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={isDisabled} // ✅ Desabilita quando selecionado
          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            error ? "border-red-500" : "border-gray-300"
          } ${selectedItem ? "bg-green-50 cursor-not-allowed" : "bg-white"}`}
          autoComplete="off"
        />

        {/* Botão de Limpar */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-md transition-colors"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {/* Loading Spinner */}
        {isLoading && !selectedItem && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Mensagem de Erro */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Item Selecionado */}
      {selectedItem && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-green-600" />
            <div>
              <span className="text-sm text-green-800 font-medium block">
                {selectedItem[displayField] || selectedItem.nome || ""}
              </span>
              {secondaryField && selectedItem[secondaryField] && (
                <span className="text-xs text-green-600">
                  {secondaryField === "cnpj" ? "CNPJ: " : "CPF: "}
                  {selectedItem[secondaryField]}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 🔥 DROPDOWN - SÓ MOSTRA SE NÃO TEM NADA SELECIONADO */}
      {showDropdown && !selectedItem && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item[displayField] || item.nome || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {secondaryField && item[secondaryField] && (
                      <>
                        {secondaryField === "cnpj" ? "CNPJ" : "CPF"}: {item[secondaryField]}
                      </>
                    )}
                    {item.role?.name && ` • ${item.role.name}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {showDropdown &&
        !isLoading &&
        !selectedItem &&
        inputValue.length >= 2 &&
        suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
            <p className="text-sm text-gray-500 text-center">
              Nenhum resultado encontrado com "{inputValue}"
            </p>
          </div>
        )}
    </div>
  );
};

export default AutoCompleteInput;
