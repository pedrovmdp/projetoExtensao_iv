import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
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
import StatsCard from "../components/StatsCard";
import AlunoDetailsModal from "../components/AlunoDetailsModal";
import AlunoFormEdit from "../components/AlunoFormEdit";
import { useDispatch, useSelector } from "react-redux";

const INITIAL_FORM_DATA = {
  nome: "",
  cpf: "",
  rg: "",
  data_nascimento: "",
  sexo: "",
  estado_civil: "",
  contato: { telefone: "", celular: "", email: "" },
  endereco: {
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    cep: "",
    estado: "",
  },
  dados_institucionais: {
    data_ingresso: "",
    observacoes: "",
    status: "",
  },
};

const HistoricoAluno = () => {
  const dispatch = useDispatch();
  // Redux state
  const students = []; // useSelector(selectAllStudents);
  const loading = false; // useSelector(selectLoading);
  const error = null; // useSelector(selectError);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Carregar dados
  useEffect(() => {
    // dispatch(fetchStudents());
  }, [dispatch]);

  // Filtros
  const filteredAlunos = useMemo(() => {
    let result = [...students];

    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.nome.toLowerCase().includes(termo) ||
          a.cpf.toLowerCase().includes(termo),
      );
    }

    if (statusFilter) {
      result = result.filter(
        (a) =>
          a.dados_institucionais?.status?.toLowerCase() ===
          statusFilter.toLowerCase(),
      );
    }

    return result;
  }, [students, searchTerm, statusFilter]);

  // Estatísticas
  const stats = useMemo(
    () => ({
      total: students.length,
      ativos: students.filter((a) => a.dados_institucionais?.status === "Ativo")
        .length,
      encaminhados: students.filter(
        (a) => a.dados_institucionais?.status === "Encaminhado",
      ).length,
      avaliacao: students.filter(
        (a) => a.dados_institucionais?.status === "Em Avaliação",
      ).length,
    }),
    [students],
  );

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (student) => {
    setFormData({
      nome: student.nome || "",
      cpf: student.cpf || "",
      rg: student.rg || "",
      data_nascimento: student.data_nascimento || "",
      sexo: student.sexo || "",
      estado_civil: student.estado_civil || "",
      contato: {
        telefone: student.contato?.telefone || "",
        celular: student.contato?.celular || "",
        email: student.contato?.email || "",
      },
      endereco: {
        logradouro: student.endereco?.logradouro || "",
        numero: student.endereco?.numero || "",
        complemento: student.endereco?.complemento || "",
        bairro: student.endereco?.bairro || "",
        cidade: student.endereco?.cidade || "",
        cep: student.endereco?.cep || "",
        estado: student.endereco?.estado || "",
      },
      dados_institucionais: {
        data_ingresso: student.dados_institucionais?.data_ingresso || "",
        observacoes: student.dados_institucionais?.observacoes || "",
        status: student.dados_institucionais?.status || "",
      },
    });
    setSelectedAluno(student);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    const loadingToast = toast.loading("Atualizando aluno...");

    try {
      // await dispatch(updateStudent({ id: selectedAluno.id, updatedStudent: data })).unwrap();
      toast.success("Aluno atualizado com sucesso!", { id: loadingToast });
      setShowForm(false);
      setFormData(INITIAL_FORM_DATA);
      setSelectedAluno(null);
      // dispatch(fetchStudents());
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
      Ativo: "bg-green-100 text-green-800",
      Encaminhado: "bg-blue-100 text-blue-800",
      "Em Avaliação": "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Header
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          title="Histórico de Alunos"
          text="Visualize e gerencie o histórico de todos os alunos cadastrados"
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 ml-3">Carregando alunos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Header
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          title="Histórico de Alunos"
          text="Visualize e gerencie o histórico de todos os alunos cadastrados"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => dispatch(fetchStudents())}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:w-48 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Todos os status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Encaminhado">Encaminhado</option>
                  <option value="Em Avaliação">Em Avaliação</option>
                </select>
              </div>

              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              value={stats.total}
              label="Total de Alunos"
              color="blue"
            />
            <StatsCard value={stats.ativos} label="Ativos" color="green" />
            <StatsCard
              value={stats.encaminhados}
              label="Encaminhados"
              color="blue"
            />
            <StatsCard
              value={stats.avaliacao}
              label="Em Avaliação"
              color="yellow"
            />
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                      Data Ingresso
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
                              {student.contato?.telefone ||
                                student.contato?.celular ||
                                "-"}
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
                        {formatDate(
                          student.dados_institucionais?.data_ingresso,
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.dados_institucionais?.status)}`}
                        >
                          {student.dados_institucionais?.status}
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
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(student)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <BookCheck className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  );
};

export default HistoricoAluno;