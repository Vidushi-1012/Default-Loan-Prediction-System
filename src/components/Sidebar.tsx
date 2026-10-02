import React from 'react';
import { LayoutDashboard, FileText, Cpu, BarChart3, Settings, ShieldCheck, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

export type NavRoute = 'dashboard' | 'applications' | 'predict' | 'analytics' | 'models' | 'monitoring' | 'settings';

interface SidebarProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: UserProfile;
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: Array<{ key: NavRoute; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { key: 'applications', label: 'Applications', icon: FileText },
  { key: 'predict', label: 'Assess Risk', icon: Cpu },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'models', label: 'Models', icon: ShieldCheck },
  { key: 'monitoring', label: 'Monitoring', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onRouteChange, isCollapsed, onToggleCollapse, user, onLogout, isMobileOpen, onMobileClose }) => {
  const sidebarContent = (
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-[#0B0F19]/95 ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-200 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">LG</div>
          {!isCollapsed && <div className="min-w-0"><div className="truncate text-sm font-bold text-slate-900 dark:text-white">LoanGuard</div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Risk Console</div></div>}
        </div>
        <button type="button" onClick={onToggleCollapse} className="hidden rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:flex">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3">
        <nav className="space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = currentRoute === key;
            return (
              <button key={key} type="button" onClick={() => { onRouteChange(key); onMobileClose(); }} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">{user.name.slice(0, 2).toUpperCase()}</div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">{user.role}</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button type="button" onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return <>{sidebarContent}</>;
};
