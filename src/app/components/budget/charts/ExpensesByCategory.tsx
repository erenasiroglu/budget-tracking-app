"use client";

import { useBudget } from "@/app/hooks/useBudget";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function ExpensesByCategory() {
  const { state } = useBudget();

  const expensesByCategory = state.categories
    .filter((c) => c.type === "expense")
    .map((category) => {
      const total = state.transactions
        .filter((t) => t.category === category.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: category.name,
        value: total,
        color: category.color,
      };
    })
    .filter((item) => item.value > 0);

  if (expensesByCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kategorilere Göre Giderler</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Henüz gider bulunmuyor</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategorilere Göre Giderler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
