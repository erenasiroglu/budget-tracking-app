import BudgetSummary from "./components/budget/BudgetSummary";
import TransactionList from "./components/budget/TransactionList";
import AddTransactionForm from "./components/budget/AddTransactionForm";
import { ExpensesByCategory, MonthlyTrend } from "./components/budget/charts";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kişisel Bütçe Takibi</h1>

      <BudgetSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <AddTransactionForm />
        <TransactionList />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ExpensesByCategory />
        <MonthlyTrend />
      </div>
    </main>
  );
}
