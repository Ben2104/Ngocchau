export type SupabaseQueryError = {
  code?: string;
  message?: string;
} | null;

export function isMissingTableError(error: SupabaseQueryError) {
  return error?.code === "42P01" || error?.code === "PGRST205";
}
