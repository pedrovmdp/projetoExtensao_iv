import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Eye,
  Edit,
  Download,
  FileText,
  User,
  BookCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import AlunoDetailsModal from "../components/AlunoDetailsModal";
import AlunoFormEdit from "../components/AlunoFormEdit";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPeople,
  searchPeople,
  updatePerson,
} from "../../store/features/peopleSlice";
import {
  fetchReviewById,
  fetchReviews,
} from "../../store/features/reviewSlice";
import AlunoReviewsModal from "../components/AlunoReviewsModal";

const INITIAL_FORM_DATA = {
  nome: "",
  cpf: "",
  data_nascimento: "",
  telefone: "",
  telefone_responsavel: "",
  nome_responsavel: "",
  data_entrada: "",
  info_medicamento: "",
  ativo: true,
};

const HistoricoAluno = () => {
  const dispatch = useDispatch();
  // ✅ Redux state (peopleSlice)
  const {
    list: people,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.people);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedAlunoReviews, setSelectedAlunoReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Carregar todos os alunos
  useEffect(() => {
    dispatch(getAllPeople());
  }, [dispatch]);

  // 🔍 BUSCA EM TEMPO REAL (igual Empresas Parceiras)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        try {
          await dispatch(searchPeople(searchTerm)).unwrap();
        } catch (error) {
          toast.error("Erro ao buscar alunos");
        }
      } else if (searchTerm.length === 0) {
        dispatch(getAllPeople());
      }
    }, 500); // ✅ Aguarda 500ms após parar de digitar
    return () => clearTimeout(delayDebounce); // Limpa timeout anterior
  }, [searchTerm, dispatch]);
  // Handler apenas atualiza o estado (não dispara busca)
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Filtro por status (local)
  const filteredAlunos = useMemo(() => {
    let result = [...people];

    if (statusFilter) {
      result = result.filter(
        (a) => a.ativo?.toString() === statusFilter.toString(),
      );
    }

    return result;
  }, [people, statusFilter]);

  // Estatísticas
  const stats = useMemo(
    () => ({
      total: people.length,
      ativos: people.filter((a) => a.ativo === true).length,
      encaminhados: people.filter((a) => a.status === "Encaminhado").length,
      avaliacao: people.filter((a) => a.status === "Em Avaliação").length,
    }),
    [people],
  );

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student) => {
    setFormData({
      nome: student.nome || "",
      cpf: student.cpf || "",
      data_nascimento: student.data_nascimento || "",
      telefone: student.telefone || "",
      nome_responsavel: student.nome_responsavel || "",
      telefone_responsavel: student.telefone_responsavel || "",
      data_entrada: student.data_entrada || "",
      info_medicamentos: student.info_medicamentos || "",
      ativo: student.ativo, // ✅ Mantém como boolean
    });
    setSelectedAluno(student);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    const loadingToast = toast.loading("Atualizando aluno...");

    try {
      await dispatch(
        updatePerson({
          id: selectedAluno.id,
          data: data,
        }),
      ).unwrap();
      toast.success("Aluno atualizado com sucesso!", { id: loadingToast });
      setShowForm(false);
      setFormData(INITIAL_FORM_DATA);
      setSelectedAluno(null);
      dispatch(getAllPeople());
    } catch (error) {
      toast.error("Erro ao atualizar aluno", { id: loadingToast });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(INITIAL_FORM_DATA);
    setSelectedAluno(null);
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status) => {
    const colors = {
      true: "bg-green-100 text-green-800",
      false: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          title="Histórico de Alunos"
          text="Visualize e gerencie o histórico de todos os alunos cadastrados"
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <LoadingSpinner text="Carregando alunos..." size="md" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <Header
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          title="Histórico de Alunos"
          text="Visualize e gerencie o histórico de todos os alunos cadastrados"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{message}</p>
          <button
            onClick={() => dispatch(getAllPeople())}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const handleViewReviews = async (student) => {
    setLoadingReviews(true);
    setShowReviewsModal(true);
    try {
      // Busca todas as reviews e filtra pelo personId
      const response = await dispatch(fetchReviews()).unwrap();
      const alunoReviews = response.filter(
        (review) => review.person.id === student.id,
      );
      setSelectedAlunoReviews(alunoReviews);
    } catch (error) {
      toast.error("Erro ao carregar avaliações");
      setSelectedAlunoReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        icon={<FileText className="w-8 h-8 text-blue-600" />}
        title="Histórico de Alunos"
        text="Visualize e gerencie o histórico de todos os alunos cadastrados"
      />

      {!showForm ? (
        <>
          {/* Filtros */}
          <SearchInput
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            totalCount={filteredAlunos.length}
            countLabel="Alunos encontrados"
          />

          {/* Status Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Filtrar por status: Todos</option>
                <option value="true">Filtrar por status: Ativo</option>
                <option value="false">Filtrar por status: Inativo</option>
              </select>

              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total de Alunos"
              value={stats.total}
              variant="compact"
            />
            <StatCard 
              title="Ativos" 
              value={stats.ativos}
              variant="compact"
            />
            <StatCard
              title="Encaminhados"
              value={stats.encaminhados}
              variant="compact"
            />
            <StatCard
              title="Em Avaliação"
              value={stats.avaliacao}
              variant="compact"
            />
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredAlunos.length === 0 ? (
              <EmptyState
                icon={User}
                title="Nenhum aluno encontrado"
                description="Nenhum aluno corresponde aos critérios de filtro"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aluno
                      </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Idade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlunos.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.telefone || student.celular || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.cpf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.data_nascimento
                          ? `${calcularIdade(student.data_nascimento)} anos`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(student.data_entrada)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.ativo
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAluno(student);
                              setShowModal(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(student)}
                            className="cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => handleViewReviews(student)}
                          >
                            <BookCheck className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <AlunoFormEdit
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Modal */}
      {showModal && (
        <AlunoDetailsModal
          aluno={selectedAluno}
          onClose={() => setShowModal(false)}
          onEdit={handleEdit}
        />
      )}

      {showReviewsModal && (
        <AlunoReviewsModal
          isOpen={showReviewsModal}
          onClose={() => {
            setShowReviewsModal(false);
            setSelectedAlunoReviews([]);
          }}
          aluno={selectedAluno}
          reviews={selectedAlunoReviews}
          loading={loadingReviews}
        />
      )}
    </div>
  );
};

export default HistoricoAluno;
