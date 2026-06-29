/**
 * Logger estruturado. __DEV__: todos os níveis; produção: só WARN/ERROR.
 * Mantém os últimos 300 logs em memória (tela de diagnóstico).
 */
declare const __DEV__: boolean;

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export interface LogEntry { level: LogLevel; tag: string; message: string; data?: unknown; timestamp: string; }

const MAX = 300;
const buffer: LogEntry[] = [];
const C: Record<LogLevel, string> = { DEBUG: '\x1b[36m', INFO: '\x1b[32m', WARN: '\x1b[33m', ERROR: '\x1b[31m' };
const R = '\x1b[0m';

function record(level: LogLevel, tag: string, message: string, data?: unknown) {
  buffer.push({ level, tag, message, ...(data !== undefined ? { data } : {}), timestamp: new Date().toISOString() });
  if (buffer.length > MAX) buffer.shift();
  if (!__DEV__ && (level === 'DEBUG' || level === 'INFO')) return;
  const p = `${C[level]}[${level}][${tag}]${R}`;
  if (data !== undefined) console.log(`${p} ${message}`, data); else console.log(`${p} ${message}`);
}

export const logger = {
  debug: (t: string, m: string, d?: unknown) => record('DEBUG', t, m, d),
  info:  (t: string, m: string, d?: unknown) => record('INFO',  t, m, d),
  warn:  (t: string, m: string, d?: unknown) => record('WARN',  t, m, d),
  error: (t: string, m: string, d?: unknown) => record('ERROR', t, m, d),
  getLogs: (): readonly LogEntry[] => [...buffer],
  clearLogs: () => { buffer.length = 0; },
};
