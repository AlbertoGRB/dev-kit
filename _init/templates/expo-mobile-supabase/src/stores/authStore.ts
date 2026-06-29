/**
 * Store de autenticação (Zustand).
 * Fluxo: initialize() lê sessão do AsyncStorage → initialized=true →
 * hooks de dados habilitam queries (enabled: initialized && !!session).
 * Sem esse guard, o RLS bloqueia as queries silenciosamente.
 */
import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { Profile } from '@/types/database';

const TAG = 'authStore';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  initialized: boolean;
  loading: boolean;
  initialize: () => Promise<void>;
  loadProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null, user: null, profile: null, initialized: false, loading: false,

  initialize: async () => {
    if (get().initialized) return;
    try {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, user: data.session?.user ?? null, initialized: true });
      if (data.session?.user) await get().loadProfile();
    } catch (e) {
      logger.error(TAG, 'Falha ao inicializar auth', e);
      set({ initialized: true });
    }
    supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info(TAG, `onAuthStateChange: ${event}`);
      set({ session, user: session?.user ?? null });
      if (session?.user) await get().loadProfile(); else set({ profile: null });
    });
  },

  loadProfile: async () => {
    const id = get().user?.id;
    if (!id) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) { logger.warn(TAG, 'Erro ao carregar profile', error.message); return; }
    if (data) set({ profile: data as Profile });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { set({ loading: false }); return { error: error.message }; }
      if (data.session) {
        set({ session: data.session, user: data.session.user });
        await get().loadProfile();
      }
      set({ loading: false });
      return { error: null };
    } catch (e) {
      set({ loading: false });
      return { error: e instanceof Error ? e.message : 'Erro inesperado.' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },
}));
