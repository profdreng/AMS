import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Clock, Wrench, FolderKanban, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { apiClient } from "../../api/apiClient";
import { Tool, Project } from "../../api/types";

export function Custos() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [toolsData, projectsData] = await Promise.all([
      apiClient.get<Tool[]>("tools/"),
      apiClient.get<Project[]>("projects/"),
    ]);
    if (toolsData) setTools(toolsData);
    if (projectsData) setProjects(projectsData);
    setLoading(false);
  };

  const stats = [
    {
      title: "Total Geral",
      value: "€127,850",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      period: "Estimado (Q1 2026)",
    },
    {
      title: "Ferramentas",
      value: tools.length.toString(),
      change: "+8.3%",
      trend: "up",
      icon: Wrench,
      period: "Em inventário",
    },
    {
      title: "Projetos Ativos",
      value: projects.length.toString(),
      change: "-3.2%",
      trend: "down",
      icon: FolderKanban,
      period: "Sincronizados",
    },
    {
      title: "Custo Médio/Hora",
      value: "€95",
      change: "+2.1%",
      trend: "up",
      icon: Clock,
      period: "Mão de Obra",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-slate-600">A carregar análise de custos...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Controlo de Custos</h1>
              <p className="text-slate-600 text-lg">Análise de custos, tempos e materiais</p>
            </div>
          </div>
          {/* Period selector */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center shadow-sm">
                  <Icon className="w-7 h-7 text-emerald-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600 mb-1 font-medium">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.period}</p>
            </div>
          );
        })}
      </div>

      {/* Tables for projects and tools using real data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
              <FolderKanban className="w-5 h-5 text-green-600" />
              Projetos (Vista Financeira)
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase pb-3">Projeto</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase pb-3">Estado</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase pb-3">Estimativa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.slice(0, 5).map((project: Project) => (
                    <tr key={project.id} className="text-sm">
                      <td className="py-3">
                        <div>
                          <p className="font-semibold text-slate-900">{project.code}</p>
                          <p className="text-xs text-slate-600 truncate max-w-[150px]">{project.description}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right text-slate-900 font-medium">{project.status}</td>
                      <td className="py-3 text-right font-semibold text-slate-900 font-medium">---</td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-slate-500 italic">Sem projetos sincronizados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
              <Wrench className="w-5 h-5 text-blue-600" />
              Ferramentas (Vista de Ativos)
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase pb-3">Ferramenta</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase pb-3">Ativa</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase pb-3">Manutenção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tools.slice(0, 5).map((tool: Tool) => (
                    <tr key={tool.id} className="text-sm">
                      <td className="py-3">
                        <div>
                          <p className="font-semibold text-slate-900">{tool.code}</p>
                          <p className="text-xs text-slate-600 truncate max-w-[150px]">{tool.description}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right font-medium">{tool.active ? "Sim" : "Não"}</td>
                      <td className="py-3 text-right font-semibold text-slate-900 font-medium">---</td>
                    </tr>
                  ))}
                  {tools.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-slate-500 italic">Sem ferramentas registadas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
