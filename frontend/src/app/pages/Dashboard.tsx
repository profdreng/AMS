import { useState, useEffect } from "react";
import { Wrench, FolderKanban, Settings, AlertCircle, Activity } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { apiClient } from "../../api/apiClient";
import { Tool, Project, Intervention } from "../../api/types";

export function Dashboard() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [toolsData, projectsData, intervData] = await Promise.all([
      apiClient.get<Tool[]>("tools/"),
      apiClient.get<Project[]>("projects/"),
      apiClient.get<Intervention[]>("interventions/"),
    ]);

    if (toolsData) setTools(toolsData);
    if (projectsData) setProjects(projectsData);
    if (intervData) setInterventions(intervData);
    setLoading(false);
  };

  const stats = [
    {
      title: "Ferramentas Ativas",
      value: tools.filter(t => t.active).length.toString(),
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: `${tools.length} totais`,
    },
    {
      title: "Projetos em Curso",
      value: projects.length.toString(),
      icon: FolderKanban,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "Sincronizados",
    },
    {
      title: "Intervenções Abertas",
      value: interventions.filter(i => i.status === "Aberta").length.toString(),
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "Requerem atenção",
    },
    {
      title: "Total Intervenções",
      value: interventions.length.toString(),
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "Histórico completo",
    },
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Em curso":
      case "Em execução":
      case "Sincronizado":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Planeado":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "Aberta":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Concluída":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-slate-600">A carregar visão geral do sistema...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 text-lg">Visão geral do sistema de gestão de ferramentas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <Activity className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600 mb-2 font-medium">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              Projetos Recentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{project.code}</p>
                      <p className="text-sm text-slate-600 truncate max-w-xs">{project.description}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === "Sincronizado" ? "Ativo" : project.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-sm text-slate-500 italic">Sem projetos sincronizados.</p>}
            </div>
          </div>
        </div>

        {/* Recent Interventions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
              <Settings className="w-5 h-5 text-orange-600" />
              Intervenções Recentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {interventions.slice(0, 5).map((intervention) => (
                <div key={intervention.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">INT-#{intervention.id}</p>
                      <p className="text-sm text-slate-600">{intervention.intervention_type}</p>
                    </div>
                    <Badge className={getStatusColor(intervention.status)}>
                      {intervention.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{intervention.responsible}</span>
                    <span>{new Date(intervention.opened_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {interventions.length === 0 && <p className="text-sm text-slate-500 italic">Sem intervenções registadas.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
