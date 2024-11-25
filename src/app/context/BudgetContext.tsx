import { createContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { BudgetState, Transaction, Category } from "../lib/types";
import { STORAGE_KEY, DEFAULT_CATEGORIES } from "../lib/constants";

type BudgetAction =
  | { type: "ADD_TRANSACTION"; payload: Omit<Transaction, "id"> }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_CATEGORY"; payload: Omit<Category, "id"> }
  | { type: "UPDATE_CATEGORY"; payload: Category };

const initialState: BudgetState = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
};

export const BudgetContext = createContext<{
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
} | null>(null);

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [
          ...state.transactions,
          { ...action.payload, id: uuidv4() },
        ],
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, { ...action.payload, id: uuidv4() }],
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    default:
      return state;
  }
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.entries(parsedData).forEach(([key, value]) => {
        dispatch({ type: `LOAD_${key.toUpperCase()}`, payload: value });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}
