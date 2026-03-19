import { Wrench, FolderKanban, Settings, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export function Dashboard() {
  const stats = [
    {
      title: "Ferramentas Ativas",
      value: "124",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+5 este mês",
    },
    {
      title: "Projetos em Curso",
      value: "18",
      icon: FolderKanban,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "3 próximos do prazo",
    },
    {
      title: "Intervenções Abertas",
      value: "7",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "2 urgentes",
    },
    {
      title: "Documentos Pendentes",
      value: "12",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "Requerem aprovação",
    },
  ];

  const recentProjects = [
    {
      code: "PRJ-2026-001",
      name: "Ferramenta Molde A-500",
      status: "Em curso",
      tools: 3,
      progress: 75,
    },
    {
      code: "PRJ-2026-002",
      name: "Manutenção Geral Q1",
      status: "Planeado",
      tools: 8,
      progress: 20,
    },
    {
      code: "PRJ-2026-003",
      name: "Upgrade Sistema CNC",
      status: "Em curso",
      tools: 2,
      progress: 45,
    },
  ];

  const recentInterventions = [
    {
      code: "INT-2026-045",
      tool: "TOOL-A-123",
      type: "Manutenção Preventiva",
      status: "Em execução",
      date: "2026-03-15",
    },
    {
      code: "INT-2026-046",
      tool: "TOOL-B-456",
      type: "Reparação",
      status: "Aberta",
      date: "2026-03-16",
    },
    {
      code: "INT-2026-047",
      tool: "TOOL-C-789",
      type: "Calibração",
      status: "Aberta",
      date: "2026-03-17",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em curso":
      case "Em execução":
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão de ferramentas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Activity className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5" />
              Projetos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{project.code}</p>
                      <p className="text-sm text-gray-600">{project.name}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.tools} ferramentas</span>
                    <span className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0066A1] rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs">{project.progress}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Interventions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Intervenções Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInterventions.map((intervention, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{intervention.code}</p>
                      <p className="text-sm text-gray-600">{intervention.tool}</p>
                    </div>
                    <Badge className={getStatusColor(intervention.status)}>
                      {intervention.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{intervention.type}</span>
                    <span>{intervention.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
