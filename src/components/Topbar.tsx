import React from 'react';
import { Bell, Menu, Settings } from 'lucide-react';
import { UserProfile } from '../types';

interface TopbarProps {
  pageTitle: string;
  breadcrumb: string;
  user: UserProfile;
  onOpenMobileMenu: () => void;
  onNavigateSettings: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ pageTitle, breadcrumb, user, onOpenMobileMenu, onNavigateSettings }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-[#0B0F19]/80">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onOpenMobileMenu} className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden">
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{breadcrumb}</div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <button type="button" onClick={onNavigateSettings} className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:flex dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">{user.name.slice(0, 2).toUpperCase()}</div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{user.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
