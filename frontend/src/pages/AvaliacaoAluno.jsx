import { useState } from 'react'
import {
  ClipboardList,
  Save,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import Header from '../components/Header'
import FormInput from '../components/FormInput'
import { useDispatch } from 'react-redux'
import { addReview } from '../../store/features/reviewSlice'
import { fetchStudentByName } from '../../store/features/studentSlice'
import AutoCompleteInput from '../components/AutoCompleteInput'

// Questões do formulário de avaliação baseadas no documento
const questoes = [
  { id: 1, texto: "Atende as regras." },
  { id: 2, texto: "Socializa com o grupo." },
  { id: 3, texto: "Isola-se do grupo" },
  { id: 4, texto: "Possui tolerância a frustração." },
  { id: 5, texto: "Respeita colega e professores." },
  { id: 6, texto: "Faz relatos fantasiosos." },
  { id: 7, texto: "Concentra-se nas atividades." },
  { id: 8, texto: "Tem iniciativa." },
  { id: 9, texto: "Sonolência durante as atividades em sala de aula." },
  { id: 10, texto: "Alterações intensas de humor." },
  { id: 11, texto: "Indica oscilação repentina de humor." },
  { id: 12, texto: "Irrita-se com facilidade." },
  { id: 13, texto: "Ansiedade." },
  { id: 14, texto: "Escuta quando seus colegas falam." },
  { id: 15, texto: "Escuta e segue orientação dos professores." },
  { id: 16, texto: "Mantem-se em sala de aula." },
  { id: 17, texto: "Desloca-se muito na sala." },
  { id: 18, texto: "Fala demasiadamente." },
  { id: 19, texto: "É pontual." },
  { id: 20, texto: "É assíduo." },
  { id: 21, texto: "Demonstra desejo de trabalhar." },
  { id: 22, texto: "Apropria-se indevidamente daquilo que não é seu." },
  { id: 23, texto: "Indica hábito de banho diário." },
  { id: 24, texto: "Indica habito de escovação e qualidade na escovação." },
  { id: 25, texto: "Indica cuidado com a aparência e limpeza do uniforme." },
  { id: 26, texto: "Indica autonomia quanto a estes hábitos (23, 24, 25)." },
  { id: 27, texto: "Indica falta do uso de medicação com oscilações de comportamento." },
  { id: 28, texto: "Tem meio articulado de conseguir receitas e aquisições das medicações." },
  { id: 29, texto: "Traz seus materiais organizados." },
  { id: 30, texto: "Usa transporte coletivo." },
  { id: 31, texto: "Tem iniciativa diante das atividades propostas." },
  { id: 32, texto: "Localiza-se no espaço da Instituição." },
  { id: 33, texto: "Situa-se nas trocas de sala e atividades." },
  { id: 34, texto: "Interage par a par." },
  { id: 35, texto: "Interage em grupo." },
  { id: 36, texto: "Cria conflitos e intrigas." },
  { id: 37, texto: "Promove a harmonia." },
  { id: 38, texto: "Faz intrigas entre colegas x professores." },
  { id: 39, texto: "Demonstra interesse em participar das atividades extraclasses." },
  { id: 40, texto: "Você percebe que existe interação/participação da família em apoio ao usuário na Instituição." },
  { id: 41, texto: "Você percebe superproteção por parte da família quanto a autonomia do usuário." },
  { id: 42, texto: "Usuário traz relatos negativos da família (de forma geral)." },
  { id: 43, texto: "Usuário traz relatos positivos da família (de forma geral)." },
  { id: 44, texto: "Você percebe incentivo quanto a busca de autonomia para o usuário por parte da família." },
  { id: 45, texto: "Você percebe incentivo quanto a inserção do usuário no mercado de trabalho por parte da família." },
  { id: 46, texto: "Traz os documentos enviados pela Instituição assinado." }
]

const AvaliacaoAluno = () => {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    nomeAluno: '',
    dataEntrada: '',
    dataAvaliacao: '',
    tipoAvaliacao: '1', // 1ª ou 2ª avaliação
    respostas: {},
    situacoesIrritacao: '',
    perfilInstituicao: '',
    justificativaPerfil: '',
    observacoes: '',
    nomeProfessor: '',
    idAluno: ''
  })

  const [errors, setErrors] = useState({})
  const [currentSection, setCurrentSection] = useState(0)

  // Dividir questões em seções para melhor organização
  const secoes = [
    { titulo: "Comportamento e Regras", questoes: questoes.slice(0, 8) },
    { titulo: "Aspectos Emocionais", questoes: questoes.slice(8, 18) },
    { titulo: "Pontualidade e Responsabilidade", questoes: questoes.slice(18, 22) },
    { titulo: "Higiene e Cuidados Pessoais", questoes: questoes.slice(22, 26) },
    { titulo: "Medicação e Saúde", questoes: questoes.slice(26, 28) },
    { titulo: "Organização e Autonomia", questoes: questoes.slice(28, 33) },
    { titulo: "Interação Social", questoes: questoes.slice(33, 39) },
    { titulo: "Participação Familiar", questoes: questoes.slice(39, 46) }
  ]

  const opcoes = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
    { value: 'maioria', label: 'Maioria das vezes' },
    { value: 'raras', label: 'Raras vezes' }
  ]

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

  const handleRespostaChange = (questaoId, valor) => {
    setFormData(prev => ({
      ...prev,
      respostas: {
        ...prev.respostas,
        [questaoId]: valor
      }
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nomeAluno.trim()) newErrors.nomeAluno = 'Nome do aluno é obrigatório'
    if (!formData.dataEntrada) newErrors.dataEntrada = 'Data de entrada é obrigatória'
    if (!formData.dataAvaliacao) newErrors.dataAvaliacao = 'Data da avaliação é obrigatória'
    if (!formData.nomeProfessor.trim()) newErrors.nomeProfessor = 'Nome do professor é obrigatório'

    // Verificar se todas as questões foram respondidas
    const questoesNaoRespondidas = questoes.filter(q => !formData.respostas[q.id])
    if (questoesNaoRespondidas.length > 0) {
      newErrors.respostas = `${questoesNaoRespondidas.length} questões não foram respondidas`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return;

    const reviewData = {
      nomeAluno: formData.nomeAluno,
      dataEntrada: formData.dataEntrada,
      dataAvaliacao: formData.dataAvaliacao,
      tipoAvaliacao: formData.tipoAvaliacao, // 1ª ou 2ª avaliação
      respostas: formData.respostas,
      situacoesIrritacao: formData.situacoesIrritacao,
      perfilInstituicao: formData.perfilInstituicao,
      justificativaPerfil: formData.justificativaPerfil,
      observacoes: formData.observacoes,
      nomeProfessor: formData.nomeProfessor,
      idAluno: formData.idAluno
    }

    try {
      await dispatch(addReview(reviewData))
      alert("Avaliação salva com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar avaliação:", e);
    }
  };

  const handleFetchStudents = async (name) => {
    const action = await dispatch(fetchStudentByName(name));
    return action.payload || [];
  };

  const handleSelectStudent = (student) => {
    setFormData((prev) => ({
      ...prev,
      idAluno: student.id,
      nomeAluno: student.nome,
    }));
  };

  const getProgressPercentage = () => {
    const totalQuestoes = questoes.length
    const questoesRespondidas = Object.keys(formData.respostas).length
    return Math.round((questoesRespondidas / totalQuestoes) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        icon={<ClipboardList className="w-8 h-8 text-purple-600" />}
        title={"Avaliação de Aluno"}
        text={"Avaliação de usuário em período de experiência"}
      />

      {/* Barra de Progresso */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso da Avaliação</span>
          <span className="text-sm text-gray-500">{getProgressPercentage()}%</span>
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
            <h2 className="text-xl font-semibold text-gray-900">Dados da Avaliação</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AutoCompleteInput
              label={"Nome do Aluno *"}
              value={formData.nomeAluno}
              onSelect={handleSelectStudent}
              fetchData={handleFetchStudents}
              placeholder={"Digite o nome do aluno..."}
              error={errors.nomeAluno}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Avaliação
              </label>
              <select
                name="tipoAvaliacao"
                value={formData.tipoAvaliacao}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1">1ª Avaliação</option>
                <option value="2">2ª Avaliação</option>
              </select>
            </div>

            <FormInput
              label="Data de Entrada *"
              type={"date"}
              name={"dataEntrada"}
              value={formData.dataEntrada}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.dataEntrada ? 'border-red-500' : 'border-gray-300'
                }`}
              error={errors.dataEntrada}
            />

            <FormInput
              label="Data da Avaliação *"
              type={"date"}
              name={"dataAvaliacao"}
              value={formData.dataAvaliacao}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.dataAvaliacao ? 'border-red-500' : 'border-gray-300'
                }`}
              error={errors.dataAvaliacao}
            />

            <FormInput
              label="Nome do Professor *"
              type={"text"}
              name={"nomeProfessor"}
              value={formData.nomeProfessor}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.nomeProfessor ? 'border-red-500' : 'border-gray-300'
                }`}
              error={errors.nomeProfessor}
              placeholder={"Nome do professor avaliador"}
            />
          </div>
        </div>

        {/* Navegação entre seções */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {secoes.map((secao, index) => (
              <Button
                key={index}
                type="button"
                variant={currentSection === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentSection(index)}
                className={currentSection === index ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {secao.titulo}
              </Button>
            ))}
          </div>
        </div>

        {/* Seção de Questões */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {secoes[currentSection].titulo}
            </h2>
          </div>

          <div className="space-y-4">
            {secoes[currentSection].questoes.map((questao) => (
              <div key={questao.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 mt-1">
                    {questao.id}.
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-3">{questao.texto}</p>
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
                            checked={formData.respostas[questao.id] === opcao.value}
                            onChange={(e) => handleRespostaChange(questao.id, e.target.value)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{opcao.label}</span>
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
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Seção Anterior
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentSection(Math.min(secoes.length - 1, currentSection + 1))}
              disabled={currentSection === secoes.length - 1}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Próxima Seção
            </Button>
          </div>
        </div>

        {/* Campos Adicionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Observações Adicionais</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Em que situações demonstra irritações?
              </label>
              <textarea
                name="situacoesIrritacao"
                value={formData.situacoesIrritacao}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descreva as situações em que o aluno demonstra irritação..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Em sua opinião o usuário tem perfil para esta instituição?
              </label>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="perfilInstituicao"
                    value="sim"
                    checked={formData.perfilInstituicao === 'sim'}
                    onChange={handleInputChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Sim</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="perfilInstituicao"
                    value="nao"
                    checked={formData.perfilInstituicao === 'nao'}
                    onChange={handleInputChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Não</span>
                </label>
              </div>
              <textarea
                name="justificativaPerfil"
                value={formData.justificativaPerfil}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Por quê? Justifique sua resposta..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações Gerais
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Observações adicionais sobre o aluno..."
              />
            </div>
          </div>
        </div>

        {/* Alertas de Validação */}
        {errors.respostas && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{errors.respostas}</p>
            </div>
          </div>
        )}

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3"
          >
            <Save className="w-5 h-5" />
            Salvar Avaliação
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AvaliacaoAluno

