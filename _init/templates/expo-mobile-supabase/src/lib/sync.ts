/**
 * Motor de sincronização da outbox (escrita offline-first).
 *
 * Estratégia (do projeto de referência):
 * - Processa operações EM SÉRIE (preserva dependências entre registros).
 * - Erro de REDE → volta a 'pending' e interrompe o flush (tenta depois).
 * - Erro de SERVIDOR (validação/conflito) → marca 'error' e segue.
 * - Após sucesso, propaga IDs reais (replaceTempId) e invalida o cache.
 * - Rate limit: mínimo FLUSH_MIN_INTERVAL_MS entre flushes; flag anti-concorrência.
 *
 * Adapte o switch de `processOp` aos tipos de operação do seu domínio.
 */
import { supabase } from './supabase';
import { logger } from './logger';
import { queryClient } from './queryClient';
import { useOutbox, type OutboxOp } from '@/stores/outboxStore';

const TAG = 'sync';
const FLUSH_MIN_INTERVAL_MS = 5_000;
let flushing = false;
let lastFlushAt = 0;

export function isNetworkError(err: unknown): boolean {
  const msg = String((err as any)?.message ?? err ?? '').toLowerCase();
  return (
    msg.includes('network request failed') || msg.includes('failed to fetch') ||
    msg.includes('networkerror') || msg.includes('fetch') || msg.includes('aborted') ||
    (err as any)?.code === 'ETIMEDOUT' || (err as any)?.code === 'ENOTFOUND' ||
    (err as any)?.code === 'ECONNREFUSED'
  );
}

async function processOp(
  op: OutboxOp,
): Promise<{ ok: true; realId?: string } | { ok: false; network: boolean; error: string }> {
  try {
    switch (op.type) {
      // EXEMPLO — troque 'records' pela sua tabela e ajuste os tipos:
      case 'record.create': {
        const { data, error } = await supabase.from('records').insert(op.payload).select('id').single();
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['records'] });
        return { ok: true, realId: data?.id };
      }
      case 'record.update': {
        if (!op.recordId) throw new Error('recordId ausente em record.update');
        const { error } = await supabase.from('records').update(op.payload).eq('id', op.recordId);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['records'] });
        return { ok: true };
      }
      default:
        return { ok: false, network: false, error: `Op desconhecida: ${(op as any).type}` };
    }
  } catch (e: unknown) {
    return { ok: false, network: isNetworkError(e), error: (e as any)?.message ?? String(e) };
  }
}

export async function flushOutbox(): Promise<{ sent: number; failed: number; pending: number }> {
  const now = Date.now();
  if (flushing || now - lastFlushAt < FLUSH_MIN_INTERVAL_MS) {
    return { sent: 0, failed: 0, pending: useOutbox.getState().ops.length };
  }
  flushing = true; lastFlushAt = now;
  let sent = 0, failed = 0;
  try {
    while (true) {
      const op = useOutbox.getState().ops.find((o) => o.status === 'pending' || o.status === 'error');
      if (!op) break;
      useOutbox.getState().markSyncing(op.id);
      const r = await processOp(op);
      if (r.ok) {
        if (op.tempId && r.realId) useOutbox.getState().replaceTempId(op.tempId, r.realId);
        useOutbox.getState().remove(op.id); sent++;
      } else if (r.network) {
        useOutbox.setState((s) => ({ ops: s.ops.map((o) => o.id === op.id ? { ...o, status: 'pending', lastError: r.error } : o) }));
        break;
      } else { useOutbox.getState().markError(op.id, r.error); failed++; }
    }
  } finally { flushing = false; }
  const pending = useOutbox.getState().ops.length;
  logger.info(TAG, `Flush: sent=${sent} failed=${failed} pending=${pending}`);
  return { sent, failed, pending };
}
