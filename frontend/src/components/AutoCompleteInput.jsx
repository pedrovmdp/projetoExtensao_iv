// src/components/AutoCompleteInput.jsx
import { useState, useEffect, useRef } from "react";
import { Search, X, User, Loader2 } from "lucide-react";

const AutoCompleteInput = ({
  label,
  placeholder,
  onSelect,
  fetchData,
  error,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // 🔥 BUSCA EM TEMPO REAL - SÓ SE NÃO TIVER SELECIONADO
  useEffect(() => {
    // ✅ SE JÁ TEM ALGUÉM SELECIONADO, NÃO BUSCA
    if (selectedPerson) {
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
  }, [inputValue, fetchData, selectedPerson]); // ✅ Adicionado selectedPerson

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
      setSelectedPerson(null);
      onSelect(null);
    }
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setInputValue(person.nome);
    setShowDropdown(false); // ✅ Fecha dropdown
    setSuggestions([]); // ✅ Limpa sugestões
    onSelect(person);
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedPerson(null);
    setSuggestions([]);
    setShowDropdown(false);
    onSelect(null);
    inputRef.current?.focus();
  };

  // ✅ DESABILITA INPUT QUANDO SELECIONADO
  const isDisabled = !!selectedPerson;

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
          } ${selectedPerson ? "bg-green-50 cursor-not-allowed" : "bg-white"}`}
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
        {isLoading && !selectedPerson && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Mensagem de Erro */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Pessoa Selecionada */}
      {selectedPerson && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            <div>
              <span className="text-sm text-green-800 font-medium block">
                {selectedPerson.nome}
              </span>
              <span className="text-xs text-green-600">
                CPF: {selectedPerson.cpf}
              </span>
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

      {/* 🔥 DROPDOWN - SÓ MOSTRA SE NÃO TEM NINGUÉM SELECIONADO */}
      {showDropdown && !selectedPerson && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((person) => (
            <div
              key={person.id}
              onClick={() => handleSelectPerson(person)}
              className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {person.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    CPF: {person.cpf}{" "}
                    {person.role?.name && `• ${person.role.name}`}
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
        !selectedPerson &&
        inputValue.length >= 2 &&
        suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
            <p className="text-sm text-gray-500 text-center">
              Nenhuma pessoa encontrada com "{inputValue}"
            </p>
          </div>
        )}
    </div>
  );
};

export default AutoCompleteInput;
