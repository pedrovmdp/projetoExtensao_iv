import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Eye,
  Edit,
  Save,
  FileText,
  Building,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import FormInputDiv from "../components/FormInputDiv";
import AutoCompleteInput from "../components/AutoCompleteInput";
import LoadingSpinner from "../components/LoadingSpinner";
import TextRow from "../components/ui/textRow";
import IconColor from "../assets/IconColor";
import {
  getAllMonitoringSheets,
  createMonitoringSheet,
  updateMonitoringSheet,
} from "../../store/features/monitoringSheetSlice";
import { searchPeople } from "../../store/features/peopleSlice";
import { fetchCompanytByName } from "../../store/features/companySlice";
import {
  getAllPeopleCompany,
  createPeopleCompany,
} from "../../store/features/peopleCompanySlice";

const AcompanhamentoAluno = () => {
  const dispatch = useDispatch();
  const { list: monitoringSheets, isLoading } = useSelector(
    (state) => state.monitoringSheet,
  );
  const { list: peopleCompany } = useSelector((state) => state.peopleCompany);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAcompanhamento, setSelectedAcompanhamento] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showEncaminhamentoForm, setShowEncaminhamentoForm] = useState(false);
  const [encaminhamentoData, setEncaminhamentoData] = useState({
    pessoa_id: null,
    empresa_id: null,
    data_admissao: "",
    data_desligamento: "",
    funcao: "",
    contato_rh: "",
    status: "ATIVO",
    nomePessoa: "",
    nomeEmpresa: "",
  });
  const [encaminhamentoErrors, setEncaminhamentoErrors] = useState({});

  const [formData, setFormData] = useState({
    nomeAluno: "",
    empresa: "",
    people_company_id: null,
    data_visita: "",
    contato_rh: "",
    parecer_geral: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllMonitoringSheets());
    dispatch(getAllPeopleCompany());
  }, [dispatch]);

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
    if (!formData.people_company_id)
      newErrors.people_company_id = "Selecione um aluno/empresa";
    if (!formData.data_visita)
      newErrors.data_visita = "Data da visita é obrigatória";
    if (!formData.contato_rh.trim())
      newErrors.contato_rh = "Contato RH é obrigatório";
    if (!formData.parecer_geral.trim())
      newErrors.parecer_geral = "Parecer geral é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetForm = () => {
    setFormData({
      nomeAluno: "",
      empresa: "",
      people_company_id: null,
      data_visita: "",
      contato_rh: "",
      parecer_geral: "",
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const monitoringData = {
      people_company_id: formData.people_company_id,
      data_visita: formData.data_visita,
      contato_rh: formData.contato_rh,
      parecer_geral: formData.parecer_geral,
    };

    const loadingToast = toast.loading(
      editingId
        ? "Atualizando acompanhamento..."
        : "Salvando acompanhamento...",
    );

    try {
      if (editingId) {
        await dispatch(
          updateMonitoringSheet({ id: editingId, data: monitoringData }),
        ).unwrap();
        toast.success("Acompanhamento atualizado com sucesso!", {
          id: loadingToast,
        });
      } else {
        await dispatch(createMonitoringSheet(monitoringData)).unwrap();
        toast.success("Acompanhamento cadastrado com sucesso!", {
          id: loadingToast,
        });
      }
      handleResetForm();
      dispatch(getAllMonitoringSheets());
    } catch (error) {
      console.error("Erro ao salvar acompanhamento:", error);
      toast.error("Erro ao salvar acompanhamento", { id: loadingToast });
    }
  };

  const handleSelectPeopleCompany = (item) => {
    if (!item) {
      setFormData((prev) => ({
        ...prev,
        people_company_id: null,
        nomeAluno: "",
        empresa: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      people_company_id: item.id,
      nomeAluno: item.person?.nome || "",
      empresa: item.company?.razao_social || "",
    }));
  };

  const handleEdit = (acompanhamento) => {
    setFormData({
      nomeAluno: acompanhamento.peopleCompany?.person?.nome || "",
      empresa: acompanhamento.peopleCompany?.company?.razao_social || "",
      people_company_id: acompanhamento.peopleCompany?.id || null,
      data_visita: acompanhamento.data_visita,
      contato_rh: acompanhamento.contato_rh,
      parecer_geral: acompanhamento.parecer_geral,
    });
    setEditingId(acompanhamento.id);
    setShowForm(true);
  };

  const handleViewDetails = (acompanhamento) => {
    setSelectedAcompanhamento(acompanhamento);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const stats = {
    total: monitoringSheets?.length || 0,
    ultimos30dias:
      monitoringSheets?.filter((m) => {
        const dataVisita = new Date(m.data_visita);
        const hoje = new Date();
        const diff = Math.floor((hoje - dataVisita) / (1000 * 60 * 60 * 24));
        return diff <= 30;
      }).length || 0,
  };

  if (isLoading) {
    return <LoadingSpinner fullHeight text="Carregando..." />;
  }
  const handleEncaminhamentoChange = (e) => {
    const { name, value } = e.target;
    setEncaminhamentoData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (encaminhamentoErrors[name]) {
      setEncaminhamentoErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectPerson = (person) => {
    if (!person) {
      setEncaminhamentoData((prev) => ({
        ...prev,
        pessoa_id: null,
        nomePessoa: "",
      }));
      return;
    }
    setEncaminhamentoData((prev) => ({
      ...prev,
      pessoa_id: person.id,
      nomePessoa: person.nome,
    }));
  };

  const handleSelectCompanyForEncaminhamento = (company) => {
    if (!company) {
      setEncaminhamentoData((prev) => ({
        ...prev,
        empresa_id: null,
        nomeEmpresa: "",
      }));
      return;
    }
    setEncaminhamentoData((prev) => ({
      ...prev,
      empresa_id: company.id,
      nomeEmpresa: company.razao_social,
    }));
  };

  const validateEncaminhamento = () => {
    const newErrors = {};
    if (!encaminhamentoData.pessoa_id)
      newErrors.pessoa_id = "Selecione uma pessoa";
    if (!encaminhamentoData.empresa_id)
      newErrors.empresa_id = "Selecione uma empresa";
    if (!encaminhamentoData.data_admissao)
      newErrors.data_admissao = "Data de admissão é obrigatória";
    if (!encaminhamentoData.funcao.trim())
      newErrors.funcao = "Função é obrigatória";
    if (!encaminhamentoData.contato_rh.trim())
      newErrors.contato_rh = "Contato RH é obrigatório";

    setEncaminhamentoErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEncaminhamentoSubmit = async (e) => {
    e.preventDefault();
    if (!validateEncaminhamento()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const peopleCompanyData = {
      pessoa_id: encaminhamentoData.pessoa_id,
      empresa_id: encaminhamentoData.empresa_id,
      data_admissao: encaminhamentoData.data_admissao,
      data_desligamento: encaminhamentoData.data_desligamento || null,
      funcao: encaminhamentoData.funcao,
      contato_rh: encaminhamentoData.contato_rh,
      status: encaminhamentoData.status,
    };

    const loadingToast = toast.loading("Criando encaminhamento...");

    try {
      await dispatch(createPeopleCompany(peopleCompanyData)).unwrap();
      toast.success("Encaminhamento criado com sucesso!", { id: loadingToast });
      // Limpar formulário
      setEncaminhamentoData({
        pessoa_id: null,
        empresa_id: null,
        data_admissao: "",
        data_desligamento: "",
        funcao: "",
        contato_rh: "",
        status: "ATIVO",
        nomePessoa: "",
        nomeEmpresa: "",
      });
      setShowEncaminhamentoForm(false);
      dispatch(getAllPeopleCompany());
    } catch (error) {
      console.error("Erro ao criar encaminhamento:", error);
      toast.error("Erro ao criar encaminhamento", { id: loadingToast });
    }
  };

  const handleFetchPeople = async (name) => {
    if (!name || name.length < 2) return [];
    try {
      const action = await dispatch(searchPeople(name));
      return action.payload || [];
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
      return [];
    }
  };

  const handleFetchCompanies = async (name) => {
    if (!name || name.length < 2) return [];
    try {
      const action = await dispatch(fetchCompanytByName(name));
      return action.payload || [];
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Header
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Acompanhamento de Alunos"
          text="Fichas de acompanhamento no mercado de trabalho"
        />

        {!showForm && !showEncaminhamentoForm && (
          <div className="flex gap-3">
            <Button
              onClick={() => setShowEncaminhamentoForm(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Novo Encaminhamento
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Novo Acompanhamento
            </Button>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-600">Total de Acompanhamentos</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-2xl font-bold text-green-600">
            {stats.ultimos30dias}
          </p>
          <p className="text-sm text-gray-600">Últimos 30 dias</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-2xl font-bold text-purple-600">
            {peopleCompany?.length || 0}
          </p>
          <p className="text-sm text-gray-600">Alunos Encaminhados</p>
        </div>
      </div>

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
            {/* Seleção de Aluno/Empresa */}
            <FormInputDiv
              icon={User}
              iconColor={IconColor.blue}
              title="Aluno e Empresa"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o Aluno/Empresa *
                  </label>
                  <select
                    value={formData.people_company_id || ""}
                    onChange={(e) => {
                      const selected = peopleCompany.find(
                        (pc) => pc.id === parseInt(e.target.value),
                      );
                      handleSelectPeopleCompany(selected);
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.people_company_id
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {peopleCompany?.map((pc) => (
                      <option key={pc.id} value={pc.id}>
                        {pc.person?.nome} - {pc.company?.razao_social}
                      </option>
                    ))}
                  </select>
                  {errors.people_company_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.people_company_id}
                    </p>
                  )}
                </div>

                {formData.nomeAluno && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Aluno:</strong> {formData.nomeAluno}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Empresa:</strong> {formData.empresa}
                    </p>
                  </div>
                )}
              </div>
            </FormInputDiv>

            {/* Dados da Visita */}
            <FormInputDiv
              icon={Calendar}
              iconColor={IconColor.orange}
              title="Dados da Visita"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Data da Visita *"
                  type="date"
                  name="data_visita"
                  value={formData.data_visita}
                  onChange={handleInputChange}
                  error={errors.data_visita}
                />
                <FormInput
                  label="Contato RH *"
                  type="text"
                  name="contato_rh"
                  value={formData.contato_rh}
                  onChange={handleInputChange}
                  placeholder="Nome do contato no RH"
                  error={errors.contato_rh}
                />
              </div>
            </FormInputDiv>

            {/* Parecer Geral */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parecer Geral *
              </label>
              <textarea
                name="parecer_geral"
                value={formData.parecer_geral}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.parecer_geral ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Descreva o parecer geral sobre o acompanhamento..."
              />
              {errors.parecer_geral && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.parecer_geral}
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
              Fichas de Acompanhamento
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TextRow text="Aluno" />
                  <TextRow text="Empresa" />
                  <TextRow text="Data Visita" />
                  <TextRow text="Contato RH" />
                  <TextRow text="Ações" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monitoringSheets?.map((acompanhamento) => (
                  <tr key={acompanhamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {acompanhamento.peopleCompany?.person?.nome || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {acompanhamento.peopleCompany?.company?.razao_social ||
                          "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(acompanhamento.data_visita)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {acompanhamento.contato_rh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(acompanhamento)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(acompanhamento)}
                        >
                          <Edit className="w-4 h-4" />
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

      {/* Formulário de Encaminhamento */}
      {showEncaminhamentoForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Novo Encaminhamento
            </h2>
          </div>

          <form onSubmit={handleEncaminhamentoSubmit} className="space-y-6">
            {/* Seleção de Pessoa e Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInputDiv
                icon={User}
                iconColor={IconColor.blue}
                title="Dados da Pessoa"
              >
                <AutoCompleteInput
                  label="Nome da Pessoa *"
                  value={encaminhamentoData.nomePessoa}
                  onSelect={handleSelectPerson}
                  fetchData={handleFetchPeople}
                  placeholder="Digite o nome da pessoa..."
                  error={encaminhamentoErrors.pessoa_id}
                />
              </FormInputDiv>

              <FormInputDiv
                icon={Building}
                iconColor={IconColor.green}
                title="Dados da Empresa"
              >
                <AutoCompleteInput
                  label="Razão Social da Empresa *"
                  value={encaminhamentoData.nomeEmpresa}
                  onSelect={handleSelectCompanyForEncaminhamento}
                  fetchData={handleFetchCompanies}
                  placeholder="Digite o nome da empresa..."
                  error={encaminhamentoErrors.empresa_id}
                  displayField="razao_social"
                  secondaryField="cnpj"
                  icon={Building}
                />
              </FormInputDiv>
            </div>

            {/* Dados do Encaminhamento */}
            <FormInputDiv
              icon={Calendar}
              iconColor={IconColor.orange}
              title="Dados do Encaminhamento"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Data de Admissão *"
                  type="date"
                  name="data_admissao"
                  value={encaminhamentoData.data_admissao}
                  onChange={handleEncaminhamentoChange}
                  error={encaminhamentoErrors.data_admissao}
                />
                <FormInput
                  label="Data de Desligamento"
                  type="date"
                  name="data_desligamento"
                  value={encaminhamentoData.data_desligamento}
                  onChange={handleEncaminhamentoChange}
                />
                <FormInput
                  label="Função *"
                  type="text"
                  name="funcao"
                  value={encaminhamentoData.funcao}
                  onChange={handleEncaminhamentoChange}
                  placeholder="Ex: Analista de TI"
                  error={encaminhamentoErrors.funcao}
                />
                <FormInput
                  label="Contato RH *"
                  type="text"
                  name="contato_rh"
                  value={encaminhamentoData.contato_rh}
                  onChange={handleEncaminhamentoChange}
                  placeholder="Nome do contato no RH"
                  error={encaminhamentoErrors.contato_rh}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={encaminhamentoData.status}
                    onChange={handleEncaminhamentoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>
              </div>
            </FormInputDiv>

            {/* Botões */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEncaminhamentoForm(false);
                  setEncaminhamentoData({
                    pessoa_id: null,
                    empresa_id: null,
                    data_admissao: "",
                    data_desligamento: "",
                    funcao: "",
                    contato_rh: "",
                    status: "ATIVO",
                    nomePessoa: "",
                    nomeEmpresa: "",
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Salvar Encaminhamento
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showModal && selectedAcompanhamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalhes do Acompanhamento
                </h2>
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Aluno</h3>
                  <p>{selectedAcompanhamento.peopleCompany?.person?.nome}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Empresa</h3>
                  <p>
                    {
                      selectedAcompanhamento.peopleCompany?.company
                        ?.razao_social
                    }
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Data da Visita</h3>
                  <p>{formatDate(selectedAcompanhamento.data_visita)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Contato RH</h3>
                  <p>{selectedAcompanhamento.contato_rh}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Parecer Geral</h3>
                  <p className="whitespace-pre-wrap">
                    {selectedAcompanhamento.parecer_geral}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Fechar
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handleEdit(selectedAcompanhamento);
                    setShowModal(false);
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcompanhamentoAluno;
