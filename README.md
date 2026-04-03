# 💎 Nova Finance - Premium MERN Financial Dashboard

Nova Finance is a high-end, "Linear-inspired" financial management platform built with the MERN stack (MongoDB/PostgreSQL, Express, React/Next.js, Node.js). It offers a professional-grade dark mode interface, interactive analytics, and robust role-based access control.

---

## ✨ Features

### 🎨 Premium UI/UX
- **Linear-style Dark Mode**: A sleek, high-contrast interface with glassmorphism, subtle glows, and modern typography (Inter).
- **Responsive Layout**: Optimized for both desktop and mobile viewing with a semi-transparent floating sidebar.
- **Interactive Charts**: Real-time Cash Flow trends powered by Recharts with smooth area gradients.

### 📊 Data & Analytics
- **CSV Export**: Instantly download your transaction history, account summaries, or dashboard activity as spreadsheet-ready CSV files.
- **Smart Stat Cards**: Visual health pulse checks with percentage trends and dynamic icon coloring.
- **Atomic Transactions**: Balance updates are handled atomically using Prisma `$transaction` to ensure 100% data integrity.

### 🔐 Security & Access Control
- **Role-Based Access (RBAC)**: Secure access for `ADMIN`, `ANALYST`, and `VIEWER` roles. 
- **Admin Secret**: Register as an admin immediately by providing a secure `ADMIN_SECRET` during signup.
- **Auth Persistence**: Reliable session management that stays logged in across page refreshes.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, TailwindCSS, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL (Neon.tech), Prisma ORM |
| **Auth** | JWT, bcryptjs |
| **Validation** | Zod |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+
- A Neon.tech (or PostgreSQL) account

### 2. Environment Setup
Create a `.env` file in the **root** and a `.env.local` in the **frontend** directory.

**Root (.env):**
```env
DATABASE_URL="postgresql://user:pass@host:port/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@host:port/neondb?sslmode=require"
JWT_SECRET="your_secret"
JWT_EXPIRES_IN="7d"
PORT=5000
ADMIN_SECRET="admin123"
```

**Frontend (frontend/.env.local):**
```env
NEXT_PUBLIC_API_URL="https://your-api-url.com/api/v1"
```

### 3. Installation & Seeding
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Generate Prisma Client & Push Schema
npx prisma generate
npx prisma db push

# Seed with Premium Dummy Data (Creates Admin Account)
npx prisma db seed
```

### 4. Running Locally
```bash
# Start Backend
npm run dev

# Start Frontend (in a new terminal)
cd frontend
npm run dev
```

---

## 🔑 Default Accounts (Post-Seed)
After running the seed command, you can log in with:
- **Admin:** `admin@finance.com` / `password: admin123`
- **Role:** Full Administrative Access

---

## 📂 Architecture
Nova Finance follows a clean, module-based architecture:
- **`/common`**: Shared constants, guards, pipes, and interceptors.
- **`/modules`**: Feature-specific logic (Auth, Accounts, Transactions, Categories).
- **`/frontend`**: Modern Next.js App Router directory structure.

---

## 📄 License
Distributed under the MIT License.
