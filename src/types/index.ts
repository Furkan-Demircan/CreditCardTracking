export interface CreditCard {
  id: string;
  name: string;
  bankName?: string;
  color: string;
  dueDay: number;
}

export interface InstallmentDetail {
  installmentNumber: number;
  totalInstallments: number;
  dueDate: string;
  monthKey: string;
  monthLabel: string;
  amount: number;
  isPaid: boolean;
}

export interface Purchase {
  id: string;
  title: string;
  category: string;
  totalAmount: number;
  totalInstallments: number;
  purchaseDate: string;
  cardId?: string;
  cardName?: string;
  dueDay: number;
  firstPaymentDate?: string;
  notes?: string;
  createdAt: string;
}

export interface CalculatedPurchase extends Purchase {
  monthlyAmount: number;
  installments: InstallmentDetail[];
  paidInstallmentsCount: number;
  remainingInstallmentsCount: number;
  paidAmount: number;
  remainingAmount: number;
  startMonthKey: string;
  endMonthKey: string;
  startMonthLabel: string;
  endMonthLabel: string;
  status: 'active' | 'completed' | 'future';
  progressPercentage: number;
}

export interface MonthlyItem {
  purchaseId: string;
  purchaseTitle: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  dueDate: string;
  cardName?: string;
  category?: string;
  isPaid: boolean;
}

export interface MonthlySummary {
  monthKey: string;
  monthLabel: string;
  shortLabel: string;
  year: number;
  month: number;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  items: MonthlyItem[];
}

export interface DashboardStats {
  thisMonthTotal: number;
  thisMonthPaid: number;
  thisMonthRemaining: number;
  nextMonthTotal: number;
  totalRemainingDebt: number;
  totalActivePurchases: number;
  activeInstallmentCount: number;
  completedPurchasesCount: number;
}
