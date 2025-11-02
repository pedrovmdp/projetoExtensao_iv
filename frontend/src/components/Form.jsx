export default function Form({ }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                    {editingId ? "Editar Acompanhamento" : "Novo Acompanhamento"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados do Aluno e Empresa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Dados do Aluno
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <AutoCompleteInput
                                label={"Nome do Aluno *"}
                                value={formData.nomeAluno}
                                onSelect={handleSelectStudent}
                                fetchData={handleFetchStudents}
                                placeholder={"Digite o nome do aluno..."}
                                error={errors.nomeAluno}
                            />

                            <FormInput
                                label={"Data de Admissão *"}
                                type={"date"}
                                name={"dataAdmissao"}
                                value={formData.dataAdmissao}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dataAdmissao ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={"Nome completo do aluno"}
                                error={errors.dataAdmissao}
                            />
                            <FormInput
                                label={"Cargo *"}
                                type={"text"}
                                name={"cargo"}
                                value={formData.cargo}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cargo ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={"Cargo do aluno"}
                                error={errors.cargo}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Building className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Dados da Empresa
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <AutoCompleteInput
                                label="Razão Social da Empresa *"
                                value={formData.razao_social}
                                onSelect={handleSelectCompany}
                                fetchData={handleFetchCompanies}
                                placeholder="Nome da empresa"
                            />

                            <FormInput
                                label={"Responsável RH *"}
                                type={"text"}
                                name={"responsavelRH"}
                                value={formData.responsavelRH}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.responsavelRH
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                placeholder={"Nome do responsável pelo RH"}
                                error={errors.responsavelRH}
                            />
                        </div>
                    </div>
                </div>

                {/* Dados da Visita */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Dados da Visita
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput
                            label={"Data da Visita *"}
                            type={"date"}
                            name={"dataVisita"}
                            value={formData.dataVisita}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dataVisita ? "border-red-500" : "border-gray-300"
                                }`}
                            error={errors.dataVisita}
                        />

                        <FormInput
                            label={"Contato com *"}
                            type={"text"}
                            name={"contatoCom"}
                            value={formData.contatoCom}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contatoCom ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder={"Ex: Supervisor, Gerente, etc."}
                            error={errors.contatoCom}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Ativo">Ativo</option>
                                <option value="Em Observação">Em Observação</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Parecer Geral */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parecer Geral *
                    </label>
                    <textarea
                        name="parecerGeral"
                        value={formData.parecerGeral}
                        onChange={handleInputChange}
                        rows={6}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.parecerGeral ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Descreva o parecer geral sobre o acompanhamento do aluno na empresa..."
                    />
                    {errors.parecerGeral && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.parecerGeral}
                        </p>
                    )}
                </div>

                {/* Botões */}
                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={handleResetForm}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Save className="w-4 h-4" />
                        {editingId ? "Atualizar" : "Salvar"} Acompanhamento
                    </Button>
                </div>
            </form>
        </div>
    )
}