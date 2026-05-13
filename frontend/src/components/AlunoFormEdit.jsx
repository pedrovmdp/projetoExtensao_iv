import { FileText, User, Phone, Calendar, Save } from "lucide-react";

import { Button } from "@/components/ui/button.jsx";

import FormInputDiv from "./FormInputDiv";

import FormInput from "./FormInput";

import IconColor from "../assets/IconColor";

import { toast } from "sonner";

const AlunoFormEdit = ({ formData, onChange, onSubmit, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.cpf) {
      toast.error("Preencha os campos obrigatórios (Nome e CPF)");

      return;
    }

    onSubmit(formData);
  };

  const handleStatusChange = (e) => {
    const isAtivo = e.target.value === "true";

    onChange({
      target: {
        name: "ativo",

        value: isAtivo,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Editar Aluno</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <FormInputDiv
          icon={User}
          iconColor={IconColor.blue}
          title="Dados Pessoais"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Nome *"
              name="nome"
              value={formData.nome}
              onChange={onChange}
            />
            <FormInput
              label="CPF *"
              name="cpf"
              value={formData.cpf}
              onChange={onChange}
            />
            <FormInput
              label="Data de Nascimento"
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={onChange}
            />
          </div>
        </FormInputDiv>

        {/* Contato */}
        <FormInputDiv icon={Phone} iconColor={IconColor.green} title="Contato">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={onChange}
            />
            <FormInput
              label="Nome Responsável"
              name="nome_responsavel"
              value={formData.nome_responsavel}
              onChange={onChange}
            />
            <FormInput
              label="Telefone do Responsável"
              name="telefone_responsavel"
              value={formData.telefone_responsavel}
              onChange={onChange}
            />
          </div>
        </FormInputDiv>

        {/* Dados Institucionais */}
        <FormInputDiv
          icon={Calendar}
          iconColor={IconColor.orange}
          title="Dados Institucionais"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Data de Entrada"
              type="date"
              name="data_entrada"
              value={formData.data_entrada}
              onChange={onChange}
            />

            {/* 🔥 CAMPO STATUS CUSTOMIZADO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="ativo"
                value={formData.ativo}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={true}>Ativo</option>
                <option value={false}>Inativo</option>
              </select>

              {/* Badge Visual do Status */}
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    formData.ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {formData.ativo ? "✓ Ativo" : "✕ Inativo"}
                </span>
              </div>
            </div>

            <FormInput
              label="Informações Médicas"
              name="info_medicamentos"
              value={formData.info_medicamentos}
              onChange={onChange}
            />
          </div>
        </FormInputDiv>

        {/* Botões */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Atualizar Aluno
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AlunoFormEdit;