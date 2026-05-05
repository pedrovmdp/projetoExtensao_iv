import { useState } from "react";
import { HousePlus, RotateCcw, Save, CheckCircle, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import { useDispatch } from "react-redux";
import { addCompany } from "../../store/features/companySlice";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.jsx";

export default function CadastroEmpresa() {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            razao_social: "",
            nome_fantasia: "",
            cnpj: "",
            telefone: "",
            cep: "",
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            uf: "",
            contato_rh_nome: "",
            contato_rh_email: "",
        },
    });

    const [message, setMessage] = useState({ type: "", text: "" });

    // ======================
    // FORMATADORES
    // ======================
    const formatCNPJ = (value) => {
        const numbers = value.replace(/\D/g, "").slice(0, 14);
        return numbers
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    };

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "").slice(0, 11);

        if (numbers.length <= 10) {
            return numbers
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }

        return numbers
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    };

    const formatCEP = (value) => {
        const numbers = value.replace(/\D/g, "").slice(0, 8);
        return numbers.replace(/^(\d{5})(\d)/, "$1-$2");
    };

    // ======================
    // CEP
    // ======================
    const buscarEndereco = async (cep) => {
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            if (data.erro) {
                setError("cep", {
                    type: "manual",
                    message: "CEP não encontrado",
                });
                return;
            }

            setValue("logradouro", data.logradouro);
            setValue("bairro", data.bairro);
            setValue("cidade", data.localidade);
            setValue("uf", data.uf);
        } catch {
            setError("cep", {
                type: "manual",
                message: "Erro ao buscar CEP",
            });
        }
    };

    const handleCEPChange = (e) => {
        const formatted = formatCEP(e.target.value);

        setValue("cep", formatted, { shouldValidate: true });

        if (formatted.length === 9) {
            buscarEndereco(formatted.replace("-", ""));
        }
    };

    const handleCNPJChange = (e) => {
        setValue("cnpj", formatCNPJ(e.target.value), {
            shouldValidate: true,
        });
    };

    const handlePhoneChange = (e) => {
        setValue("telefone", formatPhone(e.target.value), {
            shouldValidate: true,
        });
    };

    // ======================
    // SUBMIT
    // ======================
    const onSubmit = async (data) => {
        try {
            const newCompany = {
                ...data,

                cnpj: (data.cnpj || "").replace(/\D/g, ""),
                telefone: (data.telefone || "").replace(/\D/g, ""),
                cep: (data.cep || "").replace(/\D/g, ""), // 👈 ESSENCIAL
            };

            await dispatch(addCompany(newCompany)).unwrap();

            setMessage({
                type: "success",
                text: "Empresa cadastrada com sucesso!",
            });

            reset();

            window.scrollTo({ top: 0, behavior: "smooth" });

            setTimeout(() => {
                setMessage({ type: "", text: "" });
            }, 3000);

        } catch (error) {
            setMessage({
                type: "error",
                text: error?.message || "Erro ao cadastrar empresa",
            });

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="space-y-6">

            <Header
                icon={<HousePlus className="w-8 h-8 text-blue-600" />}
                title="Cadastro de Empresa"
                text="Preencha as informações da nova empresa"
            />

            {/* mensagem */}
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Empresa */}
                <div className="bg-white p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-6">Dados da Empresa</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <FormInput
                            label="Razão Social *"
                            {...register("razao_social", {
                                required: "Obrigatório",
                            })}
                            error={errors.razao_social?.message}
                        />

                        <FormInput
                            label="Nome Fantasia *"
                            {...register("nome_fantasia", {
                                required: "Obrigatório",
                            })}
                            error={errors.nome_fantasia?.message}
                        />

                        <FormInput
                            label="CNPJ *"
                            {...register("cnpj", {
                                required: "CNPJ é obrigatório",
                                setValueAs: (v) => v.replace(/[^\d]/g, ""),
                            })}
                            onChange={(e) => {
                                const formatted = formatCNPJ(e.target.value);
                                setValue("cnpj", formatted, { shouldValidate: true });
                            }}
                        />

                        <FormInput
                            label="Telefone *"
                            {...register("telefone", {
                                required: "Obrigatório",
                            })}
                            onChange={handlePhoneChange}
                            error={errors.telefone?.message}
                        />
                    </div>
                </div>

                {/* Endereço */}
                <div className="bg-white p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-6">Endereço</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <FormInput
                            label="CEP *"
                            {...register("cep", {
                                required: "Obrigatório",
                            })}
                            onChange={handleCEPChange}
                            error={errors.cep?.message}
                        />

                        <FormInput
                            label="Logradouro *"
                            {...register("logradouro", {
                                required: "Obrigatório",
                            })}
                            error={errors.logradouro?.message}
                        />

                        <FormInput
                            label="Número *"
                            {...register("numero", {
                                required: "Obrigatório",
                            })}
                            error={errors.numero?.message}
                        />

                        <FormInput
                            label="Complemento"
                            {...register("complemento")}
                        />

                        <FormInput
                            label="Bairro *"
                            {...register("bairro", {
                                required: "Obrigatório",
                            })}
                            error={errors.bairro?.message}
                        />

                        <FormInput
                            label="Cidade *"
                            {...register("cidade", {
                                required: "Obrigatório",
                            })}
                            error={errors.cidade?.message}
                        />

                        <div>
                            <label className="block text-sm font-medium mb-2">UF *</label>
                            <select
                                {...register("uf", {
                                    required: "Obrigatório",
                                })}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="">Selecione</option>
                                <option value="SC">SC</option>
                                <option value="RS">RS</option>
                                <option value="PR">PR</option>
                                <option value="SP">SP</option>
                                <option value="RJ">RJ</option>
                            </select>
                            {errors.uf && (
                                <p className="text-red-500 text-sm">{errors.uf.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RH */}
                <div className="bg-white p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-6">Contato RH</h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <FormInput
                            label="Nome RH *"
                            {...register("contato_rh_nome", {
                                required: "Obrigatório",
                            })}
                            error={errors.contato_rh_nome?.message}
                        />

                        <FormInput
                            label="Email RH *"
                            type="email"
                            {...register("contato_rh_email", {
                                required: "Obrigatório",
                            })}
                            error={errors.contato_rh_email?.message}
                        />
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-4">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Limpar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>

                </div>

            </form>
        </div>
    );
}