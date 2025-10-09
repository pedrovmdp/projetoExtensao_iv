import { Building2, Edit, Eye, Search, User } from "lucide-react";
import Header from "./Header";
import TextRow from "./ui/textRow";
import { Button } from '@/components/ui/button.jsx'
import { useState } from "react";

export default function EmpresasParceiras() {

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

    const empresasData = [
        {
            id: 1,
            razao_social: "TechSol Sistemas Ltda",
            nome_fantasia: "TechSol",
            cnpj: "12.345.678/0001-90",
            tipo_empresa: "LTDA",
            data_abertura: "12/06/2018",

            // Endereço
            cep: "04567-123",
            logradouro: "Av. das Nações Unidas",
            numero: "1500",
            complemento: "Sala 210",
            bairro: "Vila Nova",
            cidade: "São Paulo",
            estado: "SP",

            // Contato
            telefone: "(11) 3022-4455",
            celular: "(11) 99123-4567",
            email: "contato@techsol.com.br",

            // Representante Legal
            responsavel_nome: "Mariana Alves",
            responsavel_cpf: "123.456.789-09",
            responsavel_cargo: "Diretora Geral",
            responsavel_celular: "(11) 99876-5432",
            responsavel_email: "mariana.alves@techsol.com.br"
        },

        {
            id: 2,
            razao_social: "VerdeViva Agropecuária S.A.",
            nome_fantasia: "VerdeViva",
            cnpj: "23.456.789/0001-81",
            tipo_empresa: "S.A.",
            data_abertura: "2005-03-12",

            // Endereço
            cep: "78700-000",
            logradouro: "Rod. BR-163",
            numero: "Km 124",
            complemento: "Fazenda 3",
            bairro: "Zona Rural",
            cidade: "Cuiabá",
            estado: "MT",

            // Contato
            telefone: "(65) 3321-7788",
            celular: "(65) 99888-1122",
            email: "contato@verdeviva.com.br",

            // Representante Legal
            responsavel_nome: "João Pedro Ribeiro",
            responsavel_cpf: "987.654.321-00",
            responsavel_cargo: "Presidente",
            responsavel_celular: "(65) 99777-6655",
            responsavel_email: "jp.ribeiro@verdeviva.com.br"
        },

        {
            id: 3,
            razao_social: "Café da Esquina Microempresa",
            nome_fantasia: "Café da Esquina",
            cnpj: "34.567.890/0001-72",
            tipo_empresa: "ME",
            data_abertura: "2021-09-12",

            // Endereço
            cep: "40015-220",
            logradouro: "Rua das Flores",
            numero: "45",
            complemento: "Fundos",
            bairro: "Centro",
            cidade: "Salvador",
            estado: "BA",

            // Contato
            telefone: "(71) 3322-5566",
            celular: "(71) 98811-2233",
            email: "contato@cafedaesquina.com.br",

            // Representante Legal
            responsavel_nome: "Ana Beatriz Costa",
            responsavel_cpf: "321.654.987-66",
            responsavel_cargo: "Proprietária",
            responsavel_celular: "(71) 99922-3344",
            responsavel_email: "ana@cafedaesquina.com.br"
        },

        {
            id: 4,
            razao_social: "Lumen Arquitetura e Design Ltda",
            nome_fantasia: "Lumen Arquitetura",
            cnpj: "45.678.901/0001-63",
            tipo_empresa: "LTDA",
            data_abertura: "2020-05-12",

            // Endereço
            cep: "80040-020",
            logradouro: "Rua das Palmeiras",
            numero: "200",
            complemento: "Conjunto 701",
            bairro: "Batel",
            cidade: "Curitiba",
            estado: "PR",

            // Contato
            telefone: "(41) 3244-7788",
            celular: "(41) 99800-1122",
            email: "contato@lumenarq.com.br",

            // Representante Legal
            responsavel_nome: "Carlos Henrique Martins",
            responsavel_cpf: "456.123.789-50",
            responsavel_cargo: "Arquiteto Chefe",
            responsavel_celular: "(41) 99755-3344",
            responsavel_email: "carlos.martins@lumenarq.com.br"
        },

        {
            id: 5,
            razao_social: "Rápido & Cia Logística Ltda",
            nome_fantasia: "RápidoLog",
            cnpj: "56.789.012/0001-54",
            tipo_empresa: "LTDA",
            data_abertura: "2018-02-22",

            // Endereço
            cep: "70040-010",
            logradouro: "Av. das Américas",
            numero: "820",
            complemento: "Galpão B",
            bairro: "Distrito Industrial",
            cidade: "Brasília",
            estado: "DF",

            // Contato
            telefone: "(61) 3222-9900",
            celular: "(61) 99111-2233",
            email: "suporte@rapidolog.com.br",

            // Representante Legal
            responsavel_nome: "Fernanda Lima",
            responsavel_cpf: "654.321.987-11",
            responsavel_cargo: "Gerente Operacional",
            responsavel_celular: "(61) 99833-4455",
            responsavel_email: "fernanda.lima@rapidolog.com.br"
        }
    ]

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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex justify-center items-center">
                <div className="flex md:flex-row gap-4 w-full max-w-1xl">
                    <div className="flex-1">
                        <div className="relative h-full w-6xl">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nome"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 h-full flex flex-col justify-center items-center">
                            <p className="text-2xl font-bold text-blue-600">{empresasData.length}</p>
                            <p className="text-sm text-gray-600">Total de empresas parceiras</p>
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
                            {empresasData.map((empresa) => (
                                <tr key={empresa.id} className="hover:bg-gray-50">
                                    {/* razao social */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {empresa.razao_social}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{empresa.nome_fantasia}</div>
                                        <div className="text-sm text-gray-500">{empresa.cnpj}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {empresa.tipo_empresa}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(empresa.data_abertura)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{empresa.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewDetails(empresa)}
                                                className="flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(empresa)}
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

        </div>
    )
}