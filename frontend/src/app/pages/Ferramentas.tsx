import { useState } from "react";
import { Wrench, Plus, Search, Filter, Eye, Edit, Archive } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function Ferramentas() {
  const [showNewDialog, setShowNewDialog] = useState(false);

  const tools = [
    {
      code: "TOOL-A-123",
      description: "Molde Injeção A500",
      serialNumber: "SN-2024-001",
      type: "Molde",
      manufactureDate: "2024-01-15",
      active: true,
      currentOwner: "Cliente ABC",
      currentProject: "PRJ-2026-001",
      interventionsOpen: 1,
    },
    {
      code: "TOOL-B-456",
      description: "Matriz Estampagem B200",
      serialNumber: "SN-2024-002",
      type: "Matriz",
      manufactureDate: "2024-02-20",
      active: true,
      currentOwner: "Cliente XYZ",
      currentProject: "PRJ-2026-002",
      interventionsOpen: 0,
    },
    {
      code: "TOOL-C-789",
      description: "Punção CNC C100",
      serialNumber: "SN-2023-045",
      type: "Punção",
      manufactureDate: "2023-11-10",
      active: true,
      currentOwner: "Stock Interno",
      currentProject: null,
      interventionsOpen: 2,
    },
    {
      code: "TOOL-D-321",
      description: "Ferramenta EDM D350",
      serialNumber: "SN-2025-012",
      type: "EDM",
      manufactureDate: "2025-03-05",
      active: false,
      currentOwner: "Cliente DEF",
      currentProject: null,
      interventionsOpen: 0,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#0066A1] rounded-2xl flex items-center justify-center">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Ferramentas</h1>
            <p className="text-gray-600">Controlo do ciclo de vida técnico</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Pesquisar por código, descrição ou nº série..."
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
                Nova Ferramenta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Ferramenta</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código Único *</Label>
                  <Input id="code" placeholder="TOOL-XXX-XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial">Nº Série *</Label>
                  <Input id="serial" placeholder="SN-YYYY-XXX" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input id="description" placeholder="Descrição da ferramenta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="molde">Molde</SelectItem>
                      <SelectItem value="matriz">Matriz</SelectItem>
                      <SelectItem value="puncao">Punção</SelectItem>
                      <SelectItem value="edm">EDM</SelectItem>
                      <SelectItem value="cnc">CNC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufactureDate">Data de Fabrico *</Label>
                  <Input id="manufactureDate" type="date" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#0066A1] hover:bg-[#005080]">
                  Criar Ferramenta
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
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Série
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proprietário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projeto Atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tools.map((tool, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#0066A1]">{tool.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tool.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tool.serialNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {tool.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tool.currentOwner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tool.currentProject || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge className={tool.active 
                        ? "bg-green-100 text-green-700 hover:bg-green-100" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
                        {tool.active ? "Ativa" : "Inativa"}
                      </Badge>
                      {tool.interventionsOpen > 0 && (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                          {tool.interventionsOpen} Int.
                        </Badge>
                      )}
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
                      <Button variant="ghost" size="sm">
                        <Archive className="w-4 h-4" />
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
