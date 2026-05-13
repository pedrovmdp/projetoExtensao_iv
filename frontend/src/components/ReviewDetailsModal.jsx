import { X, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

const ReviewDetailsModal = ({ review, onClose }) => {
  if (!review) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Detalhes da Avaliação
              </h2>
              <p className="text-gray-600 mt-1">{review.tipo || "Avaliação"}</p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Informações da Avaliação */}
          <div className="space-y-6">
            {/* Dados Gerais */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Informações Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aluno</p>
                  <p className="text-gray-900">{review.person?.nome || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Data da Avaliação
                  </p>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(review.data_avaliacao)}
                  </p>
                </div>
                {review.professor_responsavel && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Professor Responsável
                    </p>
                    <p className="text-gray-900 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {review.professor_responsavel}
                    </p>
                  </div>
                )}
                {review.tipo && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tipo de Avaliação
                    </p>
                    <p className="text-gray-900">{review.tipo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Todas as Respostas */}
            {review.answers && review.answers.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Respostas ({review.answers.length})
                </h3>
                <div className="space-y-3">
                  {review.answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {answer.question?.question ||
                              "Questão não disponível"}
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                            <span className="font-semibold">Resposta:</span>{" "}
                            {answer.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observações (se houver) */}
            {review.observacoes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Observações
                </h3>
                <p className="text-gray-700">{review.observacoes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsModal;
