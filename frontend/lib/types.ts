export type Account = {
  id: number;
  name: string;
  accountType: string;
  balance: number;
  createdAt: string;
};

export type Transaction = {
  id: number;
  accountId: number;
  amount: number;
  type: string;
  category: string;
  description: string;
  date: string;
};

export type ExpenseSummary = {
  category: string;
  total: number;
  count: number;
};

export type CreateAccountInput = {
  name: string;
  accountType: string;
};

export type CreateTransactionInput = {
  amount: number;
  type: string;
  category: string;
  description: string;
};

export type SavingsGoal = {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: string;
};

export type RecurringBill = {
  id: number;
  merchant: string;
  amount: number;
  dueDate: string;
  category: string;
  status: string;
};

export type RoadmapItem = {
  id: number;
  title: string;
  description: string;
  endpoint: string;
  priority: string;
};
