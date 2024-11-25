"use client";
import { useBudget } from "@/app/hooks/useBudget";
import { Card } from "../../../../src/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function BudgetSummary() {
  const { state } = useBudget();

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-primary/10">
        <h3 className="text-lg font-semibold mb-2">Toplam Gelir</h3>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(totalIncome)}
        </p>
      </Card>

      <Card className="bg-danger/10">
        <h3 className="text-lg font-semibold mb-2">Toplam Gider</h3>
        <p className="text-2xl font-bold text-danger">
          {formatCurrency(totalExpense)}
        </p>
      </Card>

      <Card className={balance >= 0 ? "bg-success/10" : "bg-warning/10"}>
        <h3 className="text-lg font-semibold mb-2">Kalan Bütçe</h3>
        <p
          className={`text-2xl font-bold ${
            balance >= 0 ? "text-success" : "text-warning"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </Card>
    </div>
  );
}
