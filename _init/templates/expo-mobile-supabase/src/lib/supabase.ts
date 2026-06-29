/**
 * Cliente Supabase para mobile.
 * - Sessão/tokens em expo-secure-store (Keystore/Keychain) — criptografado.
 * - autoRefreshToken: renova o JWT antes de expirar
 * - detectSessionInUrl: false (mobile não usa deep-link p/ auth)
 * - A anon key é segura no bundle: o controle de acesso é via RLS.
 *   NUNCA coloque a service_role key no app mobile.
 * Requer: npx expo install expo-secure-store
 */
import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  const msg = '[supabase] EXPO_PUBLIC_SUPABASE_URL/ANON_KEY ausentes. Crie o .env.';
  logger.error('supabase', msg);
  if (__DEV__) throw new Error(msg);
}

// Adapter SecureStore com chunking (SecureStore tem limite de ~2KB por valor no Android;
// o token de sessão do Supabase pode passar disso, então fatiamos em pedaços).
const CHUNK = 2000;
const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const head = await SecureStore.getItemAsync(key);
    if (head == null) return null;
    if (!head.startsWith('__chunks__:')) return head;
    const n = parseInt(head.split(':')[1], 10);
    let out = '';
    for (let i = 0; i < n; i++) {
      const part = await SecureStore.getItemAsync(`${key}__${i}`);
      if (part == null) return null;
      out += part;
    }
    return out;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (value.length <= CHUNK) { await SecureStore.setItemAsync(key, value); return; }
    const n = Math.ceil(value.length / CHUNK);
    await SecureStore.setItemAsync(key, `__chunks__:${n}`);
    for (let i = 0; i < n; i++) {
      await SecureStore.setItemAsync(`${key}__${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK));
    }
  },
  removeItem: async (key: string): Promise<void> => {
    const head = await SecureStore.getItemAsync(key);
    await SecureStore.deleteItemAsync(key);
    if (head?.startsWith('__chunks__:')) {
      const n = parseInt(head.split(':')[1], 10);
      for (let i = 0; i < n; i++) await SecureStore.deleteItemAsync(`${key}__${i}`);
    }
  },
};

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

logger.info('supabase', `Cliente inicializado → ${url}`);
