import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiEnvPath = path.join(repoRoot, "apps/api/.env");

function loadEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

function createSupabaseAdminContext() {
  loadEnvFile(apiEnvPath);

  return {
    apiKey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    baseUrl: getRequiredEnv("SUPABASE_URL")
  };
}

async function supabaseFetch(context, pathname, { method = "GET", body, headers = {} } = {}) {
  const response = await fetch(`${context.baseUrl}${pathname}`, {
    method,
    headers: {
      apikey: context.apiKey,
      Authorization: `Bearer ${context.apiKey}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const error = new Error(`${method} ${pathname} failed with ${response.status}`);
    error.details = payload;
    throw error;
  }

  return {
    headers: response.headers,
    payload
  };
}

async function resolveProfileTable(context) {
  for (const tableName of ["users", "profiles"]) {
    try {
      await supabaseFetch(context, `/rest/v1/${tableName}?select=id&limit=1`);
      return tableName;
    } catch (error) {
      const code = error.details?.code;

      if (code === "42P01" || code === "PGRST205") {
        continue;
      }

      throw error;
    }
  }

  return null;
}

async function countTableRows(context, tableName) {
  try {
    const { headers } = await supabaseFetch(context, `/rest/v1/${tableName}?select=id&limit=1`, {
      headers: {
        Prefer: "count=exact"
      }
    });
    const contentRange = headers.get("content-range");

    if (!contentRange) {
      return 0;
    }

    const total = contentRange.split("/")[1];
    return Number(total ?? 0);
  } catch (error) {
    return `error:${error.details?.code ?? error.message}`;
  }
}

async function inspectProject() {
  const context = createSupabaseAdminContext();
  const profileTable = await resolveProfileTable(context);
  const counts = {};

  for (const tableName of [
    "transactions",
    "cashbook_entries",
    "products",
    "inventory",
    "import_sessions",
    "audit_logs"
  ]) {
    counts[tableName] = await countTableRows(context, tableName);
  }

  console.log(
    JSON.stringify(
      {
        profileTable,
        counts
      },
      null,
      2
    )
  );
}

async function resolveUserByEmail(context, email) {
  let page = 1;

  while (true) {
    const { payload } = await supabaseFetch(context, `/auth/v1/admin/users?page=${page}&per_page=200`);
    const users = payload?.users ?? [];
    const matchingUser = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (matchingUser) {
      return matchingUser;
    }

    if (users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function ensureProfileRow(context, profileTable, userId, fullName) {
  const encodedUserId = encodeURIComponent(userId);
  const { payload } = await supabaseFetch(
    context,
    `/rest/v1/${profileTable}?select=id&user_id=eq.${encodedUserId}&limit=1`
  );
  const existingProfile = Array.isArray(payload) ? payload[0] : null;
  const profilePayload = {
    user_id: userId,
    role: "owner",
    status: "active",
    employee_id: null,
    full_name: fullName
  };

  if (existingProfile?.id) {
    await supabaseFetch(context, `/rest/v1/${profileTable}?id=eq.${encodeURIComponent(existingProfile.id)}`, {
      method: "PATCH",
      body: profilePayload
    });
    return;
  }

  await supabaseFetch(context, `/rest/v1/${profileTable}`, {
    method: "POST",
    body: profilePayload,
    headers: {
      Prefer: "return=representation"
    }
  });
}

async function ensureDemoOwner({ email, password, fullName }) {
  const context = createSupabaseAdminContext();
  const profileTable = await resolveProfileTable(context);

  if (!profileTable) {
    throw new Error("Could not find a users or profiles table for auth profile mapping");
  }

  let user = await resolveUserByEmail(context, email);

  if (!user) {
    const { payload } = await supabaseFetch(context, "/auth/v1/admin/users", {
      method: "POST",
      body: {
        email,
        password,
        email_confirm: true,
        app_metadata: {
          role: "owner"
        },
        user_metadata: {
          full_name: fullName
        }
      }
    });

    user = payload?.user;
  } else {
    await supabaseFetch(context, `/auth/v1/admin/users/${user.id}`, {
      method: "PUT",
      body: {
        password,
        app_metadata: {
          ...(user.app_metadata ?? {}),
          role: "owner"
        },
        user_metadata: {
          ...(user.user_metadata ?? {}),
          full_name: fullName
        }
      }
    });
  }

  if (!user?.id) {
    throw new Error("Could not resolve a Supabase auth user id for demo owner");
  }

  await ensureProfileRow(context, profileTable, user.id, fullName);

  console.log(
    JSON.stringify(
      {
        email,
        fullName,
        profileTable,
        userId: user.id
      },
      null,
      2
    )
  );
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === "inspect") {
    await inspectProject();
    return;
  }

  if (command === "ensure-owner") {
    const [email, password, fullName = "PM Demo Owner"] = args;

    if (!email || !password) {
      throw new Error("Usage: node scripts/supabase-demo-owner.mjs ensure-owner <email> <password> [full-name]");
    }

    await ensureDemoOwner({ email, password, fullName });
    return;
  }

  throw new Error("Usage: node scripts/supabase-demo-owner.mjs <inspect|ensure-owner> ...");
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.message);
    if (error.details) {
      console.error(JSON.stringify(error.details, null, 2));
    }
  } else {
    console.error(JSON.stringify(error, null, 2));
  }
  process.exit(1);
});
