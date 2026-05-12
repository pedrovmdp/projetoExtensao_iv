import {
  Building,
  Building2,
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
} from "lucide-react";

import Header from "../components/Header";

import TextRow from "../components/ui/textRow";

import { Button } from "@/components/ui/button.jsx";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchCompanys,
  fetchCompanytByName,
} from "../../store/features/companySlice";

import { toast } from "sonner";

export default function EmpresasParceiras() {
  const dispatch = useDispatch();

  const companys = useSelector((state) => state.companys.companys || []);

  const loading = useSelector((state) => state.companys.loading);

  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCompanys());
  }, [dispatch]);

  // 🔍 BUSCA EM TEMPO REAL

  const handleSearch = async (value) => {
    setSearchTerm(value);

    if (value.length >= 2) {
      try {
        await dispatch(fetchCompanytByName(value)).unwrap();
      } catch (error) {
        toast.error("Erro ao buscar empresas");
      }
    } else if (value.length === 0) {
      dispatch(fetchCompanys());
    }
  };

  const handleViewDetails = (empresa) => {
    setSelectedEmpresa(empresa);

    setShowModal(true);
  };

  const formatCNPJ = (cnpj) => {
    if (!cnpj) return "";

    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  };

  const formatPhone = (phone) => {
    if (!phone) return "";

    if (phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }

    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  };

  const formatCEP = (cep) => {
    if (!cep) return "";

    return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        icon={<Building2 className="w-8 h-8 text-blue-600" />}
        title="Empresas Parceiras"
        text="Visualize e gerencie todas as empresas cadastradas"
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
                placeholder="Buscar por nome fantasia, razão social ou CNPJ..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Total de empresas */}
          <div className="md:w-48">
            <div className="relative">
              <p className="text-2xl font-bold text-blue-600 text-center">
                {companys.length}
              </p>
              <p className="text-xs text-gray-600 text-center">
                Total de empresas parceiras
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de empresas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Empresas Registradas
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : companys.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma empresa encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TextRow text="Razão Social" />
                  <TextRow text="Nome Fantasia" />
                  <TextRow text="CNPJ" />
                  <TextRow text="Telefone" />
                  <TextRow text="Cidade/UF" />
                  <TextRow text="Ações" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companys.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    {/* Razão Social */}
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

                    {/* Nome Fantasia */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.nome_fantasia}
                      </div>
                    </td>

                    {/* CNPJ */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCNPJ(company.cnpj)}
                    </td>

                    {/* Telefone */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPhone(company.telefone)}
                    </td>

                    {/* Cidade/UF */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.cidade}/{company.uf}
                    </td>

                    {/* Ações */}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}

      {showModal && selectedEmpresa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header do Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalhes da Empresa
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Dados da Empresa */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Dados da Empresa
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Razão Social
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.razao_social}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Nome Fantasia
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.nome_fantasia}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          CNPJ
                        </p>
                        <p className="text-gray-900">
                          {formatCNPJ(selectedEmpresa.cnpj)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Telefone
                        </p>
                        <p className="text-gray-900">
                          {formatPhone(selectedEmpresa.telefone)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Endereço
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">CEP</p>
                        <p className="text-gray-900">
                          {formatCEP(selectedEmpresa.cep)}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-600">
                          Logradouro
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.logradouro}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Número
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.numero}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-600">
                          Complemento
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.complemento || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Bairro
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.bairro}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Cidade
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.cidade}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">UF</p>
                        <p className="text-gray-900">{selectedEmpresa.uf}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contato RH */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Contato RH
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Nome
                        </p>
                        <p className="text-gray-900">
                          {selectedEmpresa.contato_rh_nome}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Email
                        </p>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />

                          {selectedEmpresa.contato_rh_email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}