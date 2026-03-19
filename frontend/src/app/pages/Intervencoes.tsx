import { useState } from "react";
import { Settings, Plus, Search, Filter, Eye, Edit, Clock, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

export function Intervencoes() {
  const [showNewDialog, setShowNewDialog] = useState(false);

  const interventions = [
    {
      code: "INT-2026-045",
      tool: "TOOL-A-123",
      toolDescription: "Molde Injeção A500",
      type: "Manutenção Preventiva",
      status: "Em execução",
      startDate: "2026-03-15",
      plannedEnd: "2026-03-20",
      resources: 3,
      totalHours: 24,
      totalCost: 2400,
      problems: 0,
    },
    {
      code: "INT-2026-046",
      tool: "TOOL-B-456",
      toolDescription: "Matriz Estampagem B200",
      type: "Reparação",
      status: "Aberta",
      startDate: null,
      plannedEnd: "2026-03-25",
      resources: 0,
      totalHours: 0,
      totalCost: 0,
      problems: 1,
    },
    {
      code: "INT-2026-047",
      tool: "TOOL-C-789",
      toolDescription: "Punção CNC C100",
      type: "Calibração",
      status: "Aberta",
      startDate: null,
      plannedEnd: "2026-03-22",
      resources: 0,
      totalHours: 0,
      totalCost: 0,
      problems: 2,
    },
    {
      code: "INT-2026-044",
      tool: "TOOL-D-321",
      toolDescription: "Ferramenta EDM D350",
      type: "Upgrade",
      status: "Concluída",
      startDate: "2026-03-01",
      plannedEnd: "2026-03-10",
      resources: 5,
      totalHours: 48,
      totalCost: 5200,
      problems: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em execução":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#0066A1] rounded-2xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Intervenções</h1>
            <p className="text-gray-600">Manutenção, reparações e calibrações</p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-900">Atenção: Limite de intervenções</p>
            <p className="text-sm text-orange-700">Apenas 1 intervenção pode estar aberta por ferramenta</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Pesquisar por código, ferramenta ou tipo..."
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
                Nova Intervenção
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Intervenção</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="intCode">Código *</Label>
                  <Input id="intCode" placeholder="INT-YYYY-XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tool">Ferramenta *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ferramenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tool-a-123">TOOL-A-123 - Molde Injeção A500</SelectItem>
                      <SelectItem value="tool-b-456">TOOL-B-456 - Matriz Estampagem B200</SelectItem>
                      <SelectItem value="tool-c-789">TOOL-C-789 - Punção CNC C100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intType">Tipo de Intervenção *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventiva">Manutenção Preventiva</SelectItem>
                      <SelectItem value="corretiva">Manutenção Corretiva</SelectItem>
                      <SelectItem value="reparacao">Reparação</SelectItem>
                      <SelectItem value="calibracao">Calibração</SelectItem>
                      <SelectItem value="upgrade">Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intStatus">Estado *</Label>
                  <Select defaultValue="aberta">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberta">Aberta</SelectItem>
                      <SelectItem value="em-execucao">Em execução</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plannedEndDate">Data Fim Planeada</Label>
                  <Input id="plannedEndDate" type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" placeholder="Descrição da intervenção..." rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#0066A1] hover:bg-[#005080]">
                  Criar Intervenção
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
                  Ferramenta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recursos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interventions.map((intervention, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#0066A1]">{intervention.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{intervention.tool}</p>
                      <p className="text-xs text-gray-500">{intervention.toolDescription}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {intervention.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(intervention.status)}>
                      {intervention.status}
                    </Badge>
                    {intervention.problems > 0 && (
                      <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100">
                        {intervention.problems} Problema{intervention.problems > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <div>
                        {intervention.startDate ? (
                          <>
                            <div>{intervention.startDate}</div>
                            <div className="text-xs">→ {intervention.plannedEnd}</div>
                          </>
                        ) : (
                          <div>Até {intervention.plannedEnd}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {intervention.resources}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {intervention.totalHours}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{intervention.totalCost.toLocaleString()}
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
