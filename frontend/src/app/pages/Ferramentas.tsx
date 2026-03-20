import { useState, useEffect } from "react";
import { Wrench, Plus, Search, Filter, Eye, Edit, Archive } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { apiClient } from "../../api/apiClient";
import { Tool } from "../../api/types";

export function Ferramentas() {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newTool, setNewTool] = useState({
    code: "",
    serial_number: "",
    description: "",
    tool_type_id: 1, // Default to 1
    manufacture_date: "",
    active: true,
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    const data = await apiClient.get<Tool[]>("tools/");
    if (data) setTools(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newTool.code || !newTool.serial_number) return;

    const result = await apiClient.post("tools/", newTool);
    if (result) {
      setShowNewDialog(false);
      fetchTools();
      // Reset form
      setNewTool({
        code: "",
        serial_number: "",
        description: "",
        tool_type_id: 1,
        manufacture_date: "",
        active: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-slate-600">A carregar inventário de ferramentas...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Gestão de Ferramentas</h1>
            <p className="text-slate-600 text-lg">Controlo do ciclo de vida técnico</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Pesquisar por código, descrição ou nº série..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl border-slate-200 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 gap-2 h-12 px-6 rounded-xl shadow-lg shadow-blue-500/30">
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
                  <Input 
                    id="code" 
                    placeholder="TOOL-XXX-XXX" 
                    value={newTool.code}
                    onChange={(e) => setNewTool({ ...newTool, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial">Nº Série *</Label>
                  <Input 
                    id="serial" 
                    placeholder="SN-YYYY-XXX" 
                    value={newTool.serial_number}
                    onChange={(e) => setNewTool({ ...newTool, serial_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input 
                    id="description" 
                    placeholder="Descrição da ferramenta" 
                    value={newTool.description}
                    onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select onValueChange={(v) => setNewTool({ ...newTool, tool_type_id: parseInt(v) })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Molde</SelectItem>
                      <SelectItem value="2">Matriz</SelectItem>
                      <SelectItem value="3">Punção</SelectItem>
                      <SelectItem value="4">EDM</SelectItem>
                      <SelectItem value="5">CNC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufactureDate">Data de Fabrico *</Label>
                  <Input 
                    id="manufactureDate" 
                    type="date" 
                    value={newTool.manufacture_date}
                    onChange={(e) => setNewTool({ ...newTool, manufacture_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  onClick={handleCreate}
                >
                  Criar Ferramenta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Nº Série
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600">{tool.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {tool.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {tool.serial_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={tool.active 
                      ? "bg-green-100 text-green-700 hover:bg-green-100 font-medium" 
                      : "bg-slate-100 text-slate-700 hover:bg-slate-100 font-medium"}>
                      {tool.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-100">
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
