import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';

export const authService = {
  async getMe(): Promise<UserProfile> {
    if (typeof window === 'undefined') return INITIAL_USER;

    const raw = window.localStorage.getItem('loanguard_user');
    if (!raw) return INITIAL_USER;

    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return INITIAL_USER;
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('loanguard_user');
    }
  },
};
