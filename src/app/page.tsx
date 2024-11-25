import BudgetSummary from "./components/budget/BudgetSummary";
import TransactionList from "./components/budget/TransactionList";
import AddTransactionForm from "./components/budget/AddTransactionForm";
import ExpensesByCategory from "../../src/app/components/budget/charts/ExpensesByCategory";
import MonthlyTrend from "../../src/app/components/budget/charts/MonthlyTrend";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kişisel Bütçe Takibi</h1>

      <div className="space-y-8">
        <BudgetSummary />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AddTransactionForm />
          <TransactionList />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpensesByCategory />
          <MonthlyTrend />
        </div>
      </div>
    </main>
  );
}
