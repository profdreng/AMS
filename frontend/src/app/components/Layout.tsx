import { Outlet, Link, useLocation } from "react-router";
import { Wrench, FolderKanban, Settings, FileText, DollarSign, LayoutDashboard, LogOut, User } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/ferramentas", label: "Ferramentas", icon: Wrench },
    { path: "/projetos", label: "Projetos", icon: FolderKanban },
    { path: "/intervencoes", label: "Intervenções", icon: Settings },
    { path: "/documentacao", label: "Documentação", icon: FileText },
    { path: "/custos", label: "Custos", icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#0066A1]">ToolManager</h1>
          <p className="text-sm text-gray-500">Sistema de Gestão</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-[#0066A1] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#0066A1] rounded-full flex items-center justify-center text-white font-medium">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 w-full px-2 py-1">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
