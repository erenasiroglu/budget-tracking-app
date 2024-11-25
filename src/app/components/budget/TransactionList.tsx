"use client";
import { useBudget } from "@/app/hooks/useBudget";
import { Card } from "../../../../src/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrashIcon } from "lucide-react";

export default function TransactionList() {
  const { state, dispatch } = useBudget();

  const sortedTransactions = [...state.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Son İşlemler</h2>

      <div className="space-y-4">
        {sortedTransactions.map((transaction) => {
          const category = state.categories.find(
            (c) => c.id === transaction.category
          );

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-zinc-800"
            >
              <div className="flex-1">
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {category?.name} • {formatDate(transaction.date)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>

                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2 text-gray-500 hover:text-danger"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}

        {sortedTransactions.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Henüz işlem bulunmuyor
          </p>
        )}
      </div>
    </Card>
  );
}
