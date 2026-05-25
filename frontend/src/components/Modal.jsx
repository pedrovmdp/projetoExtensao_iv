/**
 * Modal Component - Modal genérico reutilizável
 * 
 * Props:
 * - isOpen: boolean - Controla se o modal está aberto
 * - onClose: function - Callback ao fechar o modal
 * - title: string - Título do modal
 * - children: ReactNode - Conteúdo do modal
 * - maxWidth: string - Largura máxima (padrão: 'max-w-2xl')
 * - footer: ReactNode - Conteúdo do rodapé (opcional)
 * 
 * Exemplo:
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Detalhes">
 *   <p>Conteúdo aqui</p>
 * </Modal>
 */

import { X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
  footer,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
