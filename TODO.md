# 📋 Personal Ledger Manager — Step-by-Step Modular Roadmap

**Team ID:** `LSH26-T061` | **Problem ID:** `P12` | **Dataset:** `P12_personal_ledger_public.json`

---

## 🎯 Implementation Steps (Modular & Step-by-Step)

### Step 1: Core Domain Types & Pure Math Engines
- [x] **Types (`src/types/`):**
  - `expense.ts` (Expense, Category, MoM delta)
  - `pocket.ts` (SavingsPocket, DPS rule, DPS projection)
  - `forecast.ts` (Burn rate, rest-of-month spend, surplus/deficit)
  - `insights.ts` (Dynamic concrete insights)
  - `whatIf.ts` (Category cut simulation)
  - `dataset.ts` (Schema for 25 competition cases)
- [x] **Pure Calculation Engines (`src/lib/calculations/`):**
  - `dps.ts`: Compound DPS calculation ($\text{interest} = \text{round\_half\_up}(\text{balance} \times \text{rate} / 12 / 100, 2)$)
  - `forecast.ts`: Daily burn rate, projected rest-of-month spending & surplus/deficit
  - `insights.ts`: 3+ concrete insights naming specific categories & exact BDT amounts
  - `recurring.ts`: Auto-detect recurring expenses across last month and this month (same shop, similar amount)
  - `whatIf.ts`: Calculate impact of category percentage cut on surplus and pocket timelines

---

### Step 2: Dataset Loader & Global State Management
- [x] **Dataset Loader (`src/lib/dataset/`):**
  - Load and parse `P12_personal_ledger_public.json` (PUB-01 to PUB-25)
- [x] **State Management (`src/context/LedgerContext.tsx`):**
  - Manage active case, salary, expenses list, pockets list, DPS rate, and selected month
  - Provide actions: `setSalary`, `addExpense`, `updateExpense`, `deleteExpense`, `addPocket`, `updateContribution`, `setWhatIfCut`, `loadCase`

---

### Step 3: Receipt OCR & Upload with Uncertainty Alerts
- [x] **OCR Parser (`src/lib/ocr/receiptParser.ts`):**
  - Extract amount, date, and shop name from uploaded bill/receipt image
  - Assign confidence score to each field
- [x] **Receipt Review UI (`src/components/ocr/ReceiptUploadModal.tsx`):**
  - Clearly flag uncertain fields with warning badges
  - Constraint: Never auto-fill unconfirmed amounts; require user confirmation before saving

---

### Step 4: Monthly Dashboard & Expense Ledger
- [x] **Salary & Spending Card (`src/components/dashboard/SalaryOverview.tsx`):**
  - Salary input, total spent this month, remaining balance, and progress bar
- [x] **Category Breakdown (`src/components/dashboard/CategoryBreakdown.tsx`):**
  - Spending by category with percentage distribution
- [x] **Largest Expenses (`src/components/dashboard/LargestExpenses.tsx`):**
  - Top 5 largest expenses with shop name, date, and amount
- [x] **Month-over-Month Comparison (`src/components/dashboard/MonthlyComparison.tsx`):**
  - Spending change compared to last month per category and total
- [x] **Expense Table (`src/components/expenses/ExpenseTable.tsx`):**
  - Filterable list of all expenses with recurring badges and add/delete actions

---

### Step 5: Rest-of-Month Forecast & Written Insights
- [x] **Forecast Card (`src/components/forecast/ForecastCard.tsx`):**
  - Daily burn rate, projected rest-of-month spend, projected month-end surplus/deficit
- [x] **Written Insights (`src/components/forecast/WrittenInsights.tsx`):**
  - 3+ dynamic, concrete insights naming exact categories and amounts (no static boilerplate)

---

### Step 6: Savings Pockets & DPS Engine (with Bonus 1)
- [x] **Savings Pocket Cards (`src/components/pockets/PocketCard.tsx`):**
  - Pocket name, target amount, item details, monthly contribution
  - Forecast-derived completion date based on available monthly surplus
- [x] **Bonus 1 — Live Contribution Slider:**
  - Change a pocket's monthly contribution and watch completion dates update immediately
- [x] **DPS Return Projection (`src/components/pockets/DPSBreakdownModal.tsx`):**
  - Stated DPS annual rate & monthly compounding interest return over the pocket duration

---

### Step 7: Bonus Features Suite (Bonus 2 & Bonus 3)
- [x] **Bonus 2 — Auto-Recurring Expense Detector:**
  - Automatically flag expenses when same shop and similar amount appears in consecutive months
- [x] **Bonus 3 — What-If Category Cut Simulator (`src/components/simulator/WhatIfSimulator.tsx`):**
  - Interactive slider to cut any category by a percentage and visualize immediate shifts in all pocket completion dates

---

### Step 8: Dataset Case Switcher & Neo-Brutalist Layout
- [x] **Case Switcher (`src/components/layout/Navbar.tsx`):**
  - Quick-select dropdown to load any of the 25 official competition cases (PUB-01 to PUB-25)
- [x] **Neo-Brutalist Layout (`src/app/page.tsx` & `src/app/globals.css`):**
  - Assemble all modular components into a responsive, clean dashboard layout
- [x] **Build & QA Verification:**
  - Verified Next.js build (`npm run build`) with zero errors.


### Step 9: Extra features
- [ ] Auto update typing "lun 500" to category "lunch" spent "500"
- [ ] Camera scan of receipt

