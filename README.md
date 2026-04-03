# Finance Data Processing and Access Control Backend

A backend system for a **finance dashboard** that handles financial records, user roles, access control, and analytics. Built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| Logging | Morgan |

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (local or cloud)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables** — create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/finance_db?schema=public"
   JWT_SECRET="your_secure_jwt_secret"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   ```

3. **Push the database schema**
   ```bash
   npx prisma db push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000`.

> **Note:** The first registered user defaults to the `VIEWER` role. 
> To properly test the application with **Admin** privileges, it is recommended to register as `admin@finance.com` and then elevate your permissions safely using Prisma:
> ```bash
> npx prisma studio
> ```
> *(Navigate to the User table and change your Role from VIEWER to ADMIN)*
---

## Role-Based Access Control (RBAC)

The system enforces three roles. Every protected route checks the JWT token and role before granting access.

| Role | Capabilities |
| :--- | :--- |
| **ADMIN** | Full access — manage users, accounts, categories, and transactions |
| **ANALYST** | Read-only access to records, accounts, categories, and all dashboard data |
| **VIEWER** | Dashboard summary access only — cannot view raw financial records |

### User Status
| Status | Effect |
| :--- | :--- |
| **ACTIVE** | Normal access based on assigned role |
| **INACTIVE** | Login blocked — token generation refused at auth layer |

---

## API Reference

> All endpoints are prefixed with `/api/v1/`

### Authentication
No token required.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user (defaults to VIEWER role) |
| `POST` | `/api/v1/auth/login` | Login and receive a JWT token |

---

### Dashboard
🔒 Requires token — accessible by **all roles**.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/summary` | Total income, total expenses, net balance |
| `GET` | `/api/v1/dashboard/categories` | Spending/income totals grouped by category |
| `GET` | `/api/v1/dashboard/recent` | Last 5 transactions with account details |
| `GET` | `/api/v1/dashboard/trends` | Daily income & expense trends for the last 30 days |

---

### Transactions
🔒 Requires token — **ADMIN** and **ANALYST** only.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/transactions` | ADMIN, ANALYST | List all transactions (supports filtering) |
| `POST` | `/api/v1/transactions` | ADMIN | Create a new transaction |
| `DELETE` | `/api/v1/transactions/:id` | ADMIN | Delete a transaction and revert account balance |

**Filtering query parameters for `GET /api/v1/transactions`:**
| Param | Values | Description |
| :--- | :--- | :--- |
| `type` | `INCOME` / `EXPENSE` | Filter by transaction type |
| `categoryId` | UUID string | Filter by a specific category |
| `startDate` | ISO date string | Start of date range |
| `endDate` | ISO date string | End of date range |

---

### Accounts
🔒 Requires token — **ADMIN** and **ANALYST** only.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/accounts` | ADMIN, ANALYST | List all accounts for the logged-in user |
| `POST` | `/api/v1/accounts` | ADMIN | Create a new account |
| `DELETE` | `/api/v1/accounts/:id` | ADMIN | Delete an account |

---

### Categories
🔒 Requires token — **ADMIN** and **ANALYST** only.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | ADMIN, ANALYST | List all categories for the logged-in user |
| `POST` | `/api/v1/categories` | ADMIN | Create a new category |
| `DELETE` | `/api/v1/categories/:id` | ADMIN | Delete a category |

---

### User Management
🔒 Requires token — **ADMIN** only.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users` | List all users in the system |
| `GET` | `/api/v1/users/:id` | Get a single user by ID |
| `POST` | `/api/v1/users` | Create a user (admin-initiated, sets default password) |
| `PATCH` | `/api/v1/users/:id` | Update role (`ADMIN`/`ANALYST`/`VIEWER`) or status (`ACTIVE`/`INACTIVE`) |
| `DELETE` | `/api/v1/users/:id` | Delete a user |

---

## Project Structure

```
src/
├── common/
│   ├── constants/         # Role enums and error message strings
│   ├── decorators/        # catchAsync — removes try-catch from controllers
│   ├── filters/           # Global HTTP exception handler
│   ├── guards/            # JWT auth guard + role-based authorize
│   ├── interceptors/      # Response interceptor (standardizes response shape)
│   ├── pipes/             # Zod validation pipe
│   └── utils/             # JWT, bcrypt, and Prisma client utilities
│
├── config/
│   └── env.config.ts      # Typed environment variable access
│
├── modules/
│   ├── auth/              # Register & login
│   ├── accounts/          # Bank / cash accounts
│   ├── categories/        # Income & expense categories
│   ├── transactions/      # Financial records with atomic balance updates
│   ├── dashboard/         # Summary, trends, and analytics
│   └── users/             # User and role management
│
└── main.ts                # Application bootstrap
```

---

## Architecture Notes

- **Layered design**: Routes → Controllers → Services → Prisma (no business logic leaks into routes or controllers)
- **catchAsync decorator**: All async controller methods are wrapped — no manual try-catch blocks
- **Response interceptor**: All successful responses follow a standard shape `{ success: true, data, timestamp }`
- **Global error filter**: All errors return `{ success: false, error: { message, status, path, timestamp } }`
- **Atomic balance updates**: Creating or deleting a transaction updates the linked account balance in a single Prisma `$transaction` to prevent data inconsistency

## Tradeoffs & Assumptions

- **Summary aggregation**: Dashboard totals are computed in-memory. For large datasets a production system would use SQL `GROUP BY` aggregations or database views.
- **JWT only**: Tokens are stateless with no refresh mechanism. A production system would add refresh tokens and a revocation list.
- **First Admin**: The first registered user must be manually promoted to `ADMIN` via the database since the self-registration endpoint defaults to `VIEWER`.
