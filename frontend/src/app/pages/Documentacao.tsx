import { useState } from "react";
import { FileText, Plus, Search, Filter, Eye, Download, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function Documentacao() {
  const [showNewDialog, setShowNewDialog] = useState(false);

  const documents = [
    {
      code: "DOC-TOOL-A123-001",
      title: "Desenho Técnico - Molde A500",
      entityType: "TOOL",
      entityCode: "TOOL-A-123",
      revision: 3,
      uploadDate: "2026-03-10",
      approvedBy: "João Silva",
      approvalDate: "2026-03-12",
      type: "Desenho Técnico",
    },
    {
      code: "DOC-PRJ-001-002",
      title: "Especificação Projeto Molde A-500",
      entityType: "PROJECT",
      entityCode: "PRJ-2026-001",
      revision: 2,
      uploadDate: "2026-01-20",
      approvedBy: "Maria Santos",
      approvalDate: "2026-01-22",
      type: "Especificação",
    },
    {
      code: "DOC-INT-045-001",
      title: "Relatório de Manutenção Preventiva",
      entityType: "INTERVENTION",
      entityCode: "INT-2026-045",
      revision: 1,
      uploadDate: "2026-03-16",
      approvedBy: null,
      approvalDate: null,
      type: "Relatório",
    },
    {
      code: "DOC-TOOL-B456-003",
      title: "Manual de Operação - Matriz B200",
      entityType: "TOOL",
      entityCode: "TOOL-B-456",
      revision: 1,
      uploadDate: "2026-02-05",
      approvedBy: "Pedro Costa",
      approvalDate: "2026-02-08",
      type: "Manual",
    },
  ];

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#0066A1] rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documentação Técnica</h1>
            <p className="text-gray-600">Gestão de documentação versionada</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900">
            Documentos podem ser associados a <strong>Ferramentas</strong>, <strong>Projetos</strong> ou <strong>Intervenções</strong> com controlo de versão e aprovação.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Pesquisar por código, título ou entidade..."
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
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Documento</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="docCode">Código do Documento *</Label>
                  <Input id="docCode" placeholder="DOC-XXX-YYY-ZZZ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="docType">Tipo de Documento *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desenho">Desenho Técnico</SelectItem>
                      <SelectItem value="especificacao">Especificação</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="relatorio">Relatório</SelectItem>
                      <SelectItem value="procedimento">Procedimento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" placeholder="Título descritivo do documento" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entityType">Associar a *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de entidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tool">Ferramenta (TOOL)</SelectItem>
                      <SelectItem value="project">Projeto (PROJECT)</SelectItem>
                      <SelectItem value="intervention">Intervenção (INTERVENTION)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entityCode">Código da Entidade *</Label>
                  <Input id="entityCode" placeholder="TOOL-XXX ou PRJ-XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revision">Nº Revisão *</Label>
                  <Input id="revision" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Ficheiro *</Label>
                  <Input id="file" type="file" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#0066A1] hover:bg-[#005080]">
                  Adicionar Documento
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
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revisão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Upload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aprovação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#0066A1]">{doc.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <Badge className={getEntityBadgeColor(doc.entityType)}>
                        {doc.entityType}
                      </Badge>
                      <span className="text-xs text-gray-500">{doc.entityCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rev. {doc.revision}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.approvedBy ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div className="text-xs">
                          <p className="text-gray-900 font-medium">{doc.approvedBy}</p>
                          <p className="text-gray-500">{doc.approvalDate}</p>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pendente
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
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
