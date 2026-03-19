import { useState } from "react";
import { FolderKanban, Plus, Search, Filter, Eye, Edit, Clock, Snowflake } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function Projetos() {
  const [showNewDialog, setShowNewDialog] = useState(false);

  const projects = [
    {
      code: "PRJ-2026-001",
      name: "Ferramenta Molde A-500",
      status: "Em curso",
      tools: 3,
      plannedStart: "2026-01-15",
      plannedEnd: "2026-04-30",
      actualStart: "2026-01-18",
      actualEnd: null,
      progress: 75,
      frozenTools: 0,
    },
    {
      code: "PRJ-2026-002",
      name: "Manutenção Geral Q1",
      status: "Planeado",
      tools: 8,
      plannedStart: "2026-04-01",
      plannedEnd: "2026-06-30",
      actualStart: null,
      actualEnd: null,
      progress: 0,
      frozenTools: 0,
    },
    {
      code: "PRJ-2026-003",
      name: "Upgrade Sistema CNC",
      status: "Em curso",
      tools: 2,
      plannedStart: "2026-02-01",
      plannedEnd: "2026-05-15",
      actualStart: "2026-02-05",
      actualEnd: null,
      progress: 45,
      frozenTools: 1,
    },
    {
      code: "PRJ-2025-089",
      name: "Retrofit Matriz B-200",
      status: "Fechado",
      tools: 1,
      plannedStart: "2025-11-01",
      plannedEnd: "2025-12-31",
      actualStart: "2025-11-05",
      actualEnd: "2025-12-28",
      progress: 100,
      frozenTools: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em curso":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Planeado":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "Fechado":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#0066A1] rounded-2xl flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Projetos</h1>
            <p className="text-gray-600">Criação, alteração e controlo de projetos</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Pesquisar por código ou nome do projeto..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#0066A1] hover:bg-[#005080] gap-2">
                <Plus className="w-4 h-4" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="projectCode">Código Único *</Label>
                  <Input id="projectCode" placeholder="PRJ-YYYY-XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planeado">Planeado</SelectItem>
                      <SelectItem value="em-curso">Em curso</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="projectName">Nome do Projeto *</Label>
                  <Input id="projectName" placeholder="Nome descritivo do projeto" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plannedStart">Data Início Planeada *</Label>
                  <Input id="plannedStart" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plannedEnd">Data Fim Planeada *</Label>
                  <Input id="plannedEnd" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualStart">Data Início Real</Label>
                  <Input id="actualStart" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualEnd">Data Fim Real</Label>
                  <Input id="actualEnd" type="date" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#0066A1] hover:bg-[#005080]">
                  Criar Projeto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Projeto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ferramentas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datas Planeadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datas Reais
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#0066A1]">{project.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{project.tools}</span>
                      {project.frozenTools > 0 && (
                        <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 gap-1">
                          <Snowflake className="w-3 h-3" />
                          {project.frozenTools}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.plannedStart} → {project.plannedEnd}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.actualStart || "-"} → {project.actualEnd || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0066A1] rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
