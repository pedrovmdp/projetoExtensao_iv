import { set } from "date-fns";
import { useEffect, useState } from "react";

export default function AutoCompleteInput({
  label,
  value,
  onSelect,
  fetchData,
  placeholder,
  error,
}) {
  const [query, setQuery] = useState(value || "");
  const [options, setOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      const timeout = setTimeout(async () => {
        const results = await fetchData(query);
        setOptions(results);
        setShowDropdown(true);
      }, 300); // debounce

      return () => clearTimeout(timeout);
    } else {
      setOptions([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.nome || item.razao_social);
    onSelect(item); // passa o objeto completo pro pai
    setShowDropdown(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(options.length > 0)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {showDropdown && options.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md mt-1 max-h-48 overflow-y-auto">
          {options.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {item.nome || item.razao_social}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}