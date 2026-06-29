/** Tipos espelhando o schema do Postgres. Gere com: supabase gen types typescript */
export type Role = 'ADMIN' | 'MANAGER' | 'SELLER';

export interface Profile {
  id: string;
  name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}
