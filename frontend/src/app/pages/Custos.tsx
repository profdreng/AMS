import { DollarSign, TrendingUp, TrendingDown, Clock, Wrench, FolderKanban, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function Custos() {
  const stats = [
    {
      title: "Total Geral",
      value: "€127,850",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      period: "Este trimestre",
    },
    {
      title: "Intervenções Ativas",
      value: "€15,600",
      change: "+8.3%",
      trend: "up",
      icon: Settings,
      period: "Este mês",
    },
    {
      title: "Por Projeto",
      value: "€89,200",
      change: "-3.2%",
      trend: "down",
      icon: FolderKanban,
      period: "Este trimestre",
    },
    {
      title: "Média/Hora",
      value: "€95",
      change: "+2.1%",
      trend: "up",
      icon: Clock,
      period: "Este mês",
    },
  ];

  const costsByTool = [
    {
      tool: "TOOL-A-123",
      description: "Molde Injeção A500",
      interventions: 3,
      totalHours: 72,
      laborCost: 6840,
      materialCost: 2450,
      totalCost: 9290,
    },
    {
      tool: "TOOL-B-456",
      description: "Matriz Estampagem B200",
      interventions: 2,
      totalHours: 48,
      laborCost: 4560,
      materialCost: 1890,
      totalCost: 6450,
    },
    {
      tool: "TOOL-C-789",
      description: "Punção CNC C100",
      interventions: 5,
      totalHours: 120,
      laborCost: 11400,
      materialCost: 3200,
      totalCost: 14600,
    },
  ];

  const costsByProject = [
    {
      project: "PRJ-2026-001",
      name: "Ferramenta Molde A-500",
      tools: 3,
      interventions: 8,
      totalHours: 240,
      totalCost: 28500,
      status: "Em curso",
    },
    {
      project: "PRJ-2026-002",
      name: "Manutenção Geral Q1",
      tools: 8,
      interventions: 12,
      totalHours: 380,
      totalCost: 42300,
      status: "Em curso",
    },
    {
      project: "PRJ-2025-089",
      name: "Retrofit Matriz B-200",
      tools: 1,
      interventions: 3,
      totalHours: 96,
      totalCost: 12400,
      status: "Fechado",
    },
  ];

  const resourceTypes = [
    { type: "MO - Mão de Obra", hours: 856, avgRate: 95, totalCost: 81320 },
    { type: "CNC - Centro Usinagem", hours: 124, avgRate: 120, totalCost: 14880 },
    { type: "EDM - Eletroerosão", hours: 68, avgRate: 140, totalCost: 9520 },
    { type: "RAW_MATERIAL - Materiais", hours: null, avgRate: null, totalCost: 15600 },
    { type: "ACCESSORY - Acessórios", hours: null, avgRate: null, totalCost: 6530 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0066A1] rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Controlo de Custos</h1>
              <p className="text-gray-600">Análise de custos, tempos e materiais</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="q1-2026">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2026">Q1 2026</SelectItem>
                <SelectItem value="q4-2025">Q4 2025</SelectItem>
                <SelectItem value="q3-2025">Q3 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#0066A1]" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.period}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Costs by Tool */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Custos por Ferramenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">Ferramenta</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Int.</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Horas</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {costsByTool.map((item, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.tool}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right text-gray-900">{item.interventions}</td>
                      <td className="py-3 text-right text-gray-900">{item.totalHours}h</td>
                      <td className="py-3 text-right font-medium text-gray-900">
                        €{item.totalCost.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Costs by Project */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5" />
              Custos por Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">Projeto</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Tools</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Horas</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {costsByProject.map((item, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.project}</p>
                          <p className="text-xs text-gray-500">{item.name}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right text-gray-900">{item.tools}</td>
                      <td className="py-3 text-right text-gray-900">{item.totalHours}h</td>
                      <td className="py-3 text-right font-medium text-gray-900">
                        €{item.totalCost.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Custos por Tipo de Recurso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo de Recurso
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Horas Totais
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Taxa Média
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Custo Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    % Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resourceTypes.map((resource, index) => {
                  const percentage = ((resource.totalCost / 127850) * 100).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {resource.type}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">
                        {resource.hours ? `${resource.hours}h` : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">
                        {resource.avgRate ? `€${resource.avgRate}` : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                        €{resource.totalCost.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-gray-600">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-4 py-4 text-sm font-bold text-gray-900">
                    TOTAL
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                    1,048h
                  </td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                    €127,850
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                    100%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
