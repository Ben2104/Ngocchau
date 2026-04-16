# API Contracts

## Envelope

All API responses use a shared envelope:

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    requestId: string;
    timestamp: string;
    path?: string;
  };
  error?: {
    code: string;
    details?: unknown;
  };
};
```

## Initial Endpoints

- `GET /api/v1/auth/me`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/sales-trend`
- `GET /api/v1/dashboard/cash-overview`
- `GET /api/v1/transactions`
- `POST /api/v1/transactions`
- `PATCH /api/v1/transactions/:id`
- `GET /api/v1/cashbook`
- `POST /api/v1/cashbook`
- `GET /api/v1/inventory`
- `POST /api/v1/excel-import/upload`
- `POST /api/v1/excel-import/validate`
- `POST /api/v1/excel-import/commit`
- `GET /api/v1/audit-logs`

