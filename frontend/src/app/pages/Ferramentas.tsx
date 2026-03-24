import { useState, useEffect } from "react";
import { Wrench, Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
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
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolTypes, setToolTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filter State
  const [filters, setFilters] = useState({
    code: "",
    description: "",
    tool_type_id: "",
    active: "",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form State
  const [newTool, setNewTool] = useState({
    code: "",
    serial_number: "",
    description: "",
    tool_type_id: 0,
    manufacture_date: "",
    technical_document: "", // Placeholder for doc path
    active: true,
  });

  // Edit Form State
  const [editTool, setEditTool] = useState({
    code: "",
    serial_number: "",
    description: "",
    tool_type_id: 0,
    manufacture_date: "",
    technical_document: "",
    active: true,
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    const [toolsData, typesData] = await Promise.all([
      apiClient.get<Tool[]>("tools/"),
      apiClient.get<any[]>("tool-types/"),
    ]);
    if (toolsData) setTools(toolsData);
    if (typesData) setToolTypes(typesData);
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
        tool_type_id: 0,
        manufacture_date: "",
        technical_document: "",
        active: true,
      });
    }
  };

  const handleView = (tool: Tool) => {
    setSelectedTool(tool);
    setShowViewDialog(true);
  };

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setEditTool({
      code: tool.code || "",
      serial_number: tool.serial_number || "",
      description: tool.description || "",
      tool_type_id: tool.tool_type_id,
      manufacture_date: tool.manufacture_date || "",
      technical_document: tool.technical_document || "",
      active: tool.active,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTool || !editTool.code?.trim() || !editTool.serial_number?.trim()) {
      setErrorMessage("Código e Nº Série são obrigatórios!");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      // Fazer trim() em todos os campos de texto
      const cleanedTool = {
        ...editTool,
        code: editTool.code.trim(),
        serial_number: editTool.serial_number.trim(),
        description: editTool.description?.trim() || "",
        technical_document: editTool.technical_document?.trim() || null,
      };
      
      console.log("Enviando PUT para tools/" + selectedTool.id, cleanedTool);
      
      const result = await apiClient.put(`tools/${selectedTool.id}`, cleanedTool);
      
      console.log("Resultado do PUT:", result);
      
      if (result) {
        console.log("✓ Sucesso ao guardar!");
        setSuccessMessage("✓ Ferramenta atualizada com sucesso!");
        
        // Fecha a janela imediatamente e limpa os states
        setTimeout(() => {
          setShowEditDialog(false);
          setSuccessMessage("");
          setSelectedTool(null);
          setEditTool({
            code: "",
            serial_number: "",
            description: "",
            tool_type_id: 0,
            manufacture_date: "",
            technical_document: "",
            active: true,
          });
          
          // Atualiza a lista DEPOIS de fechar
          fetchTools();
        }, 1000);
      } else {
        console.error("Resultado nulo do servidor");
        setErrorMessage("Erro ao guardar - servidor retornou nulo");
      }
    } catch (error) {
      console.error("Erro ao guardar:", error);
      setErrorMessage(`Erro ao guardar: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tool: Tool) => {
    if (!confirm(`Tem certeza que deseja ELIMINAR a ferramenta ${tool.code}?\n\nEsta ação é irreversível!`)) {
      return;
    }

    try {
      // Tenta eliminar
      const response = await fetch(`http://192.168.0.71:8001/tools/${tool.id}`, {
        method: 'DELETE',
      });

      if (response.status === 404) {
        alert("✗ Ferramenta não encontrada!");
      } else if (response.status === 409) {
        alert("✗ Não é possível eliminar esta ferramenta!\n\nExistem ligações a esta ferramenta (Intervenções, Projetos, etc.)");
      } else if (response.ok) {
        alert("✓ Ferramenta eliminada com sucesso!");
        fetchTools();
      } else {
        const error = await response.json();
        alert(`✗ Erro: ${error.detail}`);
      }
    } catch (error) {
      alert(`✗ Erro ao eliminar: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  };

  // Aplicar filtros
  const getFilteredTools = () => {
    return tools.filter(tool => {
      if (filters.code && !tool.code.toLowerCase().includes(filters.code.toLowerCase())) return false;
      if (filters.description && !tool.description.toLowerCase().includes(filters.description.toLowerCase())) return false;
      if (filters.tool_type_id && tool.tool_type_id.toString() !== filters.tool_type_id) return false;
      if (filters.active !== "" && tool.active.toString() !== filters.active) return false;
      return true;
    });
  };

  const clearFilters = () => {
    setFilters({
      code: "",
      description: "",
      tool_type_id: "",
      active: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.code || filters.description || filters.tool_type_id || filters.active;

  // Paginação
  const filteredTools = getFilteredTools();
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, endIndex);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-slate-600">A carregar inventário de ferramentas...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Dialog - Filter Tools */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filtrar Ferramentas</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="filter-code">Código</Label>
              <Input 
                id="filter-code" 
                placeholder="Pesquisar por código..." 
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="filter-description">Descrição</Label>
              <Input 
                id="filter-description" 
                placeholder="Pesquisar por descrição..." 
                value={filters.description}
                onChange={(e) => setFilters({ ...filters, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-type">Tipo</Label>
              <Select value={filters.tool_type_id} onValueChange={(v) => setFilters({ ...filters, tool_type_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  {toolTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.description || t.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-active">Estado</Label>
              <Select value={filters.active} onValueChange={(v) => setFilters({ ...filters, active: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativa</SelectItem>
                  <SelectItem value="false">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={clearFilters} className="mr-auto">
              Limpar Filtros
            </Button>
            <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
              Fechar
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              onClick={() => setShowFilterDialog(false)}
            >
              Aplicar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog - View Tool Details */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Ferramenta</DialogTitle>
          </DialogHeader>
          {selectedTool && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div>
                <Label className="text-slate-600 text-xs uppercase tracking-wide">Código</Label>
                <p className="text-lg font-semibold text-slate-900 mt-1">{selectedTool.code}</p>
              </div>
              <div>
                <Label className="text-slate-600 text-xs uppercase tracking-wide">Nº Série</Label>
                <p className="text-lg font-semibold text-slate-900 mt-1">{selectedTool.serial_number}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-slate-600 text-xs uppercase tracking-wide">Descrição</Label>
                <p className="text-lg font-semibold text-slate-900 mt-1">{selectedTool.description}</p>
              </div>
              <div>
                <Label className="text-slate-600 text-xs uppercase tracking-wide">Tipo</Label>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {selectedTool.tool_type?.description || selectedTool.tool_type?.code || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-slate-600 text-xs uppercase tracking-wide">Estado</Label>
                <Badge className={selectedTool.active 
                  ? "bg-green-100 text-green-700 hover:bg-green-100 font-medium mt-1" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-100 font-medium mt-1"}>
                  {selectedTool.active ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              <div className="col-span-2">
                <Label className="text-slate-600 text-xs uppercase tracking-wide">Data de Fabrico</Label>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {selectedTool.manufacture_date || "N/A"}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-slate-600 text-xs uppercase tracking-wide">Documento Técnico</Label>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {selectedTool.technical_document || "N/A"}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog - Edit Tool */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ferramenta</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código Único *</Label>
              <Input 
                id="edit-code" 
                value={editTool.code}
                onChange={(e) => setEditTool({ ...editTool, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-serial">Nº Série *</Label>
              <Input 
                id="edit-serial" 
                value={editTool.serial_number}
                onChange={(e) => setEditTool({ ...editTool, serial_number: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-description">Descrição *</Label>
              <Input 
                id="edit-description" 
                value={editTool.description}
                onChange={(e) => setEditTool({ ...editTool, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipo *</Label>
              <Select value={editTool.tool_type_id.toString()} onValueChange={(v) => setEditTool({ ...editTool, tool_type_id: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {toolTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.description || t.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Data de Fabrico *</Label>
              <Input 
                id="edit-date" 
                type="date" 
                value={editTool.manufacture_date}
                onChange={(e) => setEditTool({ ...editTool, manufacture_date: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-doc">Caminho Documento Técnico</Label>
              <Input 
                id="edit-doc" 
                value={editTool.technical_document}
                onChange={(e) => setEditTool({ ...editTool, technical_document: e.target.value })}
              />
            </div>
          </div>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-700 text-sm font-medium">✗ {errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <p className="text-green-700 text-sm font-medium">{successMessage}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-60"
              onClick={handleSaveEdit}
              disabled={saving || !editTool.code || !editTool.serial_number}
            >
              {saving ? "A guardar..." : "Guardar Alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex invisible sm:visible w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/30">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Gestão de Ferramentas</h1>
            <p className="text-slate-600 text-lg">Controlo do ciclo de vida técnico</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Pesquisa e Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar por código..."
                className="pl-10 h-10 rounded-lg border-slate-200"
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value })}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-10 px-3 rounded-lg border-slate-200"
              onClick={() => setShowFilterDialog(true)}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">✓</span>}
            </Button>
          </div>

          {/* Nova Ferramenta */}
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 gap-2 h-12 px-6 rounded-xl shadow-lg shadow-blue-500/30 md:order-last md:flex-shrink-0">
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
                      {toolTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>{t.description || t.code}</SelectItem>
                      ))}
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
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="doc">Caminho Documento Técnico</Label>
                  <Input 
                    id="doc" 
                    placeholder="Ex: /docs/tecnicos/molde_v1.pdf" 
                    value={newTool.technical_document}
                    onChange={(e) => setNewTool({ ...newTool, technical_document: e.target.value })}
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
        <div className="px-3 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-600">
            Página <span className="font-semibold text-slate-900">{currentPage}</span> de <span className="font-semibold text-slate-900">{totalPages || 1}</span> • 
            Mostrando <span className="font-semibold text-slate-900">{paginatedTools.length}</span> de <span className="font-semibold text-slate-900">{filteredTools.length}</span> ferramentas
            {hasActiveFilters && <span className="ml-2 text-blue-600">• Filtros ✓</span>}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Código
                </th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                  Descrição
                </th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                  Tipo
                </th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                  Nº Série
                </th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-2 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {paginatedTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-semibold text-blue-600">{tool.code}</span>
                  </td>
                  <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-medium text-slate-900 hidden md:table-cell">
                    <div className="line-clamp-2">{tool.description}</div>
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-slate-600 hidden lg:table-cell">
                    <Badge variant="outline" className="bg-slate-50">
                      {tool.tool_type?.description || tool.tool_type?.code || "N/A"}
                    </Badge>
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-slate-600 hidden sm:table-cell">
                    {tool.serial_number}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <Badge className={tool.active 
                      ? "bg-green-100 text-green-700 hover:bg-green-100 font-medium text-xs" 
                      : "bg-slate-100 text-slate-700 hover:bg-slate-100 font-medium text-xs"}>
                      {tool.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-blue-100 hover:text-blue-600 text-slate-600 transition-colors p-1 sm:p-2"
                        onClick={() => handleView(tool)}
                        title="Ver detalhes"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-amber-100 hover:text-amber-600 text-slate-600 transition-colors p-1 sm:p-2"
                        onClick={() => handleEdit(tool)}
                        title="Editar ferramenta"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors p-1 sm:p-2"
                        onClick={() => handleDelete(tool)}
                        title="Eliminar ferramenta"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3"
              >
                ← Anterior
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Mostrar: primeira página, última página, página atual, e ±1 em torno da atual
                  const isVisible = 
                    page === 1 ||
                    page === totalPages ||
                    page === currentPage ||
                    Math.abs(page - currentPage) <= 1;

                  if (!isVisible && page !== 2 && page !== totalPages - 1) {
                    return null;
                  }

                  if (!isVisible) {
                    return page === 2 ? (
                      <span key="dots-start" className="px-2 text-slate-600">...</span>
                    ) : (
                      <span key="dots-end" className="px-2 text-slate-600">...</span>
                    );
                  }

                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? "bg-blue-600 text-white" : "px-2 sm:px-3"}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3"
              >
                Próxima →
              </Button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600">
              Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
