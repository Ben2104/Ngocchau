/**
 * Replace this placeholder by generating types from the target Supabase project:
 *
 * 1. npx supabase login
 * 2. npx supabase link --project-ref <project-ref>
 * 3. npx supabase gen types --linked --lang=typescript --schema public > supabase/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
