export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          actor_role: string;
          actor_user_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          metadata: Json;
          module_name: string;
        };
        Insert: {
          action: string;
          actor_role: string;
          actor_user_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          metadata?: Json;
          module_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
      import_sessions: {
        Row: {
          committed_at: string | null;
          created_at: string;
          file_name: string;
          id: string;
          normalized_rows: Json | null;
          status: string;
          storage_path: string;
          updated_at: string;
          uploaded_by: string | null;
          validation_summary: Json;
        };
        Insert: {
          committed_at?: string | null;
          created_at?: string;
          file_name: string;
          id?: string;
          normalized_rows?: Json | null;
          status: string;
          storage_path: string;
          updated_at?: string;
          uploaded_by?: string | null;
          validation_summary?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["import_sessions"]["Insert"]>;
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          employee_id: string;
          full_name: string;
          id: string;
          joined_at: string;
          role: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          employee_id: string;
          full_name: string;
          id?: string;
          joined_at?: string;
          role: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
