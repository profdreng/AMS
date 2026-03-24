import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Wrench, FolderKanban, Settings, FileText, DollarSign, LayoutDashboard, LogOut, User, ChevronRight, Menu, X } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className={`hidden sm:flex sm:flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl border-r border-slate-800/50 transition-all duration-300 ${
        sidebarOpen ? "sm:w-72" : "sm:w-20"
      }`}>
        {/* Logo Section */}
        <div className={`p-6 border-b border-slate-800/50 flex items-center ${!sidebarOpen && "justify-center"}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/40 flex-shrink-0">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-white tracking-tight leading-tight">ToolManager</h1>
                <p className="text-xs text-slate-400 font-medium">Gestão de Ativos</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/40"
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? "text-blue-200" : "text-slate-500 group-hover:text-slate-300"}`} />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </div>
                  {active && sidebarOpen && (
                    <>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 mx-3" />

        {/* User Profile */}
        <div className="p-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-700/50 hover:border-slate-600/50 transition-colors ${!sidebarOpen && "justify-center"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-slate-500 font-medium">Administrador</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="flex items-center gap-3 text-sm text-slate-400 hover:text-slate-200 w-full px-4 py-3 rounded-lg hover:bg-slate-800/40 transition-all duration-200 mt-2 font-medium">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sair
            </button>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden sm:flex items-center justify-center p-4 text-slate-400 hover:text-white transition-colors border-t border-slate-800/50 w-full"
          title={sidebarOpen ? "Minimizar" : "Expandir"}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </aside>


      {/* Mobile Menu Button - Flutuante */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="sm:hidden fixed top-6 left-6 z-50 p-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-2xl shadow-blue-600/50 transition-all duration-200 transform hover:scale-110 active:scale-95"
          title="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Sidebar - Overlay */}
      {sidebarOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Side Panel */}
      <aside className={`sm:hidden fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl border-r border-slate-800/50 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800/50">
          <h1 className="text-lg font-bold text-white tracking-tight leading-tight">ToolManager</h1>
          <p className="text-xs text-slate-400 font-medium">Gestão de Ativos</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? "text-blue-200" : "text-slate-500 group-hover:text-slate-300"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {active && (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 mx-3" />

        {/* User Profile */}
        <div className="p-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-700/50">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-slate-500 font-medium">Administrador</p>
          </div>
          <button className="flex items-center gap-3 text-sm text-slate-400 hover:text-slate-200 w-full px-4 py-3 rounded-lg hover:bg-slate-800/40 transition-all duration-200 mt-2 font-medium">
            <LogOut className="w-4 h-4 flex-shrink-0" />
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
