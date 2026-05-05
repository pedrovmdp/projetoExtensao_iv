import { useState } from "react";
import {
  UserPlus,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import { useDispatch } from "react-redux";
import { createPerson } from "../../store/features/peopleSlice";
import { useForm } from "react-hook-form";

const CadastroAluno = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nome: "",
      cpf: "",
      roleId: 3,
      data_nascimento: "",
      data_entrada: "",
      telefone: "",
      nome_responsavel: "",
      telefone_responsavel: "",
      usa_medicamento: false,
      info_medicamentos: "",
      ativo: true,
    },
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const usaMedicamento = watch("usa_medicamento");

  // CPF máscara
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    return numbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
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

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setValue("cpf", formatted);
  };

  const isValidCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;

    let sum = 0;
    let rest;

    for (let i = 1; i <= 9; i++)
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);

    rest = (sum * 10) % 11;
    if (rest >= 10) rest = 0;
    if (rest !== parseInt(numbers.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);

    rest = (sum * 10) % 11;
    if (rest >= 10) rest = 0;

    return rest === parseInt(numbers.substring(10, 11));
  };

  const handleBackendError = (error) => {
    const data = error?.response?.data;

    const msg = data?.message || "Erro inesperado";
    const field = data?.field;

    // 👉 ERRO por campo (CPF, data etc)
    if (field) {
      setError(field, {
        type: "server",
        message: msg,
      });

      return;
    }

    // 👉 erro geral
    setMessage({
      type: "error",
      text: msg,
    });

    // auto hide
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  };

  const onSubmit = async (data) => {
    try {
      const newStudent = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
        telefone: data.telefone.replace(/\D/g, ""),
        telefone_responsavel: data.telefone_responsavel.replace(/\D/g, ""),
      };

      await dispatch(createPerson(newStudent)).unwrap();

      setMessage({
        type: "success",
        text: "Cadastro realizado com sucesso!",
      });

      // 👇 auto remove mensagem
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);

      reset();
      scrollToTop();

    } catch (error) {
      handleBackendError(error);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-6">
      <Header
        icon={<UserPlus className="w-8 h-8 text-blue-600" />}
        title="Cadastro de Pessoa"
        text="Preencha as informações"
      />

      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {message.type === "success" ? "✅" : "⚠️"}
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Dados pessoais */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl mb-4">Dados Pessoais</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Nome *"
              {...register("nome", { required: "Nome é obrigatório" })}
              error={errors.nome?.message}
            />

            <FormInput
              label="CPF *"
              maxLength={14}
              {...register("cpf", {
                required: "CPF é obrigatório",
                validate: (v) => isValidCPF(v) || "CPF inválido",
                onChange: (e) => {
                  const formatted = formatCPF(e.target.value);

                  setValue("cpf", formatted, {
                    shouldValidate: true,
                  });
                }
              })}
              error={errors.cpf?.message}
            />

            <FormInput
              type="date"
              label="Data nascimento *"
              {...register("data_nascimento", {
                required: "Obrigatório",
              })}
              error={errors.data_nascimento?.message}
            />

            <FormInput
              type="date"
              label="Data entrada *"
              {...register("data_entrada", {
                required: "Obrigatório",
              })}
              error={errors.data_entrada?.message}
            />
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl mb-4">Contato</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Telefone *"
              maxLength={15}
              {...register("telefone", {
                required: "Telefone obrigatório",
                onChange: (e) => {
                  const formatted = formatPhone(e.target.value);

                  setValue("telefone", formatted, {
                    shouldValidate: true,
                  });
                },
              })}
              error={errors.telefone?.message}
            />

            <FormInput
              label="Telefone responsável *"
              maxLength={15}
              {...register("telefone_responsavel", {
                required: "Obrigatório",
                onChange: (e) => {
                  const formatted = formatPhone(e.target.value);

                  setValue("telefone_responsavel", formatted, {
                    shouldValidate: true,
                  });
                },
              })}
              error={errors.telefone_responsavel?.message}
            />

            <FormInput
              label="Nome responsável *"
              {...register("nome_responsavel", {
                required: "Obrigatório",
              })}
              error={errors.nome_responsavel?.message}
            />
          </div>
        </div>

        {/* Medicamento */}
        <div className="bg-white p-6 rounded-lg border">
          <label className="flex gap-2">
            <input type="checkbox" {...register("usa_medicamento")} />
            Usa medicamento?
          </label>

          {usaMedicamento && (
            <textarea
              className="w-full border mt-3 p-2"
              placeholder="Informe os medicamentos"
              {...register("info_medicamentos", {
                required: "Informe os medicamentos",
              })}
            />
          )}
          {errors.info_medicamentos && (
            <p className="text-red-500">{errors.info_medicamentos.message}</p>
          )}
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => reset()}
            className="flex items-center gap-2 cursor-pointer bg-white text-black hover:bg-gray-100 border"
          >
            <RotateCcw className="w-4 h-4" />
            Limpar
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Save className="flex items-center gap-2 cursor-pointer" />
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastroAluno;