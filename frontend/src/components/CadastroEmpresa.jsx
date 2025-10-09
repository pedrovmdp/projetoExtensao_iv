import { HousePlus, RotateCcw, Save } from "lucide-react"
import Header from "./Header"
import { useState } from "react"
import { Button } from '@/components/ui/button.jsx'
import FormInput from "./FormInput";

export default function CadastroEmpresa() {
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        // Dados da Empresa
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        tipo_empresa: "",
        data_abertura: '',

        // Endereço
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',

        // Contato
        telefone: '',
        celular: '',
        email: '',

        // Representante Legal
        responsavel_nome: '',
        responsavel_cpf: '',
        responsavel_cargo: '',
        responsavel_celular: '',
        responsavel_email: ''
    });

    const handleReset = () => {
        setFormData({
            razao_social: '',
            nome_fantasia: '',
            cnpj: '',
            cnae_principal: '',
            data_abertura: '',
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            telefone: '',
            celular: '',
            email: '',
            responsavel_nome: '',
            responsavel_cpf: '',
            responsavel_cargo: '',
            responsavel_celular: '',
            responsavel_email: '',
            tipo_empresa: "",
        })
    }

    const buscarEndereco = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            //se o CEP não for inserido
            if (data.erro) {
                setError('CEP não encontrado');
                setFormData((prev) => ({
                    ...prev,
                    logradouro: '',
                    bairro: '',
                    cidade: '',
                    estado: '',
                }));
                return;
            }

            //
            setError(null)
            setFormData((prev) => ({
                ...prev,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
            }))
        } catch (error) {
            setError('Erro ao buscar CEP');
            console.error(err);
        }
    }

    const handleCEPChange = (e) => {
        const formatted = formatCEP(e.target.value);
        setFormData((prev) => ({
            ...prev,
            cep: formatted
        }));

        // Quando o CEP tem 9 caracteres, faz a busca do endereço
        if (formatted.length === 9) {
            buscarEndereco(formatted.replace('-', '')); // Remove o hífen antes de buscar
        }
    };  

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

    const formatCNPJ = (value) => {
        const numbers = value.replace(/\D/g, '')

        if (numbers.length <= 14) {
            return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
        }

        return value
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

    const formatPhone = (value) => {
        // Remove todos os caracteres não numéricos
        const numbers = value.replace(/\D/g, '');

        // Se o valor tiver até 10 dígitos (telefone fixo)
        if (numbers.length <= 10) {
            // Formato: (XX) XXXX-XXXX
            return numbers.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        }
        else {
            // Se o valor tiver 11 ou mais dígitos (telefone celular)
            // Formato: (XX) 9XXXX-XXXX
            return numbers.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    };

    const formatCEP = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 8) {
            return numbers.replace(/^(\d{5})(\d{3})(\d{0,4}).*/, '$1-$2');
        }
    }

    const handleCNPJChange = (e) => {
        const formatted = formatCNPJ(e.target.value);
        setFormData(prev => ({
            ...prev,
            cnpj: formatted
        }));
    };

    const handleCPFChange = (e) => {
        const formatted = formatCPF(e.target.value)
        setFormData(prev => ({
            ...prev,
            responsavel_cpf: formatted
        }))
    }

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setFormData(prev => ({
            ...prev,
            celular: formatted
        }));
    };

    const handleTelChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setFormData(prev => ({
            ...prev,
            telefone: formatted
        }));
    };

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [errors, setErrors] = useState({})

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <Header
                icon={<HousePlus className="w-8 h-8 text-blue-600" />}
                title={"Cadastro de Empresa"}
                text={"Preencha as informações da nova empresa"}
            />

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dados Pessoais */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados da Empresa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput
                            label={"Razão Social *"}
                            type={"text"}
                            name={"razao_social"}
                            value={formData.razao_social}
                            onChange={handleInputChange}
                            placeholder={"Digite a razão social"}
                            error={errors.razao_social}
                        />

                        <FormInput
                            label={"Nome Fantasia"}
                            type={"text"}
                            name={"nome_fantasia"}
                            value={formData.nome_fantasia}
                            onChange={handleInputChange}
                            placeholder={"Digite o nome fantasia"}
                        />

                        <FormInput
                            label={"CNPJ *"}
                            type={"text"}
                            name={"cnpj"}
                            value={formData.cnpj}
                            onChange={handleCNPJChange}
                            placeholder={"00.000.000/0001-00"}
                            maxLength='14'
                            error={errors.cnpj}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Empresa</label>
                            <select
                                name="tipo_empresa"
                                value={formData.tipo_empresa}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione</option>
                                <option value="MEI">MEI</option>
                                <option value="LTDA">LTDA</option>
                                <option value="EIRELI">EIRELI</option>
                                <option value="SA">S/A</option>
                            </select>
                        </div>

                        <FormInput
                            label={"Data de Abertura"}
                            type={"date"}
                            name={"data_abertura"}
                            value={formData.data_abertura}
                            onChange={handleInputChange}
                            error={errors.data_nascimento}
                        />

                    </div>
                </div>

                {/* Endereço */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Endereço</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FormInput
                            label={"CEP *"}
                            type={"text"}
                            name={"cep"}
                            value={formData.cep}
                            onChange={handleCEPChange}
                            placeholder={"00000-000"}
                            maxLength={"8"}
                        />

                        <FormInput
                            label={"Endereço *"}
                            type={"text"}
                            name={"logradouro"}
                            value={formData.logradouro}
                            onChange={handleInputChange}
                            placeholder={"Rua Jardim da Silva"}
                        />

                        <FormInput
                            label={"Número *"}
                            type={"text"}
                            name={"numero"}
                            value={formData.numero}
                            onChange={handleInputChange}
                            placeholder={"123"}
                            maxLength={"10"}
                        />

                        <FormInput
                            label={"Complemento"}
                            type={"text"}
                            name={"complemento"}
                            value={formData.complemento}
                            onChange={handleInputChange}
                            placeholder={"Apto"}
                        />

                        <FormInput
                            label={"Bairro *"}
                            type={"text"}
                            name={"bairro"}
                            value={formData.bairro}
                            onChange={handleInputChange}
                            placeholder={"Centro"}
                        />

                        <FormInput
                            label={"Cidade *"}
                            type={"text"}
                            name={"cidade"}
                            value={formData.cidade}
                            onChange={handleInputChange}
                            placeholder={"Digite sua cidade"}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado *
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

                {/* Contato */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Contato</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput
                            label={"Telefone"}
                            type={"tel"}
                            name={"telefone"}
                            value={formData.telefone}
                            onChange={handleTelChange}
                            placeholder={"(48) 3000-0000"}
                            maxLength={"14"}
                        />

                        <FormInput
                            label={"Celular"}
                            type={"tel"}
                            name={"celular"}
                            value={formData.celular}
                            onChange={handlePhoneChange}
                            placeholder={"(48) 99000-0000"}
                            maxLength={"15"}
                        />

                        <FormInput
                            label={"E-mail"}
                            type={"email"}
                            name={"email"}
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder={"email@exemplo.com"}
                            error={errors.email}
                        />
                    </div>
                </div>


                {/* Representante Legal */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Representante Legal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput
                            label={"Nome *"}
                            type={"text"}
                            name={"responsavel_nome"}
                            value={formData.responsavel_nome}
                            onChange={handleInputChange}
                            placeholder={"Nome do representante"}
                        />

                        <FormInput
                            label={"CPF"}
                            type={"text"}
                            name={"responsavel_cpf"}
                            value={formData.responsavel_cpf}
                            maxLength={"11"}
                            onChange={handleCPFChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder={"000.000.000-00"}
                            error={errors.cpf}
                        />

                        <FormInput
                            label={"Cargo"}
                            type={"text"}
                            name={"responsavel_cargo"}
                            value={formData.responsavel_cargo}
                            onChange={handleInputChange}
                            placeholder={"Cargo do responsável"}
                        />

                        <FormInput
                            label={"Celular"}
                            type={"tel"}
                            name={"responsavel_celular"}
                            value={formData.responsavel_celular}
                            onChange={handleInputChange}
                            placeholder={"(48) 99000-0000"}
                            maxLength={"11"}
                        />

                        <FormInput
                            label={"E-mail"}
                            type={"email"}
                            name={"responsavel_email"}
                            value={formData.responsavel_email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder={"email@exemplo.com"}
                            error={errors.email}
                        />
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
                        {loading ? 'Salvando...' : 'Salvar Empresa'}
                    </Button>
                </div>
            </form>
        </div>
    )
}