import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

// CSS sınıflarını birleştirmek için yardımcı fonksiyon
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Para birimini formatlamak için yardımcı fonksiyon
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Tarihi formatlamak için yardımcı fonksiyon
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'd MMMM yyyy', { locale: tr })
}

// Yüzde hesaplama yardımcı fonksiyonu
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

// Bütçe limitini kontrol etmek için yardımcı fonksiyon
export function checkBudgetLimit(spent: number, limit: number): {
  isExceeded: boolean
  percentage: number
} {
  const percentage = calculatePercentage(spent, limit)
  return {
    isExceeded: spent > limit,
    percentage,
  }
}

// Ay bazında işlemleri gruplamak için yardımcı fonksiyon
export function groupTransactionsByMonth(transactions: any[]) {
  return transactions.reduce((groups: any, transaction) => {
    const date = new Date(transaction.date)
    const month = format(date, 'MMMM yyyy', { locale: tr })

    if (!groups[month]) {
      groups[month] = []
    }
    groups[month].push(transaction)
    return groups
  }, {})
}

// Kategori bazında harcamaları toplamak için yardımcı fonksiyon
export function sumExpensesByCategory(transactions: any[], categories: any[]) {
  return categories
    .filter(category => category.type === 'expense')
    .map(category => {
      const total = transactions
        .filter(t => t.category === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        category: category.name,
        amount: total,
        color: category.color,
      }
    })
    .filter(item => item.amount > 0)
}

// Aylık toplam gelir ve giderleri hesaplamak için yardımcı fonksiyon
export function calculateMonthlyTotals(transactions: any[]) {
  const monthlyData = transactions.reduce((acc: any, transaction) => {
    const month = format(new Date(transaction.date), 'MMMM yyyy', { locale: tr })
    
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 }
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount
    } else {
      acc[month].expense += transaction.amount
    }
    
    return acc
  }, {})

  return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
    month,
    ...data,
  }))
}

// LocalStorage işlemleri için yardımcı fonksiyonlar
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
}

// PDF export için yardımcı fonksiyon
export function generatePDFData(state: any) {
  const monthlyTotals = calculateMonthlyTotals(state.transactions)
  const categoryTotals = sumExpensesByCategory(state.transactions, state.categories)

  return {
    monthlyTotals,
    categoryTotals,
    totalIncome: state.transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0),
    totalExpense: state.transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0),
  }
}

// Tarih aralığına göre işlemleri filtrelemek için yardımcı fonksiyon
export function filterTransactionsByDateRange(
  transactions: any[],
  startDate: Date,
  endDate: Date
) {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= startDate && transactionDate <= endDate
  })
}

// Kategori limitlerini kontrol etmek için yardımcı fonksiyon
export function checkCategoryLimits(transactions: any[], categories: any[]) {
  return categories
    .filter(category => category.budgetLimit && category.type === 'expense')
    .map(category => {
      const spent = transactions
        .filter(t => t.category === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const { isExceeded, percentage } = checkBudgetLimit(spent, category.budgetLimit!)

      return {
        category: category.name,
        spent,
        limit: category.budgetLimit,
        isExceeded,
        percentage,
      }
    })
}