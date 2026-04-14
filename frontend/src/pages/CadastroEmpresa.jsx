import { AlertCircle, CheckCircle, HousePlus, RotateCcw, Save } from "lucide-react"
import Header from "../components/Header"
import { useState } from "react"
import { Button } from '@/components/ui/button.jsx'
import FormInput from "../components/FormInput";
import { useDispatch } from "react-redux";
import { addCompany } from "../../store/features/companySlice";

export default function CadastroEmpresa() {
    const dispatch = useDispatch()

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        // Empresa
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        telefone: '',

        // Endereço
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',

        // Contato RH
        contato_rh_nome: '',
        contato_rh_email: ''
    })

    const handleReset = () => {
        setFormData({
            razao_social: '',
            nome_fantasia: '',
            cnpj: '',
            telefone: '',

            // Endereço
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',

            // Contato RH
            contato_rh_nome: '',
            contato_rh_email: ''
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

    const clearError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: ''
            }))
        }
    }

    const handleCEPChange = (e) => {
        const formatted = formatCEP(e.target.value);
        setFormData((prev) => ({
            ...prev,
            cep: formatted
        }));

        clearError('cep')

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

        clearError('cnpj')
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

    const validateForm = () => {
        const newErrors = {};

        // Campos obrigatórios
        if (!formData.razao_social.trim()) {
            newErrors.razao_social = "Razão social é obrigatório";
        }

        if (!formData.nome_fantasia) {
            newErrors.nome_fantasia = "Nome fantasia da empresa é obrigatório";
        }

        if (!formData.cnpj.trim()) {
            newErrors.cnpj = "CNPJ é obrigatório"
        } else if (formData.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(formData.cnpj)) {
            newErrors.cnpj = "CNPJ inválido";
        }

        if (!formData.data_abertura) {
            newErrors.data_abertura = "Data de abertura é obrigatória";
        }

        // Validar email se fornecido
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "E-mail inválido";
        } else if (!formData.email.trim()) {
            newErrors.email = "E-mail é obrigatório"
        }

        if (!formData.cep.trim()) {
            newErrors.cep = "Cep é obrigatório";
        }

        if (!formData.logradouro.trim()) {
            newErrors.logradouro = "Endereço é obrigatório";
        } else {
            clearError('logradouro')
        }

        if (!formData.numero.trim()) {
            newErrors.numero = "Número é obrigatório";
        } else {
            clearError('numero')
        }

        if (!formData.bairro.trim()) {
            newErrors.bairro = "Bairro é obrigatório";
        } else {
            clearError('bairro')
        }

        if (!formData.cidade.trim()) {
            newErrors.cidade = "Cidade é obrigatório";
        } else (
            clearError('cidade')
        )

        if (!formData.responsavel_nome.trim()) {
            newErrors.responsavel_nome = "Nome do responsavel é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (data) => {
        data.preventDefault();

        // Validação do formulário
        if (!validateForm()) {
            setMessage({
                type: 'error',
                text: 'Por favor, corrija os erros no formulário',
            });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const newCompany = {
                razao_social: formData.razao_social,
                nome_fantasia: formData.nome_fantasia,
                cnpj: formData.cnpj,
                telefone: formData.telefone,
                endereco: {
                    cep: formData.cep,
                    logradouro: formData.logradouro,
                    numero: formData.numero,
                    complemento: formData.complemento,
                    bairro: formData.bairro,
                    cidade: formData.cidade,
                    estado: formData.estado,
                },
                contato: {
                    telefone: formData.telefone,
                    celular: formData.celular,
                    email: formData.email,
                },
                responsavel: {
                    nome: formData.responsavel_nome,
                    cpf: formData.responsavel_cpf,
                    cargo: formData.responsavel_cargo,
                    celular: formData.responsavel_celular,
                    email: formData.responsavel_email,
                }
            };

            dispatch(addCompany(newCompany));

            setMessage({
                type: 'success',
                text: 'Empresa cadastrada com sucesso!',
            });

            // Limpar formulário após sucesso
            setTimeout(() => {
                handleReset();
                setMessage({ type: '', text: '' });
            }, 2000);

        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error)
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

            {/* Mensagem de feedback */}
            {message.text && (
                <div
                    className={`p-4 rounded-lg flex items-center gap-2 ${message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    {message.text}
                </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Empresa */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-6">Dados da Empresa</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <FormInput
                            label="Razão Social *"
                            name="razao_social"
                            value={formData.razao_social}
                            onChange={handleInputChange}
                            error={errors.razao_social}
                        />

                        <FormInput
                            label="Nome Fantasia *"
                            name="nome_fantasia"
                            value={formData.nome_fantasia}
                            onChange={handleInputChange}
                            error={errors.nome_fantasia}
                        />

                        <FormInput
                            label="CNPJ *"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleCNPJChange}
                            maxLength="14"
                            error={errors.cnpj}
                        />

                        <FormInput
                            label="Telefone *"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleTelChange}
                            maxLength="14"
                            error={errors.telefone}
                        />

                    </div>
                </div>

                {/* Endereço */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-6">Endereço</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <FormInput
                            label="CEP *"
                            name="cep"
                            value={formData.cep}
                            onChange={handleCEPChange}
                            maxLength="8"
                            error={errors.cep}
                        />

                        <FormInput
                            label="Logradouro *"
                            name="logradouro"
                            value={formData.logradouro}
                            onChange={handleInputChange}
                            error={errors.logradouro}
                        />

                        <FormInput
                            label="Número *"
                            name="numero"
                            value={formData.numero}
                            onChange={handleInputChange}
                            error={errors.numero}
                        />

                        <FormInput
                            label="Complemento"
                            name="complemento"
                            value={formData.complemento}
                            onChange={handleInputChange}
                        />

                        <FormInput
                            label="Bairro *"
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleInputChange}
                            error={errors.bairro}
                        />

                        <FormInput
                            label="Cidade *"
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleInputChange}
                            error={errors.cidade}
                        />

                        <div>
                            <label className="block text-sm font-medium mb-2">UF *</label>
                            <select
                                name="uf"
                                value={formData.uf}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="">Selecione</option>
                                <option value="SC">SC</option>
                                <option value="RS">RS</option>
                                <option value="PR">PR</option>
                                <option value="SP">SP</option>
                                <option value="RJ">RJ</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Contato RH */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-6">Contato RH</h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <FormInput
                            label="Nome do RH *"
                            name="contato_rh_nome"
                            value={formData.contato_rh_nome}
                            onChange={handleInputChange}
                            error={errors.contato_rh_nome}
                        />

                        <FormInput
                            label="Email do RH *"
                            type="email"
                            name="contato_rh_email"
                            value={formData.contato_rh_email}
                            onChange={handleInputChange}
                            error={errors.contato_rh_email}
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
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Limpar
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        onClick={handleSubmit}
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Salvando...' : 'Salvar Empresa'}
                    </Button>
                </div>
            </form>
        </div>
    )
}