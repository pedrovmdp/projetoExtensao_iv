export default function Stats({data}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.length}
          </p>
          <p className="text-sm text-gray-600">Total de Acompanhamentos</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {data.filter((a) => a.status === "Ativo").length}
          </p>
          <p className="text-sm text-gray-600">Ativos</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {
              data.filter((a) => a.status === "Em Observação").length
            }
          </p>
          <p className="text-sm text-gray-600">Em Observação</p>
        </div>
      </div>
    </div>
  );
}
