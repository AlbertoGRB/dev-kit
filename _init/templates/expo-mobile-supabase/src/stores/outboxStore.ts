/**
 * Outbox — fila persistida de operações pendentes (escrita offline).
 * Online → envia na hora; offline → enfileira e processa quando a rede volta.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OutboxOpType = 'record.create' | 'record.update';
export type OutboxStatus = 'pending' | 'syncing' | 'error';

export interface OutboxOp {
  id: string;
  type: OutboxOpType;
  tempId?: string;
  recordId?: string;
  payload: Record<string, any>;
  status: OutboxStatus;
  attempts: number;
  lastError?: string;
  createdAt: string;
}

interface OutboxState {
  ops: OutboxOp[];
  enqueue: (op: Omit<OutboxOp, 'id' | 'status' | 'attempts' | 'createdAt'>) => OutboxOp;
  markSyncing: (id: string) => void;
  markError: (id: string, message: string) => void;
  remove: (id: string) => void;
  replaceTempId: (tempId: string, realId: string) => void;
  clear: () => void;
}

export function makeLocalId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const useOutbox = create<OutboxState>()(
  persist(
    (set) => ({
      ops: [],
      enqueue: (op) => {
        const full: OutboxOp = { ...op, id: makeLocalId(), status: 'pending', attempts: 0, createdAt: new Date().toISOString() };
        set((s) => ({ ops: [...s.ops, full] }));
        return full;
      },
      markSyncing: (id) => set((s) => ({ ops: s.ops.map((o) => o.id === id ? { ...o, status: 'syncing', attempts: o.attempts + 1 } : o) })),
      markError: (id, message) => set((s) => ({ ops: s.ops.map((o) => o.id === id ? { ...o, status: 'error', lastError: message } : o) })),
      remove: (id) => set((s) => ({ ops: s.ops.filter((o) => o.id !== id) })),
      replaceTempId: (tempId, realId) => set((s) => ({
        ops: s.ops.map((o) => o.payload?.parent_id === tempId ? { ...o, payload: { ...o.payload, parent_id: realId } } : o),
      })),
      clear: () => set({ ops: [] }),
    }),
    { name: 'outbox-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
