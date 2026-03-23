# BankingApp

A full-stack sample banking application with a layered ASP.NET Core Web API backend and a modern Next.js frontend dashboard.

This project demonstrates:
- Clean backend separation (`Domain`, `Application`, `Infrastructure`, `WebApi`)
- Account and transaction management with SQLite persistence
- Expense summary aggregation by category
- A polished frontend that consumes live API endpoints and highlights future backend roadmap items

## Project Overview

The app is split into two main parts:
- `backend/` - .NET 10 solution projects for API and business logic
- `frontend/` - Next.js 15 + React 19 UI

### Implemented features
- Create, list, get, and delete accounts
- Create and list account transactions
- Prevent withdrawals that exceed account balance
- Expense summary endpoint (`category`, `total`, `count`)
- Unit test coverage for account service behavior

### Frontend status
The frontend uses live API calls for account and transaction flows. Some dashboard modules (goals, recurring bills, and parts of roadmap/summary) are intentionally mocked until matching backend endpoints are added.

## Architecture

Backend follows a layered architecture:
- `BankingApp.Domain`: Core entities and repository/unit-of-work contracts
- `BankingApp.Application`: DTOs and service-level business rules
- `BankingApp.Infrastructure`: EF Core + SQLite, repositories, dependency injection wiring
- `BankingApp.WebApi`: Controllers, startup configuration, Swagger, CORS
- `BankingApp.UnitTests`: xUnit tests

Data store:
- SQLite (`Data Source=banking.db`)
- Database is auto-created at API startup via `EnsureCreated()`

## Tech Stack

Backend:
- .NET 10 (`net10.0`)
- ASP.NET Core Web API
- Entity Framework Core 10 + SQLite
- Swashbuckle (Swagger)
- xUnit

Frontend:
- Next.js 15
- React 19
- TypeScript

## API Endpoints

Base URL (local): `http://localhost:5226`

### Accounts
- `GET /api/accounts`
- `GET /api/accounts/{id}`
- `POST /api/accounts`
- `DELETE /api/accounts/{id}`

Create account payload:

```json
{
  "name": "Primary Checking",
  "accountType": "Checking"
}
```

### Transactions
- `GET /api/accounts/{accountId}/transactions`
- `GET /api/accounts/{accountId}/transactions?category=Food`
- `POST /api/accounts/{accountId}/transactions`
- `GET /api/accounts/{accountId}/expenses/summary`

Create transaction payload:

```json
{
  "amount": 125.50,
  "type": "Withdrawal",
  "category": "Groceries",
  "description": "Weekly groceries"
}
```

Validation behavior:
- `amount` must be greater than `0`
- `type` must be `Deposit` or `Withdrawal`
- Withdrawal fails if balance is insufficient

## Getting Started

### 1) Prerequisites
- .NET 10 SDK
- Node.js 20+
- npm

### 2) Clone and open

```bash
git clone <your-repo-url>
cd BankingApp
```

### 3) Run the backend API

```bash
cd backend/BankingApp.WebApi
dotnet restore
dotnet run
```

The API runs on `http://localhost:5226` (from launch settings).

Swagger UI (Development only):
- `http://localhost:5226/swagger`

### 4) Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:
- `http://localhost:3000`

### Frontend-to-backend proxy
By default, frontend API requests go to `/api-proxy`, which rewrites to `http://localhost:5226`.

You can override backend target with:

```bash
BACKEND_API_BASE_URL=http://localhost:5226 npm run dev
```

Or set the browser-side API base directly (optional):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5226 npm run dev
```

## Testing

Run backend tests:

```bash
cd backend
dotnet test
```

## Project Structure

```text
BankingApp/
├── BankingApp.sln
├── backend/
│   ├── BankingApp.Domain/
│   ├── BankingApp.Application/
│   ├── BankingApp.Infrastructure/
│   ├── BankingApp.WebApi/
│   └── BankingApp.UnitTests/
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    └── API_GAPS.md
```

## Known Gaps / Roadmap

See `frontend/API_GAPS.md` for suggested future backend endpoints used by planned frontend features:
- Goals and savings targets
- Recurring payments
- Dashboard summary

## Notes

- CORS is configured for localhost development origins.
- Database is currently created automatically at startup; for production, prefer EF Core migrations and environment-specific configuration.
