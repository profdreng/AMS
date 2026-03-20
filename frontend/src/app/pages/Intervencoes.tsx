import { useState, useEffect } from "react";
import { Settings, Plus, Search, Filter, Eye, Edit, Clock, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { apiClient } from "../../api/apiClient";
import { Intervention, Tool } from "../../api/types";
import { format } from "date-fns";

export function Intervencoes() {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newIntervention, setNewIntervention] = useState({
    tool_id: "",
    intervention_type: "Manutenção Preventiva",
    status: "Aberta",
    location: "",
    responsible: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [intervData, toolsData] = await Promise.all([
      apiClient.get<Intervention[]>("interventions/"),
      apiClient.get<Tool[]>("tools/"),
    ]);

    if (intervData) setInterventions(intervData);
    if (toolsData) setTools(toolsData);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newIntervention.tool_id) return;

    const result = await apiClient.post("interventions/", {
      ...newIntervention,
      tool_id: parseInt(newIntervention.tool_id),
    });

    if (result) {
      setShowNewDialog(false);
      fetchData();
      // Reset form
      setNewIntervention({
        tool_id: "",
        intervention_type: "Manutenção Preventiva",
        status: "Aberta",
        location: "",
        responsible: "",
        description: "",
      });
    }
  };

  const getToolInfo = (toolId: number) => {
    const tool = tools.find((t) => t.id === toolId);
    return tool ? { code: tool.code, desc: tool.description } : { code: "N/A", desc: "Ferramenta não encontrada" };
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Em execução":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Aberta":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Concluída":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-slate-600">A carregar dados das intervenções...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Gestão de Intervenções</h1>
            <p className="text-slate-600 text-lg">Manutenção, reparações e calibrações</p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-900">Atenção: Limite de intervenções</p>
            <p className="text-sm text-orange-700">Apenas 1 intervenção pode estar aberta por ferramenta</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Pesquisar por código, ferramenta ou tipo..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl border-slate-200 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 gap-2 h-12 px-6 rounded-xl shadow-lg shadow-orange-500/30">
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
                  <Label htmlFor="tool">Ferramenta *</Label>
                  <Select onValueChange={(v) => setNewIntervention({ ...newIntervention, tool_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ferramenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {tools.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.code} - {t.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intType">Tipo de Intervenção *</Label>
                  <Select 
                    defaultValue="Manutenção Preventiva"
                    onValueChange={(v) => setNewIntervention({ ...newIntervention, intervention_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manutenção Preventiva">Manutenção Preventiva</SelectItem>
                      <SelectItem value="Manutenção Corretiva">Manutenção Corretiva</SelectItem>
                      <SelectItem value="Reparação">Reparação</SelectItem>
                      <SelectItem value="Calibração">Calibração</SelectItem>
                      <SelectItem value="Upgrade">Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsável *</Label>
                  <Input 
                    id="responsible" 
                    placeholder="Nome do técnico" 
                    value={newIntervention.responsible}
                    onChange={(e) => setNewIntervention({ ...newIntervention, responsible: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input 
                    id="location" 
                    placeholder="Ex: Secção A" 
                    value={newIntervention.location}
                    onChange={(e) => setNewIntervention({ ...newIntervention, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descrição da intervenção..." 
                    rows={3} 
                    value={newIntervention.description}
                    onChange={(e) => setNewIntervention({ ...newIntervention, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
                  onClick={handleCreate}
                >
                  Criar Intervenção
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
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ferramenta
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Data Abertura
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {interventions.map((intervention) => {
                const toolInfo = getToolInfo(intervention.tool_id);
                return (
                  <tr key={intervention.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-orange-600">#{intervention.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{toolInfo.code}</p>
                        <p className="text-xs text-slate-600">{toolInfo.desc}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                      {intervention.intervention_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(intervention.status)}>
                        {intervention.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <div>{format(new Date(intervention.opened_at), "dd/MM/yyyy HH:mm")}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      {intervention.responsible || "Não atribuído"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
