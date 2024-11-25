import { BudgetProvider } from "../context/BudgetContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <BudgetProvider>{children}</BudgetProvider>;
}
