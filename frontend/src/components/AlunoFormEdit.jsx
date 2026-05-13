import { FileText, User, Phone, MapPin, Calendar, Save } from "lucide-react";
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
              label="RG"
              name="rg"
              value={formData.rg}
              onChange={onChange}
            />
            <FormInput
              label="Data de Nascimento"
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={onChange}
            />
            <FormInput
              label="Sexo"
              name="sexo"
              value={formData.sexo}
              onChange={onChange}
            />
            <FormInput
              label="Estado Civil"
              name="estado_civil"
              value={formData.estado_civil}
              onChange={onChange}
            />
          </div>
        </FormInputDiv>

        {/* Contato */}
        <FormInputDiv icon={Phone} iconColor={IconColor.green} title="Contato">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Telefone"
              name="contato.telefone"
              value={formData.contato.telefone}
              onChange={onChange}
            />
            <FormInput
              label="Celular"
              name="contato.celular"
              value={formData.contato.celular}
              onChange={onChange}
            />
            <FormInput
              label="E-mail"
              name="contato.email"
              value={formData.contato.email}
              onChange={onChange}
            />
          </div>
        </FormInputDiv>

        {/* Endereço */}
        <FormInputDiv icon={MapPin} iconColor={IconColor.red} title="Endereço">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="CEP"
              name="endereco.cep"
              value={formData.endereco.cep}
              onChange={onChange}
            />
            <FormInput
              label="Logradouro"
              name="endereco.logradouro"
              value={formData.endereco.logradouro}
              onChange={onChange}
              className="md:col-span-2"
            />
            <FormInput
              label="Número"
              name="endereco.numero"
              value={formData.endereco.numero}
              onChange={onChange}
            />
            <FormInput
              label="Complemento"
              name="endereco.complemento"
              value={formData.endereco.complemento}
              onChange={onChange}
            />
            <FormInput
              label="Bairro"
              name="endereco.bairro"
              value={formData.endereco.bairro}
              onChange={onChange}
            />
            <FormInput
              label="Cidade"
              name="endereco.cidade"
              value={formData.endereco.cidade}
              onChange={onChange}
            />
            <FormInput
              label="Estado"
              name="endereco.estado"
              value={formData.endereco.estado}
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
              label="Data de Ingresso"
              type="date"
              name="dados_institucionais.data_ingresso"
              value={formData.dados_institucionais.data_ingresso}
              onChange={onChange}
            />
            <FormInput
              label="Status"
              name="dados_institucionais.status"
              value={formData.dados_institucionais.status}
              onChange={onChange}
            />
            <FormInput
              label="Observações"
              name="dados_institucionais.observacoes"
              value={formData.dados_institucionais.observacoes}
              onChange={onChange}
              className="md:col-span-2"
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