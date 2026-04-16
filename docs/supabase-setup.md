# Supabase Setup

## Mục tiêu

- Chạy `apps/web` và `apps/api` với một project Supabase hosted dành cho môi trường dev hoặc staging.
- Giữ Supabase MCP ở chế độ `read_only=true` và scope vào đúng một project.
- Không nối MCP vào production vì repo này chứa dữ liệu nhạy cảm của tiệm vàng: giao dịch, thu chi, tồn kho, audit log.

## Giá trị cần lấy từ Supabase Dashboard

- `project_ref`
- `Project URL`
- `anon` key
- `service_role` key
- database password nếu bạn muốn chạy `npx supabase link --project-ref ...` và CLI hỏi password

## File env cần điền

- `.env`
  Dùng cho workflow CLI và làm bản ghi cục bộ của project ref/keys.
- `apps/api/.env`
  Dùng cho NestJS API, JWT verification, storage upload, và schema adapter.
- `apps/web/.env.local`
  Dùng cho Next.js dashboard, Supabase Auth client, và gọi API nội bộ.

## Mapping env

```dotenv
# Root .env
SUPABASE_PROJECT_REF=<project-ref>
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_JWT_ISSUER=https://<project-ref>.supabase.co/auth/v1
SUPABASE_JWKS_URL=https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json
```

```dotenv
# apps/api/.env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_JWT_ISSUER=https://<project-ref>.supabase.co/auth/v1
SUPABASE_JWT_AUDIENCE=authenticated
SUPABASE_JWKS_URL=https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json
SUPABASE_STORAGE_BUCKET_EXCEL_IMPORTS=excel-imports
```

```dotenv
# apps/web/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Supabase CLI workflow

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase migration list
npx supabase gen types --linked --lang=typescript --schema public > supabase/types/database.types.ts
```

- `supabase/config.toml` trong repo chỉ là metadata tối thiểu để CLI nhận diện workspace này là một Supabase project.
- Giai đoạn setup đầu tiên không yêu cầu `npx supabase start`.
- Sau khi link thành công, áp migration hỗ trợ nếu remote chưa có:

```bash
npx supabase db push
```

## Buckets và bảng tối thiểu

- Tạo hoặc xác nhận bucket `excel-imports` tồn tại trước khi dùng luồng import Excel.
- Xác nhận hai bảng hỗ trợ đã có trên remote schema:
  - `public.audit_logs`
  - `public.import_sessions`

## Supabase MCP cho Codex

Thêm đoạn sau vào `~/.codex/config.toml`, thay `<project-ref>` bằng project dev hoặc staging thật:

```toml
[mcp_servers.supabase]
url = "https://mcp.supabase.com/mcp?project_ref=<project-ref>&read_only=true"
```

## Kiểm tra sau setup

- `pnpm dev` khởi động được web và api mà không báo thiếu env.
- Web render được trang đăng nhập.
- API verify được JWT từ Supabase và lấy được hồ sơ người dùng qua bảng map role hiện có.
- `npx supabase migration list` thấy remote project.
- `supabase/types/database.types.ts` không còn là placeholder rỗng.
- MCP query đọc schema/tables được nhưng không có luồng ghi dữ liệu.

## Ghi chú vận hành

- Chỉ dùng MCP với project dev/staging, không dùng production.
- Nếu cần thay đổi schema nghiệp vụ, vẫn phải đi qua migration review thay vì để agent tự ghi trực tiếp lên production.
- Khi schema remote đổi, regenerate type file rồi chạy lại `pnpm typecheck`.
