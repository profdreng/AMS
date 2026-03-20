import { useState, useEffect } from "react";
import { FileText, Plus, Search, Filter, Eye, Download, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { apiClient } from "../../api/apiClient";
import { Tool, Project, Intervention } from "../../api/types";

export function Documentacao() {
  const [showNewDialog, setShowNewDialog] = useState(false);
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

  const getEntityBadgeColor = (type: string) => {
    switch (type) {
      case "TOOL":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "PROJECT":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "INTERVENTION":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-slate-600">A carregar gestão documental...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header same as before */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Documentação Técnica</h1>
            <p className="text-slate-600 text-lg">Gestão de documentação versionada</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-purple-900">
            A carregar contexto de {tools.length} Ferramentas e {projects.length} Projetos para tagging documental.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Pesquisar por código, título ou entidade..."
              className="pl-12 h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 gap-2 h-12 px-6 rounded-xl shadow-lg shadow-purple-500/30">
                <Plus className="w-4 h-4" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              {/* Document upload form, can use real entities in selects if needed */}
              <DialogHeader>
                <DialogTitle>Adicionar Novo Documento</DialogTitle>
              </DialogHeader>
              <div className="p-4 italic text-slate-500">
                Funcionalidade de upload em desenvolvimento. Contexto de entidades carregado.
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Repositório Documental</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          A integração com o repositório de ficheiros está a ser configurada. 
          O sistema já possui acesso a <strong>{tools.length}</strong> ferramentas e <strong>{projects.length}</strong> projetos para associação imediata.
        </p>
      </div>
    </div>
  );
}
