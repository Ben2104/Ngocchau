function getRequiredValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required public env: ${name}`);
  }

  return value;
}

export const publicEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Gold Shop System",
  apiBaseUrl: getRequiredValue(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL"),
  supabaseUrl: getRequiredValue(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getRequiredValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  defaultTimezone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE ?? "Asia/Ho_Chi_Minh"
};

