import { useEffect, useState } from "react";
import {
  ClipboardList,
  Save,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import { useDispatch, useSelector } from "react-redux";
import { addReview } from "../../store/features/reviewSlice";
import { getAllPeople, searchPeople } from "../../store/features/peopleSlice";
import AutoCompleteInput from "../components/AutoCompleteInput";
import { getAllQuestions } from "../../store/features/questionsSlice";
import { toast } from "sonner";

const AvaliacaoAluno = () => {
  const dispatch = useDispatch();
  const { list: questions, isLoading: questionsLoading } = useSelector(
    (state) => state.questions,
  );
  const {
    loading: reviewLoading,
    success,
    error: reviewError,
  } = useSelector((state) => state.reviews);

  const [formData, setFormData] = useState({
    personId: null, // ✅ Backend espera personId
    tipo: "",
    professor_responsavel: "",
    respostas: {}, // ✅ Formato: { questionId: answer }
  });

  const [errors, setErrors] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  // 🔥 CARREGAR QUESTÕES DO BACKEND
  useEffect(() => {
    if (questions.length === 0) {
      dispatch(getAllQuestions());
    }
  }, [dispatch]);

  // 🔥 DIVIDIR QUESTÕES EM SEÇÕES
  const secoes = [
    { titulo: "Comportamento e Regras", questoes: questions.slice(0, 8) },
    { titulo: "Aspectos Emocionais", questoes: questions.slice(8, 18) },
    {
      titulo: "Pontualidade e Responsabilidade",
      questoes: questions.slice(18, 22),
    },
    {
      titulo: "Higiene e Cuidados Pessoais",
      questoes: questions.slice(22, 26),
    },
    { titulo: "Medicação e Saúde", questoes: questions.slice(26, 28) },
    { titulo: "Organização e Autonomia", questoes: questions.slice(28, 33) },
    { titulo: "Interação Social", questoes: questions.slice(33, 39) },
    { titulo: "Participação Familiar", questoes: questions.slice(39, 46) },
  ];

  const opcoes = [
    { value: "sim", label: "Sim" },
    { value: "nao", label: "Não" },
    { value: "maioria", label: "Maioria das vezes" },
    { value: "raras", label: "Raras vezes" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRespostaChange = (questaoId, valor) => {
    setFormData((prev) => ({
      ...prev,
      respostas: {
        ...prev.respostas,
        [questaoId]: valor,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.personId) newErrors.personId = "Selecione um aluno";

    if (!formData.tipo) newErrors.tipo = "Tipo da avaliação é obrigatório";

    if (!formData.professor_responsavel)
      newErrors.professor_responsavel = "Professor responsável é obrigatório";

    // Verificar se todas as questões foram respondidas
    const questoesNaoRespondidas = questions.filter(
      (q) => !formData.respostas[q.id],
    );
    if (questoesNaoRespondidas.length > 0) {
      newErrors.respostas = `${questoesNaoRespondidas.length} questões não foram respondidas`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios", {
        description: "Verifique o aluno e as questões não respondidas.",
      });
      return;
    }

    // 🔥 FORMATO ESPERADO PELO BACKEND
    const reviewData = {
      personId: formData.personId, // ✅ ID da pessoa
      tipo: formData.tipo, // ✅ Tipo da avaliação
      professor_responsavel: formData.professor_responsavel, // ✅ Professor responsável
      answers: Object.entries(formData.respostas).map(
        ([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer: answer,
        }),
      ),
    };

    const loadingToast = toast.loading("Salvando avaliação...", {
      description: "Aguarde enquanto processamos os dados.",
    });

    try {
      const result = await dispatch(addReview(reviewData)).unwrap();
      toast.success("✅ Avaliação salva com sucesso!", {
        id: loadingToast,
        description: `A avaliação de ${formData.personName} foi registrada no sistema.`,
        duration: 3000,
      });
      // Limpar formulário
      setFormData({
        personId: "",
        tipo: "",
        professor_responsavel: "",
        respostas: {},
      });
      setCurrentSection(0);
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      toast.error(
        `❌ Erro: ${error.message || "Não foi possível salvar a avaliação"}`,
        {
          id: loadingToast,
          duration: 5000,
        },
      );
    }
  };

  // 🔥 BUSCAR ALUNOS (PESSOAS COM ROLE "ALUNO")
  const handleFetchStudents = async (name) => {
    if (!name || name.length < 2) return [];
    try {
      const action = await dispatch(searchPeople(name));
      return action.payload || [];
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      return [];
    }
  };

  const handleSelectStudent = (person) => {
    if (!person) {
      setFormData((prev) => ({
        ...prev,
        personId: null,
      }));
      return;
    }
    // ✅ EXTRAI O ID DA PESSOA
    setFormData((prev) => ({
      ...prev,
      personId: person.id, // ID extraído aqui
    }));
    if (errors.personId) {
      setErrors((prev) => ({ ...prev, personId: "" }));
    }
  };

  const getProgressPercentage = () => {
    if (questions.length === 0) return 0;
    const questoesRespondidas = Object.keys(formData.respostas).length;
    return Math.round((questoesRespondidas / questions.length) * 100);
  };

  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        icon={<ClipboardList className="w-8 h-8 text-purple-600" />}
        title="Avaliação de Aluno"
        text="Avaliação de usuário em período de experiência"
      />

      {/* Barra de Progresso */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progresso da Avaliação
          </span>
          <span className="text-sm text-gray-500">
            {getProgressPercentage()}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Dados da Avaliação
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nome do Aluno */}
            <AutoCompleteInput
              label="Nome do Aluno *"
              value={formData.personId ? "Aluno selecionado" : ""}
              onSelect={handleSelectStudent}
              fetchData={handleFetchStudents}
              placeholder="Digite o nome do aluno..."
              error={errors.personId}
            />

            {/* Tipo de Avaliação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Avaliação *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.tipo ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecione...</option>
                <option value="1ª Avaliação">1ª Avaliação</option>
                <option value="2ª Avaliação">2ª Avaliação</option>
              </select>
              {errors.tipo && (
                <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>
              )}
            </div>

            {/* Professor Responsável */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professor Responsável *
              </label>
              <input
                type="text"
                name="professor_responsavel"
                value={formData.professor_responsavel}
                onChange={handleInputChange}
                placeholder="Nome do professor"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.professor_responsavel
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.professor_responsavel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.professor_responsavel}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navegação entre seções */}
        {questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap gap-2">
              {secoes.map((secao, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={currentSection === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection(index)}
                  className={
                    currentSection === index
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  {secao.titulo}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Seção de Questões */}
        {questions.length > 0 &&
          secoes[currentSection]?.questoes.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {secoes[currentSection].titulo}
                </h2>
              </div>

              <div className="space-y-4">
                {secoes[currentSection].questoes.map((questao) => (
                  <div
                    key={questao.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-medium text-gray-500 mt-1">
                        {questao.id}.
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-3">
                          {questao.question || questao.texto}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {opcoes.map((opcao) => (
                            <label
                              key={opcao.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`questao_${questao.id}`}
                                value={opcao.value}
                                checked={
                                  formData.respostas[questao.id] === opcao.value
                                }
                                onChange={(e) =>
                                  handleRespostaChange(
                                    questao.id,
                                    e.target.value,
                                  )
                                }
                                className="text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">
                                {opcao.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {formData.respostas[questao.id] && (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navegação entre seções */}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setCurrentSection(Math.max(0, currentSection - 1))
                  }
                  disabled={currentSection === 0}
                >
                  Seção Anterior
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setCurrentSection(
                      Math.min(secoes.length - 1, currentSection + 1),
                    )
                  }
                  disabled={currentSection === secoes.length - 1}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Próxima Seção
                </Button>
              </div>
            </div>
          )}

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={reviewLoading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 disabled:opacity-50"
          >
            {reviewLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Avaliação
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AvaliacaoAluno;
