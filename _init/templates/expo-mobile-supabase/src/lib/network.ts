/**
 * Integra onlineManager do TanStack Query com AppState do RN (sem dep nativa extra).
 * Para detecção de rede mais precisa, instale @react-native-community/netinfo.
 */
import { AppState, type AppStateStatus } from 'react-native';
import { onlineManager } from '@tanstack/react-query';
import { logger } from './logger';

let initialized = false;

export function setupNetworkManager(): void {
  if (initialized) return;
  initialized = true;
  onlineManager.setEventListener((setOnline) => {
    const handle = (s: AppStateStatus) => setOnline(s === 'active');
    const sub = AppState.addEventListener('change', handle);
    logger.info('network', 'Network manager iniciado (AppState)');
    return () => sub.remove();
  });
}

/** HEAD leve p/ diagnóstico pontual. Hermes: use AbortController, não AbortSignal.timeout(). */
export async function checkConnectivity(): Promise<boolean> {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const res = await fetch(`${url}/rest/v1/`, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return res.ok || res.status === 401;
  } catch {
    clearTimeout(timer);
    return false;
  }
}
