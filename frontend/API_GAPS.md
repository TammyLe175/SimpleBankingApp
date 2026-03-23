# Backend API Gaps For The Frontend

The frontend uses these live endpoints today:

- `GET /api/accounts`
- `GET /api/accounts/{id}`
- `POST /api/accounts`
- `DELETE /api/accounts/{id}`
- `GET /api/accounts/{accountId}/transactions`
- `POST /api/accounts/{accountId}/transactions`
- `GET /api/accounts/{accountId}/expenses/summary`

The frontend currently mocks the features below because there is no matching backend endpoint yet.

## 1. Goals and savings targets

Suggested endpoints:

- `GET /api/goals`
- `POST /api/goals`
- `PATCH /api/goals/{goalId}`
- `DELETE /api/goals/{goalId}`

Suggested response shape:

```json
[
  {
    "id": 1,
    "title": "Emergency Fund",
    "targetAmount": 12000,
    "currentAmount": 7800,
    "targetDate": "2026-11-01T00:00:00Z",
    "status": "OnTrack"
  }
]
```

## 2. Recurring bills

Suggested endpoint:

- `GET /api/accounts/{accountId}/recurring-payments`

Suggested response shape:

```json
[
  {
    "id": 1,
    "merchant": "City Energy",
    "amount": 128.42,
    "dueDate": "2026-03-28T00:00:00Z",
    "category": "Utilities",
    "status": "Upcoming"
  }
]
```

## 3. Portfolio overview / dashboard summary

Suggested endpoint:

- `GET /api/dashboard/summary`

Suggested response shape:

```json
{
  "netWorth": 18240.21,
  "monthlyIncome": 6400,
  "monthlySpending": 3915.42,
  "savingsRate": 38.8,
  "activeAccounts": 4
}
```
