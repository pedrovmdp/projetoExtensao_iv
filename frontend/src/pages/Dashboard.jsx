import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  Award,
  LayoutDashboard,
} from "lucide-react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonitorings,
  selectAllMonitoring,
  selectLoading,
} from "../../store/features/monitoringSlice";
import StatCard from "../components/StatCard";
import {
  fetchStudents,
  selectAllStudents,
} from "../../store/features/studentSlice";
import {
  fetchReviews,
  selectAllReviews,
} from "../../store/features/reviewSlice";
import { selectLoading as selectLoadingReview } from "../../store/features/reviewSlice";
import { selectLoading as selectLoadingStudent } from "../../store/features/studentSlice";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Componente principal do Dashboard
const Dashboard = () => {
  const dispatch = useDispatch();

  const monitoring = useSelector(selectAllMonitoring);
  const loadingMonitoring = useSelector(selectLoading);

  const students = useSelector(selectAllStudents);
  const loadingStudents = useSelector(selectLoadingStudent);

  const review = useSelector(selectAllReviews);
  const loadingReview = useSelector(selectLoadingReview);

  useEffect(() => {
    dispatch(fetchMonitorings());
    dispatch(fetchStudents());
    dispatch(fetchReviews());
  }, [dispatch]);

  console.log(review);

  const [stats, setStats] = useState({});
  const [acompanhamentoStats, setAcompanhamentoStats] = useState({});
  const [avaliacaoStats, setAvaliacaoStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gerar dados para o gráfico de alunos por mês
  const acompanhamentoData = useMemo(() => {
    if (!students || students.length === 0) return [];

    const contagem = {};

    students.forEach((aluno) => {
      const dataStr = aluno?.dados_institucionais?.data_ingresso;
      if (!dataStr) return;

      const data = parseISO(dataStr);
      if (isNaN(data)) return;

      // nome do mês abreviado + ano
      const mes = format(data, "MMM/yyyy", { locale: ptBR });
      contagem[mes] = (contagem[mes] || 0) + 1;
    });

    // converter para array ordenado
    return Object.entries(contagem)
      .map(([mes, alunos]) => ({ mes, alunos }))
      .sort((a, b) => {
        const [mesA, anoA] = a.mes.split("/");
        const [mesB, anoB] = b.mes.split("/");
        return new Date(`${anoA}-${mesA}-01`) - new Date(`${anoB}-${mesB}-01`);
      });
  }, [students]);

  const encaminhamentosData = useMemo(() => {
    if (!monitoring || monitoring.length === 0)
      return [
        { nome: "Ativos", valor: 0, cor: "#4CAF50" },
        { nome: "Em Observação", valor: 0, cor: "#FF9800" },
        { nome: "Finalizados", valor: 0, cor: "#9E9E9E" },
      ];

    const contagem = {
      Ativo: 0,
      "Em Observação": 0,
      Finalizado: 0,
    };

    monitoring.forEach((item) => {
      const status = item.status;
      if (status === "Ativo") contagem.Ativo++;
      else if (status === "Em Observação") contagem["Em Observação"]++;
      else if (status === "Finalizado") contagem.Finalizado++;
    });

    return [
      { nome: "Ativos", valor: contagem.Ativo, cor: "#4CAF50" },
      {
        nome: "Em Observação",
        valor: contagem["Em Observação"],
        cor: "#FF9800",
      },
      { nome: "Finalizados", valor: contagem.Finalizado, cor: "#ff2121ff" },
    ];
  }, [monitoring]);

  // Gerar gráfico de avaliações por período (por mês)
  const avaliacoesData = useMemo(() => {
    if (!review || review.length === 0) return [];

    const contagem = {};

    review.forEach((avaliacao) => {
      const dataStr = avaliacao?.dataAvaliacao; // <--- substitua se o nome for diferente
      if (!dataStr) return;

      const data = parseISO(dataStr);
      if (isNaN(data)) return;

      const mes = format(data, "MMM/yyyy", { locale: ptBR });
      contagem[mes] = (contagem[mes] || 0) + 1;
    });

    return Object.entries(contagem)
      .map(([periodo, avaliacoes]) => ({ periodo, avaliacoes }))
      .sort((a, b) => {
        const [mesA, anoA] = a.periodo.split("/");
        const [mesB, anoB] = b.periodo.split("/");
        return new Date(`${anoA}-${mesA}-01`) - new Date(`${anoB}-${mesB}-01`);
      });
  }, [review]);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral das atividades do Instituto Diomício Freitas
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={encaminhamentosData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        icon={<LayoutDashboard className="w-8 h-8 text-blue-600" />}
        title={"Dashboard"}
        text={"Visão geral das atividades do Instituto Diomício Freitas"}
      />

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Alunos Ativos"
          value={students ? students.filter((student) => student.dados_institucionais.status === "Ativo").length : 0}
          icon={Users}
          color="bg-blue-500"
          subtitle="Total alunos"
          loading={loadingStudents}
        />
        <StatCard
          title="Encaminhados para Trabalho"
          value={
            monitoring
              ? monitoring.filter((aluno) => aluno.status === "Em Observação")
                  .length
              : 0
          }
          icon={Briefcase}
          color="bg-green-500"
          subtitle="Alunos encaminhados"
          loading={loadingMonitoring}
        />
        <StatCard
          title="Avaliações Realizadas"
          value={review.length || 0}
          icon={ClipboardCheck}
          color="bg-purple-500"
          subtitle="Total de avaliações"
          loading={loadingReview}
        />
        <StatCard
          title="Acompanhamentos Ativos"
          value={
            monitoring
              ? monitoring.filter((aluno) => aluno.status === "Ativo").length
              : 0
          }
          icon={Award}
          color="bg-orange-500"
          subtitle="Em andamento"
          loading={loadingMonitoring}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Acompanhamento por Mês */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Alunos por Mês
            </h3>
          </div>
          {/* {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Carregando...</p>
            </div>
          ) : ( */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={acompanhamentoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="alunos" fill="#4A90E2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* )} */}
        </div>

        {/* Gráfico de Status dos Acompanhamentos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Status dos Acompanhamentos
            </h3>
          </div>
          {loadingMonitoring ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Carregando...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={encaminhamentosData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="valor"
                  label={({ nome, valor }) => `${nome}: ${valor}`}
                >
                  {encaminhamentosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráfico de Avaliações e Estatísticas Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Avaliações */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Avaliações por Período
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={avaliacoesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avaliacoes"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo de Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Resumo de Status
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alunos Ativos</span>
              <span className="font-semibold text-green-600">
                {loadingMonitoring
                  ? "..."
                  : monitoring.filter((aluno) => aluno.status === "Ativo")
                      .length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Encaminhados</span>
              <span className="font-semibold text-blue-600">
                {loadingMonitoring
                  ? "..."
                  : monitoring
                  ? monitoring.filter(
                      (aluno) => aluno.status === "Em Observação"
                    ).length
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Em Avaliação</span>
              <span className="font-semibold text-yellow-600">
                {loadingReview ? "..." : stats.alunos_avaliacao || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">1ª Avaliações</span>
              <span className="font-semibold text-purple-600">
                {loadingReview
                  ? "..."
                  : review
                  ? review.filter((review) => review.tipoAvaliacao === "1")
                      .length
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">2ª Avaliações</span>
              <span className="font-semibold text-purple-600">
                {loadingReview
                  ? "..."
                  : review
                  ? review.filter((review) => review.tipoAvaliacao === "2")
                      .length
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Acomp. Observação</span>
              <span className="font-semibold text-orange-600">
                {loadingMonitoring
                  ? "..."
                  : monitoring.filter(
                      (monitor) => monitor.status === "Em Observação"
                    ).length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
