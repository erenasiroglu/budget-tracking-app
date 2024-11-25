"use client";
import { useBudget } from "@/app/hooks/useBudget";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function MonthlyTrend() {
  const { state } = useBudget();

  const monthlyData = state.transactions.reduce(
    (acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString("tr-TR", {
        month: "short",
      });

      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 };
      }

      if (transaction.type === "income") {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }

      return acc;
    },
    {} as Record<string, { month: string; income: number; expense: number }>
  );

  const data = Object.values(monthlyData);

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Aylık Trend</h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="var(--success)"
              name="Gelir"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="var(--danger)"
              name="Gider"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
