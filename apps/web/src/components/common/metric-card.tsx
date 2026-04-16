import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@gold-shop/ui";

interface MetricCardProps {
  title: string;
  value: string;
  hint: string;
  direction?: "up" | "down" | "neutral";
}

export function MetricCard({ title, value, hint, direction = "neutral" }: MetricCardProps) {
  return (
    <Card className="shadow-panel">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-sm text-stone-600">{title}</CardTitle>
          <p className="mt-3 text-2xl font-semibold text-stone-950">{value}</p>
        </div>
        <Badge className="gap-1 border-stone-200 bg-white text-stone-600">
          {direction === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
          {direction === "down" ? <ArrowDownRight className="h-3.5 w-3.5" /> : null}
          {hint}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm text-stone-500">{hint}</CardContent>
    </Card>
  );
}

