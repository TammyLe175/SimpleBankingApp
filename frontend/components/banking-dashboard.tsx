"use client";

import { FormEvent, startTransition, useCallback, useEffect, useState } from "react";
import { apiBaseUrl, bankingApi } from "@/lib/api";
import { mockedBills, mockedGoals, mockedRoadmap } from "@/lib/mock-data";
import {
  Account,
  CreateAccountInput,
  CreateTransactionInput,
  ExpenseSummary,
  Transaction,
} from "@/lib/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentage = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

const accountTypeOptions = ["Checking", "Savings", "Investment", "Credit"];
const transactionTypeOptions = ["Deposit", "Withdrawal"];

function formatCurrency(value: number) {
  return currency.format(value);
}

function formatCompactCurrency(value: number) {
  return compactCurrency.format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BankingDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [accountFeedback, setAccountFeedback] = useState("");
  const [transactionFeedback, setTransactionFeedback] = useState("");
  const [accountError, setAccountError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [createAccountForm, setCreateAccountForm] = useState<CreateAccountInput>({
    name: "",
    accountType: "Checking",
  });
  const [createTransactionForm, setCreateTransactionForm] = useState<CreateTransactionInput>({
    amount: 0,
    type: "Withdrawal",
    category: "",
    description: "",
  });

  const refreshAccounts = useCallback(
    async (preferredAccountId?: number) => {
      setIsLoadingAccounts(true);
      setAccountError("");

      try {
        const nextAccounts = await bankingApi.getAccounts();
        setAccounts(nextAccounts);

        if (nextAccounts.length === 0) {
          setSelectedAccountId(null);
        } else if (preferredAccountId && nextAccounts.some((account) => account.id === preferredAccountId)) {
          setSelectedAccountId(preferredAccountId);
        } else if (!selectedAccountId || !nextAccounts.some((account) => account.id === selectedAccountId)) {
          setSelectedAccountId(nextAccounts[0].id);
        }
      } catch (error) {
        setAccountError(getErrorMessage(error));
      } finally {
        setIsLoadingAccounts(false);
      }
    },
    [selectedAccountId],
  );

  const refreshAccountActivity = useCallback(async (accountId: number) => {
    setIsLoadingActivity(true);
    setActivityError("");

    try {
      const [nextTransactions, nextExpenseSummary] = await Promise.all([
        bankingApi.getTransactions(accountId),
        bankingApi.getExpenseSummary(accountId),
      ]);

      setTransactions(nextTransactions);
      setExpenseSummary(nextExpenseSummary);
    } catch (error) {
      setActivityError(getErrorMessage(error));
    } finally {
      setIsLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    void refreshAccounts();
  }, [refreshAccounts]);

  useEffect(() => {
    if (selectedAccountId === null) {
      setTransactions([]);
      setExpenseSummary([]);
      return;
    }

    void refreshAccountActivity(selectedAccountId);
  }, [selectedAccountId, refreshAccountActivity]);

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountFeedback("");
    setAccountError("");

    try {
      const createdAccount = await bankingApi.createAccount(createAccountForm);
      setCreateAccountForm({
        name: "",
        accountType: "Checking",
      });
      setAccountFeedback(`Created ${createdAccount.name}.`);
      await refreshAccounts(createdAccount.id);
    } catch (error) {
      setAccountError(getErrorMessage(error));
    }
  }

  async function handleCreateTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedAccountId === null) {
      setTransactionFeedback("Create or select an account first.");
      return;
    }

    setTransactionFeedback("");
    setActivityError("");

    try {
      await bankingApi.createTransaction(selectedAccountId, createTransactionForm);
      setCreateTransactionForm({
        amount: 0,
        type: "Withdrawal",
        category: "",
        description: "",
      });
      setTransactionFeedback("Transaction captured.");
      await Promise.all([
        refreshAccounts(selectedAccountId),
        refreshAccountActivity(selectedAccountId),
      ]);
    } catch (error) {
      setActivityError(getErrorMessage(error));
    }
  }

  function handleSelectAccount(accountId: number) {
    startTransition(() => {
      setSelectedAccountId(accountId);
    });
  }

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalDeposits = transactions
    .filter((transaction) => transaction.type === "Deposit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalWithdrawals = transactions
    .filter((transaction) => transaction.type === "Withdrawal")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const savingsRate = totalDeposits > 0 ? (totalDeposits - totalWithdrawals) / totalDeposits : 0;

  return (
    <main className="page-shell">
      <div className="dashboard">
        <section className="hero">
          <div className="panel hero-panel">
            <span className="eyebrow">Northstar Banking Console</span>
            <h1 className="hero-title">Confidence for the money decisions that matter.</h1>
            <p className="hero-copy">
              This Next.js frontend connects to your BankingApp API for accounts, transactions, and expense
              summaries. Strategic planning features are shown as polished mock modules so you can build their
              backend endpoints next without blocking the frontend experience.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#accounts">
                Review accounts
              </a>
              <a className="secondary-button" href="#roadmap">
                Backend roadmap
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <span className="subtle-label">Connected accounts</span>
                <strong>{accounts.length}</strong>
              </div>
              <div className="stat-card">
                <span className="subtle-label">Portfolio balance</span>
                <strong>{formatCompactCurrency(totalBalance)}</strong>
              </div>
              <div className="stat-card">
                <span className="subtle-label">Savings rate</span>
                <strong>{percentage.format(Math.max(savingsRate, 0))}</strong>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="panel hero-panel">
              <span className="pill">Live API</span>
              <div className="balance-figure">{formatCurrency(totalBalance)}</div>
              <p className="muted-copy">
                Total balance across all real accounts returned from <code>{apiBaseUrl}/api/accounts</code>.
              </p>
            </div>

            <div className="panel hero-panel summary-stack">
              <div className="section-heading">
                <div>
                  <h2>Upcoming bills</h2>
                  <p>Mocked until recurring-payment endpoints exist.</p>
                </div>
                <span className="mock-badge">Mock data</span>
              </div>

              <div className="list">
                {mockedBills.map((bill) => (
                  <div className="list-row" key={bill.id}>
                    <div>
                      <strong>{bill.merchant}</strong>
                      <p className="muted-copy">
                        {bill.category} · Due {formatDate(bill.dueDate)}
                      </p>
                    </div>
                    <strong>{formatCurrency(bill.amount)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-grid" id="accounts">
          <div className="stack">
            <div className="panel section-panel">
              <div className="section-heading">
                <div>
                  <h2>Accounts</h2>
                  <p>
                    Backed by <code>GET /api/accounts</code> and <code>GET /api/accounts/{"{id}"}</code>.
                  </p>
                </div>
                <span className="pill">Live API</span>
              </div>

              {accountError ? <div className="inline-message">{accountError}</div> : null}

              {isLoadingAccounts ? (
                <div className="empty-state">Loading accounts from the backend...</div>
              ) : accounts.length === 0 ? (
                <div className="empty-state">
                  No accounts exist yet. Use the account form on the right to create your first one.
                </div>
              ) : (
                <div className="accounts-grid">
                  {accounts.map((account) => (
                    <button
                      className={`account-card ${selectedAccountId === account.id ? "active" : ""}`}
                      key={account.id}
                      onClick={() => handleSelectAccount(account.id)}
                      type="button"
                    >
                      <div className="account-card-header">
                        <div>
                          <h3>{account.name}</h3>
                          <p>{account.accountType}</p>
                        </div>
                        <span className="pill">{selectedAccountId === account.id ? "Selected" : "Available"}</span>
                      </div>

                      <div className="meta-row">
                        <span className="meta-chip">Opened {formatDate(account.createdAt)}</span>
                      </div>

                      <div className="account-balance" style={{ marginTop: "1rem" }}>
                        {formatCurrency(account.balance)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="panel section-panel">
              <div className="section-heading">
                <div>
                  <h2>Activity snapshot</h2>
                  <p>
                    {selectedAccount
                      ? `Live activity for ${selectedAccount.name}.`
                      : "Select an account to explore transactions and category totals."}
                  </p>
                </div>
                {selectedAccount ? <span className="pill">{selectedAccount.accountType}</span> : null}
              </div>

              {activityError ? <div className="inline-message">{activityError}</div> : null}

              {selectedAccount === null ? (
                <div className="empty-state">Create or select an account to view transactions and spending.</div>
              ) : isLoadingActivity ? (
                <div className="empty-state">Loading transactions and expense summary...</div>
              ) : (
                <div className="activity-grid">
                  <div className="transactions-list">
                    {transactions.length === 0 ? (
                      <div className="empty-state">No transactions yet for this account.</div>
                    ) : (
                      transactions.slice(0, 6).map((transaction) => (
                        <div className="transaction-card" key={transaction.id}>
                          <div className="transaction-card-header">
                            <div>
                              <h3>{transaction.description || transaction.category || transaction.type}</h3>
                              <p>
                                {transaction.category || "General"} · {formatDate(transaction.date)}
                              </p>
                            </div>
                            <div
                              className={`transaction-amount ${
                                transaction.type === "Deposit" ? "income" : "expense"
                              }`}
                            >
                              {transaction.type === "Deposit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="expenses-list">
                    <div className="expense-card">
                      <div className="expense-card-header">
                        <div>
                          <h3>Cash flow</h3>
                          <p>Calculated from live transactions for the selected account.</p>
                        </div>
                      </div>

                      <div className="meta-row">
                        <span className="meta-chip">Inflow {formatCurrency(totalDeposits)}</span>
                        <span className="meta-chip">Outflow {formatCurrency(totalWithdrawals)}</span>
                      </div>
                    </div>

                    {expenseSummary.length === 0 ? (
                      <div className="empty-state">No expense categories yet for this account.</div>
                    ) : (
                      expenseSummary.map((item) => (
                        <div className="expense-card" key={item.category}>
                          <div className="expense-card-header">
                            <div>
                              <h3>{item.category || "Uncategorized"}</h3>
                              <p>{item.count} transactions</p>
                            </div>
                            <strong>{formatCurrency(item.total)}</strong>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="stack">
            <div className="panel section-panel">
              <div className="section-heading">
                <div>
                  <h2>Quick actions</h2>
                  <p>Create accounts and post transactions against the live backend.</p>
                </div>
                <span className="pill">Live API</span>
              </div>

              <div className="forms-grid">
                <form className="form-grid" onSubmit={handleCreateAccount}>
                  <div className="field-group">
                    <label htmlFor="account-name">Account name</label>
                    <input
                      id="account-name"
                      onChange={(event) =>
                        setCreateAccountForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Household Checking"
                      required
                      value={createAccountForm.name}
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="account-type">Account type</label>
                    <select
                      id="account-type"
                      onChange={(event) =>
                        setCreateAccountForm((current) => ({
                          ...current,
                          accountType: event.target.value,
                        }))
                      }
                      value={createAccountForm.accountType}
                    >
                      {accountTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      Create account
                    </button>
                  </div>

                  <div className={`feedback ${accountError ? "error" : ""}`}>
                    {accountError || accountFeedback}
                  </div>
                </form>

                <form className="form-grid" onSubmit={handleCreateTransaction}>
                  <div className="field-group">
                    <label htmlFor="transaction-amount">Amount</label>
                    <input
                      id="transaction-amount"
                      min="0.01"
                      onChange={(event) =>
                        setCreateTransactionForm((current) => ({
                          ...current,
                          amount: Number(event.target.value),
                        }))
                      }
                      placeholder="125.00"
                      required
                      step="0.01"
                      type="number"
                      value={createTransactionForm.amount || ""}
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="transaction-type">Type</label>
                    <select
                      id="transaction-type"
                      onChange={(event) =>
                        setCreateTransactionForm((current) => ({
                          ...current,
                          type: event.target.value,
                        }))
                      }
                      value={createTransactionForm.type}
                    >
                      {transactionTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label htmlFor="transaction-category">Category</label>
                    <input
                      id="transaction-category"
                      onChange={(event) =>
                        setCreateTransactionForm((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      placeholder="Groceries"
                      required
                      value={createTransactionForm.category}
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="transaction-description">Description</label>
                    <input
                      id="transaction-description"
                      onChange={(event) =>
                        setCreateTransactionForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Weekend grocery run"
                      required
                      value={createTransactionForm.description}
                    />
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      Add transaction
                    </button>
                    {selectedAccount ? (
                      <span className="pill">Posting to {selectedAccount.name}</span>
                    ) : (
                      <span className="pill pill-danger">Select an account first</span>
                    )}
                  </div>

                  <div className={`feedback ${activityError ? "error" : ""}`}>
                    {activityError || transactionFeedback}
                  </div>
                </form>
              </div>
            </div>

            <div className="panel section-panel">
              <div className="section-heading">
                <div>
                  <h2>Goals in focus</h2>
                  <p>Professional mock cards for the next backend iteration.</p>
                </div>
                <span className="mock-badge">Mock data</span>
              </div>

              <div className="goals-grid">
                {mockedGoals.map((goal) => {
                  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);

                  return (
                    <div className="goal-card" key={goal.id}>
                      <div className="section-heading" style={{ marginBottom: "0.25rem" }}>
                        <div>
                          <h3>{goal.title}</h3>
                          <p>Target by {formatDate(goal.targetDate)}</p>
                        </div>
                        <span className={goal.status === "On Track" ? "pill" : "pill pill-danger"}>
                          {goal.status}
                        </span>
                      </div>

                      <strong>{formatCurrency(goal.currentAmount)}</strong>
                      <p style={{ marginTop: "0.35rem" }}>
                        of {formatCurrency(goal.targetAmount)} goal
                      </p>

                      <div className="goal-progress-track">
                        <div
                          className="goal-progress-fill"
                          style={{ width: `${Math.max(progress * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="roadmap" style={{ marginTop: "1.2rem" }}>
          <div className="section-heading">
            <div>
              <h2>Backend roadmap for mocked features</h2>
              <p>The UI is already wired to consume these once the endpoints exist.</p>
            </div>
            <span className="mock-badge">Next backend tasks</span>
          </div>

          <div className="roadmap-grid">
            {mockedRoadmap.map((item) => (
              <div className="roadmap-card" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="meta-row">
                  <span className="meta-chip">{item.endpoint}</span>
                  <span className="meta-chip">{item.priority} priority</span>
                </div>
              </div>
            ))}
          </div>

          <div className="footer-note">
            Full endpoint notes are documented in <code>frontend/API_GAPS.md</code>. Set{" "}
            <code>NEXT_PUBLIC_API_BASE_URL</code> if your backend runs somewhere other than{" "}
            <code>http://localhost:5226</code>.
          </div>
        </section>
      </div>
    </main>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while talking to the backend.";
}
