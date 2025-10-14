import { Building, Building2, Edit, Eye, FileText, MapPinned, Search, User } from "lucide-react";
import Header from "./Header";
import TextRow from "./ui/textRow";
import { Button } from '@/components/ui/button.jsx'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanys } from "../../store/features/companySlice";

export default function EmpresasParceiras() {
    const dispatch = useDispatch()
    const companys = useSelector((state) => state.companys.companys || [])

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [selectedEmpresa, setSelectedEmpresa] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const [formData, setFormData] = useState({
        razao_social: "",
        nome_fantasia: "",
        cnpj: "",
        tipo_empresa: "",
        data_abertura: "",

        // Endereço
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",

        // Contato
        telefone: "",
        celular: "",
        email: "",

        // Representante Legal
        responsavel_nome: "",
        responsavel_cpf: "",
        responsavel_cargo: "",
        responsavel_celular: "",
        responsavel_email: ""
    })

    useEffect(() => {
        dispatch(fetchCompanys())
    }, [dispatch])

    const handleViewDetails = (empresa) => {
        setSelectedEmpresa(empresa)
        setShowModal(true)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const handleEdit = (empresa) => {
        setFormData({
            razao_social: empresa.razao_social,
            nome_fantasia: empresa.nome_fantasia,
            cnpj: empresa.cnpj,
            tipo_empresa: empresa.tipo_empresa,
            data_abertura: empresa.data_abertura,

            // Endereço
            cep: empresa.cep,
            logradouro: empresa.logradouro,
            numero: empresa.numero,
            complemento: empresa.complemento,
            bairro: empresa.bairro,
            cidade: empresa.cidade,
            estado: empresa.estado,

            // Contato
            telefone: empresa.telefone,
            celular: empresa.celular,
            email: empresa.email,

            // Representante Legal
            responsavel_nome: empresa.responsavel_nome,
            responsavel_cpf: empresa.responsavel_cpf,
            responsavel_cargo: empresa.responsavel_cargo,
            responsavel_celular: empresa.responsavel_celular,
            responsavel_email: empresa.email
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Header
                icon={<Building2 className="w-8 h-8 text-blue-600" />}
                title={"Empresas parceiras"}
                text={"Vizualize e gerencia todas as empresas cadastradas"}
            />
            {/* Barra de pesquisa */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Campo de busca */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nome"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Total de empresas */}
                    <div className="md:w-48">
                        <div className="relative">
                            <p className="text-2xl font-bold text-blue-600 text-center">{companys.length}</p>
                            <p className="text-xs text-gray-600 text-center">Total de empresas parceiras</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* lista de empresas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Empresas Registradas</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <TextRow
                                    text={"Razão social"}
                                />
                                <TextRow
                                    text={"Nome Fantasia"}
                                />
                                <TextRow
                                    text={"Tipo empresa"}
                                />
                                <TextRow
                                    text={"Data abertura"}
                                />
                                <TextRow
                                    text={"Contato"}
                                />
                                <TextRow
                                    text={"Ações"}
                                />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {companys.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50">
                                    {/* razao social */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {company.razao_social}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{company.nome_fantasia}</div>
                                        <div className="text-sm text-gray-500">{company.cnpj}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {company.tipo_empresa}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(company.data_abertura)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{company.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewDetails(company)}
                                                className="flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(company)}
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

            {/* Modal de Detalhes */}
            {showModal && selectedEmpresa && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Detalhes da empresa</h2>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Dados do Representante */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <User className="w-5 h-5 text-purple-600" />
                                        Dados do Representante
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Nome</p>
                                                <p className="text-gray-900">{selectedEmpresa.responsavel_nome}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Cargo</p>
                                                <p className="text-gray-900">{selectedEmpresa.responsavel_cargo}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Email</p>
                                                <p className="text-gray-900">{selectedEmpresa.responsavel_email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Celular</p>
                                                <p className="text-gray-900">{selectedEmpresa.responsavel_celular}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">CPF</p>
                                                <p className="text-gray-900">{selectedEmpresa.responsavel_cpf}</p>
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
                                                <p className="text-gray-900">{selectedEmpresa.razao_social}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">CNPJ</p>
                                                <p className="text-gray-900">{selectedEmpresa.cnpj}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Tipo</p>
                                                <p className="text-gray-900">{selectedEmpresa.tipo_empresa}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Data Abertura</p>
                                                <p className="text-gray-900">{selectedEmpresa.data_abertura}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dados do Endereço */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <MapPinned className="w-5 h-5 text-orange-600" />
                                        Endereço da Empresa
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Cidade</p>
                                                <p className="text-gray-900">{selectedEmpresa.cidade}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Estado</p>
                                                <p className="text-gray-900">{selectedEmpresa.estado}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">CEP</p>
                                                <p className="text-gray-900">{selectedEmpresa.cep}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Logradouro</p>
                                                <p className="text-gray-900">{selectedEmpresa.logradouro}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Número</p>
                                                <p className="text-gray-900">{selectedEmpresa.numero}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Bairro</p>
                                                <p className="text-gray-900">{selectedEmpresa.bairro}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Complemento</p>
                                                <p className="text-gray-900">{selectedEmpresa.complemento}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Parecer Geral */}
                                {/* <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Parecer Geral
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">{selectedAcompanhamento.parecerGeral}</p>
                                    </div>
                                </div> */}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Fechar
                                </Button>
                                {/* <Button
                                    onClick={() => {
                                        setShowModal(false)
                                        handleEdit(selectedAcompanhamento)
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Editar Empresa
                                </Button> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}