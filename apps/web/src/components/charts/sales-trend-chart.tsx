"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { SalesTrendPoint } from "@gold-shop/types";
import { formatCurrencyVND } from "@gold-shop/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gold-shop/ui";

export function SalesTrendChart({ data }: { data: SalesTrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Xu hướng doanh thu</CardTitle>
        <CardDescription>Doanh thu và số giao dịch theo ngày.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatCurrencyVND(value).replace("₫", "")} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "revenue" ? formatCurrencyVND(value) : value,
                name === "revenue" ? "Doanh thu" : "Số giao dịch"
              ]}
            />
            <Line type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="transactionCount" stroke="#44403c" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

