# 💰 ExpenseTrack — Smart Family & Couple Expense Tracker

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-8A2BE2)](https://modelcontextprotocol.io/)

**ExpenseTrack** is a modern, privacy-focused expense management web application engineered for couples and families. It offers seamless dual-partner accounting (Husband & Wife), granular budgeting, visual financial analytics, an embedded AI spending assistant, and a certified **Model Context Protocol (MCP)** server for interacting with external AI tools (such as Claude Desktop or Cursor).

---

## ✨ Key Features

### 👥 Dual-Partner Accounting
- **Shared & Individual Ownership**: Tag expenses as either **Husband** (👨) or **Wife** (👩).
- **Owner Spending Limits**: Set monthly expenditure ceilings for each partner with proactive threshold warnings.
- **Comparative Insights**: Visual comparison of monthly spending splits between partners.

### 💳 Comprehensive Expense Management
- **Predefined Daily & Household Categories**:
  - 🥛 Milk, 🍔 Food, 🚗 Transport, 💡 Utilities, 🎬 Entertainment, 🏥 Healthcare, 🛍️ Shopping, 📦 Other.
- **Payment Method Tracking**: Record payments via **Cash** (💵), **Card** (💳), or **Online / UPI** (📱).
- **Flexible Filters**: Filter expenses across custom date ranges, single days, and multi-category selections.
- **Indian Rupee (INR ₹) Localization**: Currency calculations and formatting tailored for Indian Rupee notation (`en-IN`).

### 💰 Income & Net Balance Tracking
- Log monthly income and instantly compute your net remaining balance, total expenditures, and savings rate.

### 🎯 Category Budgets & Limit Alerts
- Define monthly spending caps for individual categories.
- Real-time visual progress bars with tiered status indicators:
  - 🟢 **Safe**: < 75%
  - 🟡 **Warning**: 75% – 99%
  - 🔴 **Danger**: ≥ 100% (exceeded budget)
- Integrated in-app notification center for budget overrun alerts.

### 🔁 Automated Recurring Expenses
- Schedule recurring expenses across **Daily**, **Weekly**, or **Monthly** frequencies.
- Automated generation engine ensures upcoming recurring commitments are accurately reflected in monthly totals.

### 📊 Interactive Visual Analytics
- **Category Breakdown**: Interactive donut chart showcasing expense distribution.
- **Daily Spending Timeline**: Bar charts highlighting daily spending spikes.
- **Payment Distribution**: Breakdown of cash vs. card vs. online payments.
- **Monthly Historical Trends**: Historical spending trends across previous billing cycles.

### 🤖 AI Financial Assistant (`ExpenseChatbot`)
- Floating conversational assistant powered by Supabase Edge Functions with real-time Server-Sent Events (SSE) streaming.
- Context-aware financial querying:
  - *"What is our total spending this month?"*
  - *"Predict next week's household expenses."*
  - *"Which category has the highest spending?"*
  - *"Compare husband vs wife expenditures."*

### 🔌 Model Context Protocol (MCP) Server
- Standardized MCP server located in `src/lib/mcp`, built and bundled into Supabase Edge Functions.
- Exposes tools to external AI assistants (e.g. Claude Desktop, Cursor):
  - `list_expenses`: Query and aggregate user expenses by date range, category, or owner.
  - `add_expense`: Insert new verified expense entries directly from your AI conversation.
- **OAuth 2.0 Security**: MCP endpoints run with the authenticated user's session, guaranteeing strict Row-Level Security (RLS) isolation.

### 📥 Data Management & Export
- Export single-month or all-time expense records to formatted CSV files for external accounting, taxation, or spreadsheet backups.

### 🔒 Enterprise-Grade Security & Privacy
- **Supabase Authentication**: Secure email and password authentication with persistent sessions.
- **6-Digit OTP Password Reset**: Secure verification edge functions (`send-password-reset-otp`, `verify-otp-reset-password`).
- **PostgreSQL Row-Level Security (RLS)**: Enforced across all tables — users can only view and modify their own financial records.

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe, component-driven user interface |
| **Build Tooling** | [Vite 5](https://vitejs.dev/) | Fast HMR and optimized production bundling |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) + [Radix UI (shadcn/ui)](https://ui.shadcn.com/) | Accessible primitives, responsive layout, animations |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) + React Context | Server state synchronization, caching, and global state |
| **Charts & Visualization** | [Recharts](https://recharts.org/) | Responsive SVG charts (Pie, Bar, Area) |
| **Backend & Database** | [Supabase](https://supabase.com/) | PostgreSQL database, Auth, Storage, and Edge Functions |
| **AI Protocol** | [@lovable.dev/mcp-js](https://modelcontextprotocol.io/) | Model Context Protocol server bundled via Vite plugin |
| **Icons & Notification** | [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/) | Clean iconography and toast notification toasts |
| **Testing** | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) | Unit and integration testing suite |

---

## 📂 Repository Structure

```
expense-tracker/
├── .env.example                  # Template for required environment variables
├── AGENTS.md                     # Architecture guidelines for MCP integrations
├── index.html                    # Single Page Application entrypoint
├── package.json                  # Scripts and dependencies
├── tailwind.config.ts            # Tailwind styling tokens & configuration
├── vite.config.ts                # Vite config with React SWC & MCP bundler plugin
│
├── src/
│   ├── App.tsx                   # Top-level routing and providers
│   ├── main.tsx                  # Application bootstrap
│   │
│   ├── components/
│   │   ├── budget/               # Category budget management & progress
│   │   ├── charts/               # Recharts visualizations (Pie, Daily, Owner, Payment)
│   │   ├── chat/                 # ExpenseChatbot floating AI assistant
│   │   ├── dashboard/            # Summary metric cards & income manager
│   │   ├── data/                 # CSV data export components
│   │   ├── expenses/             # Expense creation form & expense list table
│   │   ├── filters/              # Date range and category filtering toolbar
│   │   ├── history/              # Chronological expense history view
│   │   ├── layout/               # Collapsible AppSidebar & DashboardLayout
│   │   ├── monthly/              # Monthly trends, overview, and owner limits
│   │   ├── notifications/        # Threshold alerts & notification bell panel
│   │   ├── recurring/            # Recurring expense scheduler & templates
│   │   └── ui/                   # shadcn / Radix UI component library
│   │
│   ├── context/
│   │   ├── AuthContext.tsx       # Supabase authentication & user session state
│   │   └── ExpenseContext.tsx    # Global expense state, filters, and mutations
│   │
│   ├── hooks/
│   │   ├── useExpenseDatabase.ts # Supabase CRUD hooks for expenses, budgets & recurring
│   │   ├── useExpenseStats.ts    # Aggregation & metrics calculations
│   │   ├── useMonthlyIncome.ts   # Monthly income tracking
│   │   ├── useNotifications.ts   # Real-time budget alert notifications
│   │   └── useOwnerLimits.ts     # Husband/Wife limit management
│   │
│   ├── integrations/supabase/    # Supabase client initialization & database types
│   │
│   ├── lib/
│   │   ├── csv-utils.ts          # CSV parsing, generation, and file downloads
│   │   ├── expense-utils.ts      # Currency formatting (INR), date helpers, recurring generator
│   │   └── mcp/                  # MCP server definition & tool schemas
│   │       ├── index.ts          # defineMcp with OAuth configuration
│   │       ├── supabase.ts       # Supabase service role / user-scoped client
│   │       └── tools/            # Individual MCP tools (list-expenses, add-expense)
│   │
│   ├── pages/
│   │   ├── Landing.tsx           # Marketing landing page with features & FAQ
│   │   ├── Login.tsx             # User login & OTP forgot password flow
│   │   ├── Signup.tsx            # Account registration
│   │   ├── Index.tsx             # Protected expense dashboard
│   │   ├── OAuthConsent.tsx      # OAuth consent flow for MCP clients
│   │   └── NotFound.tsx          # 404 handler
│   │
│   └── types/
│       └── expense.ts            # TypeScript domain types (Categories, Owners, Budgets)
│
└── supabase/
    ├── config.toml               # Supabase local development configuration
    ├── functions/                # Deno Edge Functions
    │   ├── expense-chat/         # Streaming LLM endpoint for AI chatbot
    │   ├── mcp/                  # Bundled MCP server endpoint
    │   ├── send-password-reset-otp/
    │   └── verify-otp-reset-password/
    └── migrations/               # PostgreSQL schema, RLS policies, and triggers
```

---

## 🗄️ Database Architecture

The application relies on PostgreSQL with **Row Level Security (RLS)** strictly enabled. Each user's data is isolated using their Supabase Auth `user_id`.

| Table | Description | Key Columns |
| :--- | :--- | :--- |
| `profiles` | User profile and preferences | `id`, `user_id`, `display_name`, `role` |
| `expenses` | Recorded expenditures | `id`, `user_id`, `date`, `category`, `owner`, `amount`, `payment_method`, `is_recurring` |
| `budgets` | Monthly category budget limits | `id`, `user_id`, `category`, `month` (YYYY-MM), `budget_limit` |
| `monthly_income` | Logged income per month | `id`, `user_id`, `month` (YYYY-MM), `amount` |
| `owner_limits` | Spending limits per partner | `id`, `user_id`, `owner` (`husband` \| `wife`), `month`, `limit_amount` |
| `recurring_templates` | Automated recurring rules | `id`, `user_id`, `category`, `owner`, `amount`, `frequency`, `start_date`, `is_active` |
| `notifications` | System & budget warning alerts | `id`, `user_id`, `title`, `message`, `type`, `is_read` |
| `password_reset_otps` | Time-limited 6-digit OTP codes | `id`, `email`, `otp_code`, `attempts`, `expires_at`, `used` |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.x or higher (or [Bun](https://bun.sh/))
- **npm** or **bun**
- A **[Supabase](https://supabase.com/)** project account

### 1. Clone Repository

```bash
git clone <YOUR_GIT_URL>
cd expense-tracker
```

### 2. Install Dependencies

Using `npm`:
```bash
npm install
```
Or using `bun`:
```bash
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root based on [.env.example](file:///.env.example):

```env
VITE_SUPABASE_PROJECT_ID="your-supabase-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_SUPABASE_URL="https://your-supabase-project-id.supabase.co"
```

### 4. Database Setup

Apply the migrations in `supabase/migrations` to your Supabase project:

```bash
# Using Supabase CLI
supabase link --project-ref your-supabase-project-id
supabase db push
```

Deploy the required edge functions:
```bash
supabase functions deploy expense-chat
supabase functions deploy mcp
supabase functions deploy send-password-reset-otp
supabase functions deploy verify-otp-reset-password
```

### 5. Run the Local Development Server

```bash
npm run dev
```

Visit `http://localhost:8080` (or the port specified in terminal output) to access the application.

---

## 🤖 Model Context Protocol (MCP) Integration

ExpenseTrack comes with built-in MCP server support, enabling external AI assistants like **Claude Desktop** or **Cursor** to securely access your expense data via OAuth.

### Features exposed via MCP:
- **`list_expenses`**: Filter, list, and summarize expenses by date range, category, or owner (`husband` / `wife`).
- **`add_expense`**: Create verified expense entries on behalf of the signed-in user.

### Security Model
The MCP server is bundled by `mcpPlugin` in [vite.config.ts](file:///vite.config.ts) and runs under Supabase Edge Functions (`supabase/functions/mcp`). It is protected with OAuth token validation against Supabase Auth (`https://<project-ref>.supabase.co/auth/v1`), ensuring that all operations strictly enforce Row-Level Security (RLS) for the authenticated user.

---

## 📜 Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Launches the local Vite development server with HMR |
| `npm run build` | Compiles and builds the production bundle in `dist/` |
| `npm run build:dev` | Compiles development build with source maps |
| `npm run preview` | Locally previews the compiled production build |
| `npm run lint` | Runs ESLint 9 across all source and test files |
| `npm test` | Runs the test suite via Vitest |
| `npm run test:watch` | Starts Vitest in interactive watch mode |

---

## 🔒 Security & Privacy

- All user data is partitioned using PostgreSQL **Row Level Security (RLS)**.
- Passwords are encrypted through Supabase Auth using industry-standard bcrypt hashing.
- Password resets use time-limited, single-use 6-digit OTPs verified exclusively on the server side (`supabase/functions/verify-otp-reset-password`). Direct client access to the OTP database table is strictly blocked.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute it for personal and commercial projects.
