export type Currency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'KZT' | 'CNY' | 'UAH' | 'BYN' | 'AED' | 'TRY';
export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';
export type Language = 'ru' | 'en';
export type Plan = 'free' | 'pro';
export type PromoPeriod = 'monthly' | 'yearly' | 'lifetime';
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  categoryId: string;
  description: string;
  date: string;
  createdAt: string;
  transferId?: string;
  transferPeerId?: string;
  transferPeerAccountId?: string;
  transferRole?: 'out' | 'in';
}

export interface PlannedExpense {
  id: string;
  accountId: string;
  type?: 'income' | 'expense';
  amount: number;
  currency: Currency;
  categoryId: string;
  description: string;
  startDate: string;
  completedDates: string[];
  recurring?: {
    frequency: RecurringFrequency;
    endDate: string;
  };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  isPreset: boolean;
}

export interface DayEvents {
  pending: number;
  completed: number;
  items: { expense: PlannedExpense; date: string }[];
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  period: 'monthly';
  currency: Currency;
  createdAt: string;
}

export type DebtDirection = 'lent' | 'borrowed';
export type DebtStatus = 'active' | 'paid';

export interface DebtPayment {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  note: string;
  scheduledPaymentId?: string;
  scheduledPaymentDueDate?: string;
  scheduledPaymentSourceAccountId?: string;
}

export interface ScheduledPayment {
  id: string;
  amount: number;
  dueDate: string;
  note: string;
  sourceAccountId?: string;
  completedDates: string[];
  paidDate?: string;
}

export interface Debt {
  id: string;
  direction: DebtDirection;
  personName: string;
  amount: number;
  currency: Currency;
  description: string;
  dueDate?: string;
  accountId?: string;
  paidAmount: number;
  status: DebtStatus;
  payments: DebtPayment[];
  scheduledPayments: ScheduledPayment[];
  createdAt: string;
}

export { Currency, Transaction, TransactionType, RecurringFrequency };
