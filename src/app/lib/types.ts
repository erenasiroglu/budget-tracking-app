export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  budgetLimit?: number;
  color: string;
}

export interface BudgetState {
  transactions: Transaction[];
  categories: Category[];
} 