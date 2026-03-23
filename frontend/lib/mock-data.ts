import { RecurringBill, RoadmapItem, SavingsGoal } from "@/lib/types";

export const mockedGoals: SavingsGoal[] = [
  {
    id: 1,
    title: "Emergency Reserve",
    targetAmount: 12000,
    currentAmount: 7800,
    targetDate: "2026-11-01T00:00:00.000Z",
    status: "On Track",
  },
  {
    id: 2,
    title: "Travel Fund",
    targetAmount: 4500,
    currentAmount: 1900,
    targetDate: "2026-08-15T00:00:00.000Z",
    status: "Needs Attention",
  },
];

export const mockedBills: RecurringBill[] = [
  {
    id: 1,
    merchant: "City Energy",
    amount: 128.42,
    dueDate: "2026-03-28T00:00:00.000Z",
    category: "Utilities",
    status: "Upcoming",
  },
  {
    id: 2,
    merchant: "North Loop Internet",
    amount: 74.99,
    dueDate: "2026-04-02T00:00:00.000Z",
    category: "Connectivity",
    status: "Upcoming",
  },
  {
    id: 3,
    merchant: "Momentum Fitness",
    amount: 49,
    dueDate: "2026-04-04T00:00:00.000Z",
    category: "Health",
    status: "Upcoming",
  },
];

export const mockedRoadmap: RoadmapItem[] = [
  {
    id: 1,
    title: "Goal tracking endpoints",
    description: "Persist the savings widgets instead of using local placeholder content.",
    endpoint: "GET/POST/PATCH /api/goals",
    priority: "High",
  },
  {
    id: 2,
    title: "Recurring payment schedule",
    description: "Drive upcoming bill cards from the backend on a per-account basis.",
    endpoint: "GET /api/accounts/{accountId}/recurring-payments",
    priority: "High",
  },
  {
    id: 3,
    title: "Dashboard summary snapshot",
    description: "Return server-side totals for income, spending, savings rate, and net worth.",
    endpoint: "GET /api/dashboard/summary",
    priority: "Medium",
  },
];
