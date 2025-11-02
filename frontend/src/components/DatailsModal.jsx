import { Button } from "@/components/ui/button.jsx";

export default function DetailsModal({
  title,
  data,
  onClose,
  onEdit,
  fields = [], // array de seções a exibir
}) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {fields.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {section.icon && (
                    <section.icon
                      className={section.iconColor ? section.iconColor : `w-5 h-5 text-gray-600`}
                    />
                  )}
                  {section.title}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className={section.gridCol ? section.gridCol : `grid grid-cols-1 md:grid-cols-2 gap-4`}>
                    {section.items.map((item, i) => {
                      const value = data[item.key];

                      // Se o item tiver getStatusColor, renderiza span colorido
                      if (item.getStatusColor) {
                        return (
                          <div key={i}>
                            <p className="text-sm font-medium text-gray-600">{item.label}</p>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.getStatusColor(
                                value
                              )}`}
                            >
                              {value}
                            </span>
                          </div>
                        );
                      }

                      // Se tiver format, aplica a formatação
                      const displayValue = item.format ? item.format(value) : value;

                      return (
                        <div key={i}>
                          <p className="text-sm font-medium text-gray-600">{item.label}</p>
                          <p className="text-gray-900">{displayValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(onEdit || onClose) && (
            <div className="flex justify-end gap-3 mt-6">
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
              )}
              {onEdit && (
                <Button
                  onClick={() => onEdit(data)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Editar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
