import { useState } from 'react'
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
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import Header from './Header'
import FormInput from './FormInput'
import TextRow from "./ui/textRow";

// Dados simulados de acompanhamentos
const acompanhamentosData = [
  {
    id: 1,
    nomeAluno: 'João Silva Santos',
    empresa: 'Supermercado Central Ltda',
    responsavelRH: 'Maria Fernanda Costa',
    dataAdmissao: '2024-01-15',
    dataVisita: '2024-02-15',
    contatoCom: 'Supervisor de RH',
    parecerGeral: 'Aluno demonstra boa adaptação ao ambiente de trabalho. Pontual e dedicado às tarefas. Recomenda-se acompanhamento mensal.',
    status: 'Ativo'
  },
  {
    id: 2,
    nomeAluno: 'Maria Oliveira Costa',
    empresa: 'Padaria Pão Dourado',
    responsavelRH: 'Carlos Eduardo Silva',
    dataAdmissao: '2024-02-01',
    dataVisita: '2024-03-01',
    contatoCom: 'Gerente Geral',
    parecerGeral: 'Excelente desempenho na função. Boa interação com colegas e clientes. Empresa muito satisfeita com o trabalho.',
    status: 'Ativo'
  },
  {
    id: 3,
    nomeAluno: 'Pedro Henrique Souza',
    empresa: 'Loja de Roupas Fashion',
    responsavelRH: 'Ana Paula Santos',
    dataAdmissao: '2023-11-10',
    dataVisita: '2024-01-10',
    contatoCom: 'Coordenadora de Vendas',
    parecerGeral: 'Aluno apresentou dificuldades iniciais, mas com acompanhamento adequado tem mostrado melhora significativa.',
    status: 'Em Observação'
  }
]

const AcompanhamentoAluno = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedAcompanhamento, setSelectedAcompanhamento] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    nomeAluno: '',
    empresa: '',
    responsavelRH: '',
    cargo: "",
    dataAdmissao: '',
    dataVisita: '',
    contatoCom: '',
    parecerGeral: '',
    status: 'Ativo'
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nomeAluno.trim()) newErrors.nomeAluno = 'Nome do aluno é obrigatório'
    if (!formData.empresa.trim()) newErrors.empresa = 'Nome da empresa é obrigatório'
    if (!formData.responsavelRH.trim()) newErrors.responsavelRH = 'Responsável RH é obrigatório'
    if (!formData.dataAdmissao) newErrors.dataAdmissao = 'Data de admissão é obrigatória'
    if (!formData.dataVisita) newErrors.dataVisita = 'Data da visita é obrigatória'
    if (!formData.contatoCom.trim()) newErrors.contatoCom = 'Contato é obrigatório'
    if (!formData.parecerGeral.trim()) newErrors.parecerGeral = 'Parecer geral é obrigatório'
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo do aluno é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('Dados do acompanhamento:', formData)
      alert(editingId ? 'Acompanhamento atualizado com sucesso!' : 'Acompanhamento cadastrado com sucesso!')

      // Limpar formulário e fechar
      setFormData({
        nomeAluno: '',
        empresa: '',
        responsavelRH: '',
        cargo: '',
        dataAdmissao: '',
        dataVisita: '',
        contatoCom: '',
        parecerGeral: '',
        status: 'Ativo'
      })
      setShowForm(false)
      setEditingId(null)
    }
  }

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
      status: acompanhamento.status
    })
    setEditingId(acompanhamento.id)
    setShowForm(true)
  }

  const handleViewDetails = (acompanhamento) => {
    setSelectedAcompanhamento(acompanhamento)
    setShowModal(true)
  }

  const handleCancel = () => {
    setFormData({
      nomeAluno: '',
      empresa: '',
      responsavelRH: '',
      cargo: '',
      dataAdmissao: '',
      dataVisita: '',
      contatoCom: '',
      parecerGeral: '',
      status: 'Ativo'
    })
    setShowForm(false)
    setEditingId(null)
    setErrors({})
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800'
      case 'Em Observação':
        return 'bg-yellow-100 text-yellow-800'
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{acompanhamentosData.length}</p>
            <p className="text-sm text-gray-600">Total de Acompanhamentos</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {acompanhamentosData.filter(a => a.status === 'Ativo').length}
            </p>
            <p className="text-sm text-gray-600">Ativos</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {acompanhamentosData.filter(a => a.status === 'Em Observação').length}
            </p>
            <p className="text-sm text-gray-600">Em Observação</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Editar Acompanhamento' : 'Novo Acompanhamento'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados do Aluno e Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Dados do Aluno</h3>
                </div>

                <div className="space-y-4">
                  <FormInput
                    label={"Nome do Aluno *"}
                    type={"text"}
                    name={"nomeAluno"}
                    value={formData.nomeAluno}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nomeAluno ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder={"Nome completo do aluno"}
                    error={errors.nomeAluno}
                  />

                  <FormInput
                    label={"Data de Admissão *"}
                    type={"date"}
                    name={"dataAdmissao"}
                    value={formData.dataAdmissao}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dataAdmissao ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder={"Nome completo do aluno"}
                    error={errors.dataAdmissao}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Dados da Empresa</h3>
                </div>

                <div className="space-y-4">
                  <FormInput
                    label={"Nome da Empresa *"}
                    type={"text"}
                    name={"empresa"}
                    value={formData.empresa}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.empresa ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder={"Nome da empresa"}
                    error={errors.empresa}
                  />

                  <FormInput
                    label={"Responsável RH *"}
                    type={"text"}
                    name={"responsavelRH"}
                    value={formData.responsavelRH}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.responsavelRH ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder={"Nome do responsável pelo RH"}
                    error={errors.responsavelRH}
                  />

                  <FormInput
                    label={"Cargo *"}
                    type={"text"}
                    name={"cargo"}
                    value={formData.cargo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cargo ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder={"Cargo do aluno"}
                    error={errors.cargo}
                  />
                </div>
              </div>
            </div>

            {/* Dados da Visita */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Dados da Visita</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label={"Cargo *"}
                  type={"text"}
                  name={"cargo"}
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cargo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder={"Cargo do aluno"}
                  error={errors.cargo}
                />

                <FormInput
                  label={"Data da Visita *"}
                  type={"date"}
                  name={"dataVisita"}
                  value={formData.dataVisita}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dataVisita ? 'border-red-500' : 'border-gray-300'
                    }`}
                  error={errors.dataVisita}
                />

                <FormInput
                  label={"Contato com *"}
                  type={"text"}
                  name={"contatoCom"}
                  value={formData.contatoCom}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contatoCom ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.parecerGeral ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Descreva o parecer geral sobre o acompanhamento do aluno na empresa..."
              />
              {errors.parecerGeral && <p className="text-red-500 text-sm mt-1">{errors.parecerGeral}</p>}
            </div>

            {/* Botões */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Atualizar' : 'Salvar'} Acompanhamento
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Acompanhamentos */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Acompanhamentos Registrados</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TextRow 
                    text={'Aluno'}
                  />
                  <TextRow 
                    text={'Empresa'}
                  />
                  <TextRow 
                    text={'Data Admissão'}
                  />
                  <TextRow 
                    text={'Última Visita'}
                  />
                  <TextRow 
                    text={'Status'}
                  />
                  <TextRow 
                    text={'Ações'}
                  />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {acompanhamentosData.map((acompanhamento) => (
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
                      <div className="text-sm text-gray-900">{acompanhamento.empresa}</div>
                      <div className="text-sm text-gray-500">{acompanhamento.responsavelRH}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(acompanhamento.dataAdmissao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(acompanhamento.dataVisita)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(acompanhamento.status)}`}>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Acompanhamento</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Dados do Aluno */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Dados do Aluno
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Nome</p>
                        <p className="text-gray-900">{selectedAcompanhamento.nomeAluno}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Data de Admissão</p>
                        <p className="text-gray-900">{formatDate(selectedAcompanhamento.dataAdmissao)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados da Empresa */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-green-600" />
                    Dados da Empresa
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Empresa</p>
                        <p className="text-gray-900">{selectedAcompanhamento.empresa}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Responsável RH</p>
                        <p className="text-gray-900">{selectedAcompanhamento.responsavelRH}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados da Visita */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    Dados da Visita
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Data da Visita</p>
                        <p className="text-gray-900">{formatDate(selectedAcompanhamento.dataVisita)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contato com</p>
                        <p className="text-gray-900">{selectedAcompanhamento.contatoCom}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAcompanhamento.status)}`}>
                          {selectedAcompanhamento.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parecer Geral */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Parecer Geral
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedAcompanhamento.parecerGeral}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false)
                    handleEdit(selectedAcompanhamento)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Editar Acompanhamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AcompanhamentoAluno

