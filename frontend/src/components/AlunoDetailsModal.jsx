import { User, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

const AlunoDetailsModal = ({ aluno, onClose, onEdit }) => {
  if (!aluno) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status) => {
    const colors = {
      Ativo: "bg-green-100 text-green-800",

      Encaminhado: "bg-blue-100 text-blue-800",

      "Em Avaliação": "bg-yellow-100 text-yellow-800",
    };

    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Detalhes do Aluno
            </h2>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Informações Pessoais */}
            <Section
              icon={User}
              title="Informações Pessoais"
              iconColor="text-blue-600"
            >
              <InfoGrid>
                <InfoItem label="Nome" value={aluno.nome} />
                <InfoItem label="CPF" value={aluno.cpf} />
                <InfoItem
                  label="Data de Nascimento"
                  value={formatDate(aluno.data_nascimento)}
                />

                {aluno.sexo && <InfoItem label="Sexo" value={aluno.sexo} />}

                {aluno.estado_civil && (
                  <InfoItem label="Estado Civil" value={aluno.estado_civil} />
                )}
              </InfoGrid>
            </Section>

            {/* Contato */}

            {(aluno.contato?.telefone ||
              aluno.contato?.celular ||
              aluno.contato?.email) && (
              <Section icon={Phone} title="Contato" iconColor="text-green-600">
                <InfoGrid>
                  {aluno.contato.telefone && (
                    <InfoItem label="Telefone" value={aluno.contato.telefone} />
                  )}

                  {aluno.contato.celular && (
                    <InfoItem label="Celular" value={aluno.contato.celular} />
                  )}

                  {aluno.contato.email && (
                    <InfoItem label="E-mail" value={aluno.contato.email} />
                  )}
                </InfoGrid>
              </Section>
            )}

            {/* Endereço */}

            {(aluno.endereco?.logradouro || aluno.endereco?.cidade) && (
              <Section icon={MapPin} title="Endereço" iconColor="text-red-600">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {[
                      aluno.endereco.logradouro,
                      aluno.endereco.numero,
                      aluno.endereco.complemento,
                      aluno.endereco.bairro,
                      aluno.endereco.cidade,
                      aluno.endereco.estado,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {aluno.endereco.cep && (
                    <p className="text-gray-600 mt-1">
                      CEP: {aluno.endereco.cep}
                    </p>
                  )}
                </div>
              </Section>
            )}

            {/* Dados Institucionais */}
            <Section
              icon={Calendar}
              title="Dados Institucionais"
              iconColor="text-orange-600"
            >
              <InfoGrid>
                <InfoItem
                  label="Data de Ingresso"
                  value={formatDate(aluno.dados_institucionais?.data_ingresso)}
                />
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(aluno.dados_institucionais?.status)}`}
                  >
                    {aluno.dados_institucionais?.status}
                  </span>
                </div>

                {aluno.dados_institucionais?.observacoes && (
                  <div className="md:col-span-2">
                    <InfoItem
                      label="Observações"
                      value={aluno.dados_institucionais.observacoes}
                    />
                  </div>
                )}
              </InfoGrid>
            </Section>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onEdit(aluno);

                onClose();
              }}
            >
              Editar Aluno
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares

const Section = ({ icon: Icon, title, iconColor, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />

      {title}
    </h3>

    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-gray-900">{value || "-"}</p>
  </div>
);

export default AlunoDetailsModal;