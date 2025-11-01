import { useEffect, useState } from "react";
import {
  Users,
  Save,
  Plus,
  Building,
  Calendar,
  User,
  Phone,
  FileText,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import TextRow from "../components/ui/textRow";
import Stats from "../components/Stats";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentByName } from "../../store/features/studentSlice";
import { fetchCompanytByName } from "../../store/features/companySlice";
import AutoCompleteInput from "../components/AutoCompleteInput";
import {
  addMonitoring,
  editMonitoring,
  fetchMonitorings,
  selectAllMonitoring,
} from "../../store/features/monitoringSlice";
import DetailsModal from "../components/DatailsModal";

const AcompanhamentoAluno = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAcompanhamento, setSelectedAcompanhamento] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const monitorings = useSelector(selectAllMonitoring);

  useEffect(() => {
    dispatch(fetchMonitorings());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    nomeAluno: "",
    empresa: "",
    responsavelRH: "",
    cargo: "",
    dataAdmissao: "",
    dataVisita: "",
    contatoCom: "",
    parecerGeral: "",
    status: "Ativo",
    idAluno: "",
    idEmpresa: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeAluno.trim())
      newErrors.nomeAluno = "Nome do aluno é obrigatório";
    if (!formData.empresa.trim())
      newErrors.empresa = "Nome da empresa é obrigatório";
    if (!formData.responsavelRH.trim())
      newErrors.responsavelRH = "Responsável RH é obrigatório";
    if (!formData.dataAdmissao)
      newErrors.dataAdmissao = "Data de admissão é obrigatória";
    if (!formData.dataVisita)
      newErrors.dataVisita = "Data da visita é obrigatória";
    if (!formData.contatoCom.trim())
      newErrors.contatoCom = "Contato é obrigatório";
    if (!formData.parecerGeral.trim())
      newErrors.parecerGeral = "Parecer geral é obrigatório";
    if (!formData.cargo.trim())
      newErrors.cargo = "Cargo do aluno é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetForm = () => {
    setFormData({
      nomeAluno: "",
      empresa: "",
      responsavelRH: "",
      cargo: "",
      dataAdmissao: "",
      dataVisita: "",
      contatoCom: "",
      parecerGeral: "",
      status: "Ativo",
      idAluno: "",
      idEmpresa: "",
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // se houver erros, sai

    const monitoringData = {
      nomeAluno: formData.nomeAluno,
      empresa: formData.empresa,
      responsavelRH: formData.responsavelRH,
      cargo: formData.cargo,
      dataAdmissao: formData.dataAdmissao,
      dataVisita: formData.dataVisita,
      contatoCom: formData.contatoCom,
      parecerGeral: formData.parecerGeral,
      status: formData.status,
      idAluno: formData.idAluno,
      idEmpresa: formData.idEmpresa,
    };

    try {
      if (editingId) {
        // 🔹 Edição
        await dispatch(editMonitoring({ id: editingId, monitoringData }));
        alert("Acompanhamento atualizado com sucesso!");
      } else {
        // 🔹 Criação
        await dispatch(addMonitoring(monitoringData));
        alert("Acompanhamento cadastrado com sucesso!");
      }

      handleResetForm();
      setShowForm(false);
      setEditingId(null);
    } catch (e) {
      console.error("Erro ao salvar acompanhamento:", e);
    }
  };

  const handleFetchStudents = async (name) => {
    const action = await dispatch(fetchStudentByName(name));
    return action.payload || [];
  };

  // 🔹 Função para buscar empresas
  const handleFetchCompanies = async (name) => {
    const action = await dispatch(fetchCompanytByName(name));
    return action.payload || [];
  };

  const handleSelectStudent = (student) => {
    setFormData((prev) => ({
      ...prev,
      idAluno: student.id,
      nomeAluno: student.nome,
    }));
  };

  const handleSelectCompany = (company) => {
    setFormData((prev) => ({
      ...prev,
      idEmpresa: company.id,
      empresa: company.razao_social,
    }));
  };

  const handleEdit = (acompanhamento) => {
    setFormData({
      nomeAluno: acompanhamento.nomeAluno,
      empresa: acompanhamento.empresa,
      responsavelRH: acompanhamento.responsavelRH,
      cargo: acompanhamento.cargo,
      dataAdmissao: acompanhamento.dataAdmissao,
      dataVisita: acompanhamento.dataVisita,
      contatoCom: acompanhamento.contatoCom,
      parecerGeral: acompanhamento.parecerGeral,
      status: acompanhamento.status,
      idAluno: acompanhamento.idAluno,
      idEmpresa: acompanhamento.idEmpresa,
    });
    setEditingId(acompanhamento.id);
    setShowForm(true);
  };

  const handleViewDetails = (acompanhamento) => {
    setSelectedAcompanhamento(acompanhamento);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Em Observação":
        return "bg-yellow-100 text-yellow-800";
      case "Finalizado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Header
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title={"Acompanhamento de Alunos"}
          text={"Acompanhamento no mercado de trabalho"}
        />

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Novo Acompanhamento
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      <Stats data={monitorings} />

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Editar Acompanhamento" : "Novo Acompanhamento"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados do Aluno e Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dados do Aluno
                  </h3>
                </div>

                <div className="space-y-4">
                  <AutoCompleteInput
                    label={"Nome do Aluno *"}
                    value={formData.nomeAluno}
                    onSelect={handleSelectStudent}
                    fetchData={handleFetchStudents}
                    placeholder={"Digite o nome do aluno..."}
                    error={errors.nomeAluno}
                  />

                  <FormInput
                    label={"Data de Admissão *"}
                    type={"date"}
                    name={"dataAdmissao"}
                    value={formData.dataAdmissao}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dataAdmissao ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={"Nome completo do aluno"}
                    error={errors.dataAdmissao}
                  />
                  <FormInput
                    label={"Cargo *"}
                    type={"text"}
                    name={"cargo"}
                    value={formData.cargo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cargo ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={"Cargo do aluno"}
                    error={errors.cargo}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dados da Empresa
                  </h3>
                </div>

                <div className="space-y-4">
                  <AutoCompleteInput
                    label="Razão Social da Empresa *"
                    value={formData.razao_social}
                    onSelect={handleSelectCompany}
                    fetchData={handleFetchCompanies}
                    placeholder="Nome da empresa"
                  />

                  <FormInput
                    label={"Responsável RH *"}
                    type={"text"}
                    name={"responsavelRH"}
                    value={formData.responsavelRH}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.responsavelRH
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={"Nome do responsável pelo RH"}
                    error={errors.responsavelRH}
                  />
                </div>
              </div>
            </div>

            {/* Dados da Visita */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Dados da Visita
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label={"Data da Visita *"}
                  type={"date"}
                  name={"dataVisita"}
                  value={formData.dataVisita}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dataVisita ? "border-red-500" : "border-gray-300"
                  }`}
                  error={errors.dataVisita}
                />

                <FormInput
                  label={"Contato com *"}
                  type={"text"}
                  name={"contatoCom"}
                  value={formData.contatoCom}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contatoCom ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={"Ex: Supervisor, Gerente, etc."}
                  error={errors.contatoCom}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Em Observação">Em Observação</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parecer Geral */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parecer Geral *
              </label>
              <textarea
                name="parecerGeral"
                value={formData.parecerGeral}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.parecerGeral ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Descreva o parecer geral sobre o acompanhamento do aluno na empresa..."
              />
              {errors.parecerGeral && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.parecerGeral}
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={handleResetForm}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Atualizar" : "Salvar"} Acompanhamento
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Acompanhamentos */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Acompanhamentos Registrados
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TextRow text={"Aluno"} />
                  <TextRow text={"Empresa"} />
                  <TextRow text={"Data Admissão"} />
                  <TextRow text={"Última Visita"} />
                  <TextRow text={"Status"} />
                  <TextRow text={"Ações"} />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monitorings.map((acompanhamento) => (
                  <tr key={acompanhamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {acompanhamento.nomeAluno}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {acompanhamento.empresa}
                      </div>
                      <div className="text-sm text-gray-500">
                        {acompanhamento.responsavelRH}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(acompanhamento.dataAdmissao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(acompanhamento.dataVisita)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          acompanhamento.status
                        )}`}
                      >
                        {acompanhamento.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(acompanhamento)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(acompanhamento)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showModal && selectedAcompanhamento && (
        <DetailsModal
          data={selectedAcompanhamento}
          onClose={() => setShowModal(false)}
          onEdit={handleEdit}
          formatDate={(d) => new Date(d).toLocaleDateString("pt-BR")}
          getStatusColor={getStatusColor}
          fields={[
            {
              title: "Dados do Aluno",
              icon: User,
              iconColor: "w-5 h-5 text-purple-600",
              items: [
                { key: "nomeAluno", label: "Nome" },
                { key: "cargo", label: "Cargo" },
                {
                  key: "dataAdmissao",
                  label: "Data de Admissão",
                  format: (val) => formatDate(val),
                },
              ],
            },
            {
              title: "Dados da Empresa",
              icon: Building,
              iconColor: "w-5 h-5 text-green-600",
              items: [
                { key: "empresa", label: "Empresa" },
                { key: "responsavelRH", label: "Responsável RH" },
              ],
            },
            {
              title: "Dados da Visita",
              icon: Calendar,
              iconColor: "w-5 h-5 text-orange-600",
              gridCol: "grid grid-cols-1 md:grid-cols-3 gap-4",
              items: [
                {
                  key: "dataVisita",
                  label: "Data da Visita",
                  format: (val) => formatDate(val),
                },
                { key: "contatoCom", label: "Contato Com" },
                {
                  key: "status",
                  label: "Status",
                  getStatusColor: (val) => getStatusColor(val),
                },
              ],
            },
            {
              title: "Parecer Geral",
              icon: FileText,
              iconColor: "w-5 h-5 text-blue-600",
              items: [{ key: "parecerGeral", label: "Parecer" }],
            },
          ]}
        />
      )}
    </div>
  );
};

export default AcompanhamentoAluno;
