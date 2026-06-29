/** Formatações pt-BR. */
export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const dateBR = (iso: string | Date) =>
  new Date(iso).toLocaleDateString('pt-BR');
