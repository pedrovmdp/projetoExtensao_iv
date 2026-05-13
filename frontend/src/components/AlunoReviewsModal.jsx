import { useState } from "react";
import { X, Calendar, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import ReviewDetailsModal from "./ReviewDetailsModal";

const AlunoReviewsModal = ({ isOpen, onClose, aluno, reviews, loading }) => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (!isOpen) return null;

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

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Avaliações do Aluno
                </h2>
                <p className="text-gray-600 mt-1">{aluno?.nome}</p>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-gray-500 ml-3">Carregando avaliações...</p>
              </div>
            ) : reviews.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Nenhuma avaliação encontrada para este aluno
                </p>
              </div>
            ) : (
              // Lista de Avaliações
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    {/* Header da Avaliação */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.tipo || "Avaliação"}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(review.data_avaliacao)}
                          </p>
                        </div>
                      </div>
                      {review.professor_responsavel && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          {review.professor_responsavel}
                        </div>
                      )}
                    </div>

                    {/* Respostas */}
                    {review.answers && review.answers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Total de respostas: {review.answers.length}
                        </p>
                        {/* Preview das primeiras 3 respostas */}
                        <div className="space-y-2">
                          {review.answers.slice(0, 3).map((answer) => (
                            <div key={answer.id} className="text-sm">
                              <span className="text-gray-600">
                                {answer.question?.question || "Questão"}:
                              </span>
                              <span className="ml-2 font-medium text-gray-900">
                                {answer.answer}
                              </span>
                            </div>
                          ))}
                          {review.answers.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              + {review.answers.length - 3} respostas
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Botão Ver Detalhes */}
                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-purple-600 hover:text-purple-700"
                        onClick={() => handleViewDetails(review)}
                      >
                        Ver Detalhes Completos
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Total: <span className="font-semibold">{reviews.length}</span>{" "}
                avaliação(ões)
              </p>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes Completos */}
      {showDetailsModal && (
        <ReviewDetailsModal
          review={selectedReview}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedReview(null);
          }}
        />
      )}
    </>
  );
};

export default AlunoReviewsModal;