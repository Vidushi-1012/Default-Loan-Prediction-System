import { LoanApplication } from '../types';
import { INITIAL_APPLICATIONS } from '../data/mockData';

const STORAGE_KEY = 'loan-guard-applications';

const readApplications = (): LoanApplication[] => {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LoanApplication[]) : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
};

const writeApplications = (apps: LoanApplication[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }
};

export const applicationService = {
  async getApplications(): Promise<LoanApplication[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return readApplications();
  },

  async getApplication(id: string): Promise<LoanApplication | null> {
    const apps = readApplications();
    return apps.find((app) => app.id === id) ?? null;
  },

  async updateStatus(id: string, status: LoanApplication['status'], notes?: string): Promise<LoanApplication | null> {
    const apps = readApplications();
    const idx = apps.findIndex((app) => app.id === id);
    if (idx === -1) return null;

    const updated = { ...apps[idx], status, timeline: [...apps[idx].timeline, { title: 'Status Updated', description: notes || 'Underwriter review completed.', timestamp: new Date().toISOString() }] };
    apps[idx] = updated;
    writeApplications(apps);
    return updated;
  },
};
