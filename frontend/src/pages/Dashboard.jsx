import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardCheck,
  Award,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { searchPeopleByRoleName } from "../../store/features/peopleSlice";
import { getAllPeopleCompany } from "../../store/features/peopleCompanySlice";
import { fetchReviews } from "../../store/features/reviewSlice";
import { fetchCompanys } from "../../store/features/companySlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  // 🔥 CARREGAR DADOS
  useEffect(() => {
    dispatch(searchPeopleByRoleName("ALUNO"));
    dispatch(getAllPeopleCompany());
    dispatch(fetchCompanys());
    dispatch(fetchReviews());
  }, [dispatch]);

  // 🔥 SELECTORS
  const { alunosAtivos, isLoading } = useSelector((state) => state.people);
  const { list, isLoading: loadingPeopleCompany } = useSelector((state) => state.peopleCompany,);
  const { reviews, loading: loadingReviews } = useSelector((state) => state.reviews,);
  const { companys, loading: loadingCompany } = useSelector((state) => state.companys,);

  // 🔥 GRÁFICO: Alunos por Mês (baseado em data_entrada)
  const alunosData = useMemo(() => {
    if (!alunosAtivos || alunosAtivos.length === 0) return [];

    const contagem = {};

    alunosAtivos.forEach((aluno) => {
      const dataStr = aluno?.data_entrada;
      if (!dataStr) return;

      try {
        const data = parseISO(dataStr);
        if (isNaN(data.getTime())) return;

        const mes = format(data, "MMM/yyyy", { locale: ptBR });
        contagem[mes] = (contagem[mes] || 0) + 1;
      } catch (error) {
        console.error("Erro ao processar data:", error);
      }
    });

    return Object.entries(contagem)
      .map(([mes, alunos]) => ({ mes, alunos }))
      .sort((a, b) => {
        const [mesA, anoA] = a.mes.split("/");
        const [mesB, anoB] = b.mes.split("/");
        return new Date(`${anoA}-${mesA}-01`) - new Date(`${anoB}-${mesB}-01`);
      });
  }, [alunosAtivos]);

  // 🔥 GRÁFICO: Encaminhamentos (PeopleCompany)
  const encaminhamentosData = useMemo(() => {
    if (!list || list.length === 0) {
      return [
        { nome: "Ativos", valor: 0, cor: "#4CAF50" },
        { nome: "Inativos", valor: 0, cor: "#9E9E9E" },
      ];
    }

    const ativos = list.filter((item) => item.status === 'ATIVO').length;
    const inativos = list.length - ativos;

    return [
      { nome: "Ativos", valor: ativos, cor: "#4CAF50" },
      { nome: "Inativos", valor: inativos, cor: "#9E9E9E" },
    ];
  }, [list]);

  // 🔥 GRÁFICO: Avaliações por Período
  const avaliacoesData = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    const contagem = {};

    reviews.forEach((avaliacao) => {
      const dataStr = avaliacao?.data_avaliacao;
      if (!dataStr) return;

      try {
        const data = parseISO(dataStr);
        if (isNaN(data.getTime())) return;

        const mes = format(data, "MMM/yyyy", { locale: ptBR });
        contagem[mes] = (contagem[mes] || 0) + 1;
      } catch (error) {
        console.error("Erro ao processar data:", error);
      }
    });

    return Object.entries(contagem)
      .map(([periodo, avaliacoes]) => ({ periodo, avaliacoes }))
      .sort((a, b) => {
        const [mesA, anoA] = a.periodo.split("/");
        const [mesB, anoB] = b.periodo.split("/");
        return new Date(`${anoA}-${mesA}-01`) - new Date(`${anoB}-${mesB}-01`);
      });
  }, [reviews]);

  // 🔥 CONTADORES
  const primeiraAvaliacoes = useMemo(() => {
    return (
      reviews?.filter((review) => review.tipo === "1ª Avaliação").length || 0
    );
  }, [reviews]);

  const segundaAvaliacoes = useMemo(() => {
    return (
      reviews?.filter((review) => review.tipo === "2ª Avaliação").length || 0
    );
  }, [reviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        icon={<LayoutDashboard className="w-8 h-8 text-blue-600" />}
        title="Dashboard"
        text="Visão geral das atividades do Instituto Diomício Freitas"
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Alunos Ativos"
          value={alunosAtivos?.length || 0}
          icon={Users}
          color="bg-blue-500"
          subtitle="Total de alunos"
          loading={isLoading}
        />
        <StatCard
          title="Encaminhados para Trabalho"
          value={list?.filter((item) => item.status === 'ATIVO').length || 0}
          icon={Briefcase}
          color="bg-green-500"
          subtitle="Alunos encaminhados"
          loading={loadingPeopleCompany}
        />
        <StatCard
          title="Avaliações Realizadas"
          value={reviews?.length || 0}
          icon={ClipboardCheck}
          color="bg-purple-500"
          subtitle="Total de avaliações"
          loading={loadingReviews}
        />
        <StatCard
          title="Empresas Parceiras"
          value={companys?.length || 0}
          icon={Award}
          color="bg-orange-500"
          subtitle="Parcerias ativas"
          loading={loadingCompany}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Alunos por Mês */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Alunos por Mês
            </h3>
          </div>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : alunosData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Nenhum dado disponível</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alunosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alunos" fill="#4A90E2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Gráfico de Status dos Encaminhamentos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Status dos Encaminhamentos
            </h3>
          </div>
          {loadingPeopleCompany ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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

      {/* Gráfico de Avaliações e Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Avaliações */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Avaliações por Período
            </h3>
          </div>
          {loadingReviews ? (
            <div className="h-[250px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : avaliacoesData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-gray-500">Nenhuma avaliação registrada</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Resumo de Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Resumo Geral
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alunos Ativos</span>
              <span className="font-semibold text-green-600">
                {isLoading ? "..." : alunosAtivos?.filter((item) => item.ativo === true).length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Encaminhados</span>
              <span className="font-semibold text-blue-600">
                {loadingPeopleCompany ? "..." : list?.filter((item) => item.status === 'ATIVO').length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Avaliações</span>
              <span className="font-semibold text-purple-600">
                {loadingReviews ? "..." : reviews?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">1ª Avaliações</span>
              <span className="font-semibold text-purple-600">
                {loadingReviews ? "..." : primeiraAvaliacoes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">2ª Avaliações</span>
              <span className="font-semibold text-purple-600">
                {loadingReviews ? "..." : segundaAvaliacoes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Parcerias Ativas</span>
              <span className="font-semibold text-green-600">
                {loadingPeopleCompany
                  ? "..."
                  : list?.filter((item) => item.ativo).length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;