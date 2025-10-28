import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  FileText,
  Calendar,
  User,
  Phone,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents, selectAllStudents } from '../../store/features/studentSlice'

const HistoricoAluno = () => {
  const dispatch = useDispatch()
  const students = useSelector(selectAllStudents)

  const [filteredAlunos, setFilteredAlunos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedAluno, setSelectedAluno] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  const handleViewDetails = (aluno) => {
    setSelectedAluno(aluno)
    setShowModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800'
      case 'Encaminhado':
        return 'bg-blue-100 text-blue-800'
      case 'Em Avaliação':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Calcular estatísticas
  const alunosAtivos = students.filter(a => a.status === 'Ativo').length
  const alunosEncaminhados = students.filter(a => a.status === 'Encaminhado').length
  const alunosAvaliacao = students.filter(a => a.status === 'Em Avaliação').length

  // if (loading) {
  //   return (
  //     <div className="space-y-6">
  //       <div className="flex items-center gap-3 mb-8">
  //         <FileText className="w-8 h-8 text-blue-600" />
  //         <div>
  //           <h1 className="text-3xl font-bold text-gray-900">Histórico de Alunos</h1>
  //           <p className="text-gray-600 mt-1">
  //             Visualize e gerencie o histórico de todos os alunos cadastrados
  //           </p>
  //         </div>
  //       </div>
  //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
  //         <div className="text-center">
  //           <p className="text-gray-500">Carregando alunos...</p>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // if (error) {
  //   return (
  //     <div className="space-y-6">
  //       <div className="flex items-center gap-3 mb-8">
  //         <FileText className="w-8 h-8 text-blue-600" />
  //         <div>
  //           <h1 className="text-3xl font-bold text-gray-900">Histórico de alunos</h1>
  //           <p className="text-gray-600 mt-1">
  //             Visualize e gerencie o histórico de todos os alunos cadastrados
  //           </p>
  //         </div>
  //       </div>
  //       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
  //         <p className="text-red-800">{error}</p>
  //         <button 
  //           onClick={fetchAlunos}
  //           className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
  //         >
  //           Tentar Novamente
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        icon={<FileText className="w-8 h-8 text-blue-600" />}
        title={"Histórico de alunos"}
        text={"Visualize e gerencie o histórico de todos os alunos cadastrados"}
      />

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Filtro por Status */}
          <div className="md:w-48">
            <div className="relative">
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
          </div>
          
          {/* Botão de Exportar */}
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{students.length}</p>
            <p className="text-sm text-gray-600">Total de Alunos</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{alunosAtivos}</p>
            <p className="text-sm text-gray-600">Ativos</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{alunosEncaminhados}</p>
            <p className="text-sm text-gray-600">Encaminhados</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{alunosAvaliacao}</p>
            <p className="text-sm text-gray-600">Em Avaliação</p>
          </div>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Idade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Ingresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((students) => (
                <tr key={students.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {students.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {students.contato.telefone || students.contato.celular || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {students.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {students.idade ? `${students.idade} anos` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(students.dados_institucionais.data_ingresso)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(students.dados_institucionais.status)}`}>
                      {students.dados_institucionais.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(students)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
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
        
        {filteredAlunos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum aluno encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedAluno && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Aluno</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Informações Pessoais */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Informações Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nome</p>
                      <p className="text-gray-900">{selectedAluno.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">CPF</p>
                      <p className="text-gray-900">{selectedAluno.cpf}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data de Nascimento</p>
                      <p className="text-gray-900">{formatDate(selectedAluno.data_nascimento)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Idade</p>
                      <p className="text-gray-900">{selectedAluno.idade ? `${selectedAluno.idade} anos` : '-'}</p>
                    </div>
                    {selectedAluno.sexo && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sexo</p>
                        <p className="text-gray-900">{selectedAluno.sexo}</p>
                      </div>
                    )}
                    {selectedAluno.estado_civil && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Estado Civil</p>
                        <p className="text-gray-900">{selectedAluno.estado_civil}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contato */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    Contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    {selectedAluno.contato.telefone && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Telefone</p>
                        <p className="text-gray-900">{selectedAluno.contato.telefone}</p>
                      </div>
                    )}
                    {selectedAluno.contato.celular && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Celular</p>
                        <p className="text-gray-900">{selectedAluno.contato.celular}</p>
                      </div>
                    )}
                    {selectedAluno.contato.email && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">E-mail</p>
                        <p className="text-gray-900">{selectedAluno.contato.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                {(selectedAluno.endereco.logradouro || selectedAluno.endereco.bairro || selectedAluno.endereco.cidade) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      Endereço
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">
                        {[
                          selectedAluno.endereco.logradouro,
                          selectedAluno.endereco.numero,
                          selectedAluno.endereco.complemento,
                          selectedAluno.endereco.bairro,
                          selectedAluno.endereco.cidade,
                          selectedAluno.endereco.estado
                        ].filter(Boolean).join(', ')}
                      </p>
                      {selectedAluno.endereco.cep && (
                        <p className="text-gray-600 mt-1">CEP: {selectedAluno.endereco.cep}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dados Institucionais */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    Dados Institucionais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data de Ingresso</p>
                      <p className="text-gray-900">{formatDate(selectedAluno.dados_institucionais.data_ingresso)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAluno.dados_institucionais.status)}`}>
                        {selectedAluno.dados_institucionais.status}
                      </span>
                    </div>
                    {selectedAluno.dados_institucionais.observacoes && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-600">Observações</p>
                        <p className="text-gray-900">{selectedAluno.dados_institucionais.observacoes}</p>
                      </div>
                    )}
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
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Editar Aluno
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoricoAluno

