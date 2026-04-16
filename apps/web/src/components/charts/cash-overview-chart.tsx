"use client";

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { CashOverviewPoint } from "@gold-shop/types";
import { formatCurrencyVND } from "@gold-shop/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gold-shop/ui";

export function CashOverviewChart({ data }: { data: CashOverviewPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thu chi tiền mặt</CardTitle>
        <CardDescription>So sánh luồng tiền vào và ra trong kỳ.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatCurrencyVND(value).replace("₫", "")} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatCurrencyVND(value)} />
            <Legend />
            <Bar dataKey="cashIn" fill="#d97706" radius={[8, 8, 0, 0]} name="Thu" />
            <Bar dataKey="cashOut" fill="#57534e" radius={[8, 8, 0, 0]} name="Chi" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

