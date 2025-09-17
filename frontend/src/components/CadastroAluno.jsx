import { useState } from 'react'
import { UserPlus, Save, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import Header from './Header'
import FormInput from './FormInput'

const CadastroAluno = () => {
  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    sexo: '',
    estado_civil: '',

    // Contato
    telefone: '',
    celular: '',
    email: '',

    // Endereço
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: '',

    // Dados familiares
    nome_pai: '',
    nome_mae: '',
    telefone_responsavel: '',

    // Dados institucionais
    data_ingresso: '',
    observacoes: '',
    status: 'Ativo'
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Campos obrigatórios
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato 000.000.000-00'
    }

    if (!formData.data_nascimento) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória'
    }

    if (!formData.data_ingresso) {
      newErrors.data_ingresso = 'Data de ingresso é obrigatória'
    }

    // Validar email se fornecido
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Por favor, corrija os erros no formulário'
      })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('http://localhost:5000/api/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Aluno cadastrado com sucesso!'
        })

        // Limpar formulário após sucesso
        setTimeout(() => {
          handleReset()
          setMessage({ type: '', text: '' })
        }, 2000)
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Erro ao cadastrar aluno'
        })
      }
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao conectar com o servidor'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      nome: '',
      cpf: '',
      rg: '',
      data_nascimento: '',
      sexo: '',
      estado_civil: '',
      telefone: '',
      celular: '',
      email: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      estado: '',
      nome_pai: '',
      nome_mae: '',
      telefone_responsavel: '',
      data_ingresso: '',
      observacoes: '',
      status: 'Ativo'
    })
    setErrors({})
    setMessage({ type: '', text: '' })
  }

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    return value
  }

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        icon={<UserPlus className="w-8 h-8 text-blue-600" />}
        title={"Cadastro de Aluno"}
        text={"Preencha as informações do novo aluno"}
      />

      {/* Mensagem de feedback */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormInput
              label={"Nome Compleot *"}
              type={"text"}
              name={"nome"}
              value={formData.nome}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Digite o nome completo"
              error={errors.nome}
            />

            <FormInput
              label={"CPF *"}
              type={"text"}
              name={"cpf"}
              value={formData.cpf}
              onChange={handleCPFChange}
              maxLength={"14"}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="000.000.000-00"
              error={errors.cpf}
            />

            <FormInput
              label={"RG"}
              type={"text"}
              name={"rg"}
              value={formData.rg}
              onChange={handleInputChange}
              placeholder="Digite o RG"
            />

            <FormInput
              label={"Data de Nascimento *"}
              type={"date"}
              name={"data_nascimento"}
              value={formData.data_nascimento}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.data_nascimento ? 'border-red-500' : 'border-gray-300'}`}
              error={errors.data_nascimento}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo
              </label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado Civil
              </label>
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
                <option value="União Estável">União Estável</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormInput
              label={"Telefone"}
              type={"tel"}
              name={"telefone"}
              value={formData.telefone}
              onChange={handleInputChange}
              placeholder="(48) 3000-0000"
            />

            <FormInput
              label={"Celular"}
              type={"tel"}
              name={"celular"}
              value={formData.celular}
              onChange={handleInputChange}
              placeholder="(48) 99000-0000"
            />

            <FormInput
              label={"E-mail"}
              type={"email"}
              name={"email"}
              value={formData.email}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              onChange={handleInputChange}
              placeholder="email@exemplo.com"
              error={errors.email}
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormInput
              label={"Endereço"}
              type={"text"}
              name={"endereco"}
              value={formData.endereco}
              onChange={handleInputChange}
              placeholder="Rua, Avenida, etc."
            />

            <FormInput
              label={"Número"}
              type={"text"}
              name={"numero"}
              value={formData.numero}
              onChange={handleInputChange}
              placeholder="123"
            />

            <FormInput
              label={"Complemento"}
              type={"text"}
              name={"complemento"}
              value={formData.complemento}
              onChange={handleInputChange}
              placeholder="Apto, Casa, etc."
            />

            <FormInput
              label={"Bairro"}
              type={"text"}
              name={"bairro"}
              value={formData.bairro}
              onChange={handleInputChange}
              placeholder="Nome do bairro"
            />

            <FormInput
              label={"Cidade"}
              type={"text"}
              name={"cidade"}
              value={formData.cidade}
              onChange={handleInputChange}
              placeholder="Nome da cidade"
            />

            <FormInput
              label={"CEP"}
              type={"text"}
              name={"cep"}
              value={formData.cep}
              onChange={handleInputChange}
              placeholder="00000-000"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="SC">Santa Catarina</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                {/* Adicionar outros estados conforme necessário */}
              </select>
            </div>
          </div>
        </div>

        {/* Dados Familiares */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Familiares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormInput
              label={"Nome do Pai"}
              type={"text"}
              name={"nome_pai"}
              value={formData.nome_pai}
              onChange={handleInputChange}
              placeholder="Nome completo do pai"
            />

            <FormInput
              label={"Nome da Mãe"}
              type={"text"}
              name={"nome_mae"}
              value={formData.nome_mae}
              onChange={handleInputChange}
              placeholder="Nome completo da mãe"
            />

            <FormInput
              label={"Telefone do Responsável"}
              type={"text"}
              name={"telefone_responsavel"}
              value={formData.telefone_responsavel}
              onChange={handleInputChange}
              placeholder="(48) 99000-0000"
            />
          </div>
        </div>

        {/* Dados Institucionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Institucionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={"Data de Ingresso *"}
              type={"date"}
              name={"data_ingresso"}
              value={formData.data_ingresso}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.data_ingresso ? 'border-red-500' : 'border-gray-300'
              }`}
              error={errors.data_ingresso}
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
                <option value="Em Avaliação">Em Avaliação</option>
                <option value="Encaminhado">Encaminhado</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações adicionais sobre o aluno..."
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Limpar
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Aluno'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CadastroAluno

