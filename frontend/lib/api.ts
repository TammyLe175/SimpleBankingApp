import {
  Account,
  CreateAccountInput,
  CreateTransactionInput,
  ExpenseSummary,
  Transaction,
} from "@/lib/types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5226" : "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured. Set it in frontend/.env.local and restart the frontend.",
    );
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const bankingApi = {
  getAccounts() {
    return request<Account[]>("/api/accounts");
  },

  getAccount(id: number) {
    return request<Account>(`/api/accounts/${id}`);
  },

  createAccount(payload: CreateAccountInput) {
    return request<Account>("/api/accounts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteAccount(id: number) {
    return request<void>(`/api/accounts/${id}`, {
      method: "DELETE",
    });
  },

  getTransactions(accountId: number, category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return request<Transaction[]>(`/api/accounts/${accountId}/transactions${query}`);
  },

  createTransaction(accountId: number, payload: CreateTransactionInput) {
    return request<Transaction>(`/api/accounts/${accountId}/transactions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getExpenseSummary(accountId: number) {
    return request<ExpenseSummary[]>(`/api/accounts/${accountId}/expenses/summary`);
  },
};

export { apiBaseUrl };
