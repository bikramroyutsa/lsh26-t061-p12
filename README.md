# Personal Ledger Manager

> **Team ID:** `LSH26-T061`  
> **Problem ID:** `P12`  
> **Repository:** `lsh26-t061-p12`  
> **Design Theme:** Neo-Brutalism (Bold borders, vibrant accents, crisp contrast)  
> **Framework:** Next.js (App Router, TypeScript, React 19)

---

## 📌 Problem Overview & Context

A salaried professional living and working in Dhaka receives a steady paycheck every month, but struggles to track where their money actually goes. Expenses are scattered across paper cash memos (groceries from Meena Bazar, Agora, Aarong), utility bills (DESCO, Dhaka WASA), mobile recharges (GP, Robi, Banglalink), and screenshots of mobile financial services (bKash, Nagad). Typically, spending reviews only happen on the final day of the month when funds have already run dry and corrective action is impossible.

Furthermore, long-term savings goals (buying a laptop like MacBook Air M4, saving for a Honda Livo motorcycle, paying a wedding reception hall advance, or holiday trips) remain vague aspirations without concrete completion dates.

### The Solution

The **Personal Ledger Manager** provides:
1. **Frictionless Expense Recording & OCR:** Smart bill & receipt scanner (with uncertainty alerts) allowing instant extraction of date, shop name, amount, and category with full editability before saving.
2. **Comprehensive Monthly Dashboard:** Real-time tracking of total spent vs. monthly salary, category-by-category breakdown, largest expenses, and month-over-month (MoM) comparative deltas.
3. **Rest-of-Month Forecast & Dynamic Written Insights:** Statistical forecast estimating remaining spending for the month and month-end net balance (surplus/deficit). Provides dynamic, concrete written insights naming specific categories and exact amounts (no generic boilerplate advice).
4. **Savings Pockets & DPS Compounding Engine:** Goal-oriented savings pockets with target amounts and monthly contributions. Expected completion dates are mathematically derived directly from the real-time forecast rather than naive division. Integrates a compound DPS (Deposit Pension Scheme) calculator based on Bangladeshi banking standards.
5. **Bonus Features (100% Implemented):**
   - **Live Dynamic Contribution Slider:** Adjust any pocket's monthly contribution and watch all target dates shift reactively.
   - **Auto-Recurring Expense Detector:** Automatically flags recurring monthly commitments (same shop and similar amount across consecutive months).
   - **"What-If" Category Cut Scenario Simulator:** Interactive slider cutting any expense category by a given percentage to visualize immediate impacts on month-end surplus and savings pocket timelines.

---

## 🧮 Mathematical & Financial Formulas

### 1. DPS (Deposit Pension Scheme) Compound Interest Calculation
As defined by Bangladesh bank standards and the competition specification:
- **Annual Interest Rate ($R$):** Expressed as a percentage (e.g., $8.00\%$).
- **Monthly Compounding Rule:**
  $$\text{Balance}_{m} = \text{Balance}_{m-1} + \text{Deposit}$$
  $$\text{Interest}_{m} = \text{round\_half\_up}\left(\frac{\text{Balance}_{m} \times R}{12 \times 100}, 2\right)$$
  $$\text{New Balance}_{m} = \text{Balance}_{m} + \text{Interest}_{m}$$
  *(Interest is added to the balance monthly, earning compounding returns in subsequent months).*

### 2. Rest-of-Month Expense Forecasting
- Given current date $d$ in a month with $D$ total days:
  - Elapsed days: $d$
  - Remaining days: $D - d$
  - Current total spent: $S_{\text{elapsed}}$
  - Daily burn rate: $B = \frac{S_{\text{elapsed}}}{d}$
  - Expected remaining spending: $S_{\text{remaining}} = B \times (D - d)$
  - Total forecasted monthly expense: $S_{\text{total\_forecast}} = S_{\text{elapsed}} + S_{\text{remaining}}$
  - Projected month-end surplus / deficit: $\Delta_{\text{savings}} = \text{Salary} - S_{\text{total\_forecast}}$

### 3. Forecast-Driven Savings Pocket Completion Dates
Pocket completion is constrained by the actual monthly surplus capacity ($\Delta_{\text{savings}}$):
- Available monthly savings allocation: $A_{\text{avail}} = \max(0, \Delta_{\text{savings}})$
- Total monthly contribution committed: $C_{\text{total}} = \sum C_i$
- Effective monthly funding rate for pocket $i$:
  $$R_i = \min\left(C_i, C_i \times \frac{A_{\text{avail}}}{C_{\text{total}}}\right) \quad \text{if } C_{\text{total}} > 0$$
- Estimated months to reach target $T_i$ with starting balance $B_0$:
  $$M_i = \left\lceil \frac{T_i - B_0}{R_i} \right\rceil$$
- Completion Date: Computed by advancing $M_i$ months from the current active month.

### 4. Auto-Recurring Bill Detection
An expense is automatically tagged as recurring when:
- $\text{Shop}_{\text{this\_month}} == \text{Shop}_{\text{last\_month}}$
- $\frac{|\text{Amount}_{\text{this}} - \text{Amount}_{\text{last}}|}{\max(\text{Amount}_{\text{this}}, \text{Amount}_{\text{last}})} \le 0.05$ (within $5\%$ variance or exact match)

### 5. "What-If" Category Optimization
Cutting category $K$ by $P\%$ ($0 \le P \le 100$):
- Forecasted reduction: $\delta_K = S_{\text{forecast}, K} \times \frac{P}{100}$
- New surplus: $\Delta'_{\text{savings}} = \Delta_{\text{savings}} + \delta_K$
- New completion dates recalculated instantly across all active pockets.

---

## 🏗️ 100% Modular Architecture & Directory Tree

```
lsh26-t061-p12/
├── EVENT.md                             # Official competition event record
├── README.md                            # Comprehensive system documentation
├── TODO.md                              # Modular step-by-step roadmap
├── P12_personal_ledger_public.json      # Official dataset (25 public test cases)
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
├── next.config.ts                       # Next.js configuration
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx                   # Root layout (Neo-Brutalist typography & shell)
│   │   ├── page.tsx                     # Main Ledger Application Dashboard
│   │   └── globals.css                  # Global styles & Neo-Brutalist design tokens
│   │
│   ├── types/                           # Strict TypeScript Domain Definitions
│   │   ├── index.ts                     # Barrel export for all types
│   │   ├── expense.ts                   # Expense, Category, Shop types
│   │   ├── pocket.ts                    # Savings Pocket, DPS rules & projections
│   │   ├── forecast.ts                  # Forecast results & metric comparisons
│   │   ├── insights.ts                  # Concrete written insight definitions
│   │   ├── whatIf.ts                    # What-If scenario simulation types
│   │   └── dataset.ts                   # Competition JSON schema types
│   │
│   ├── lib/                             # Pure Core Business Logic (100% Unit Tested)
│   │   ├── calculations/
│   │   │   ├── dps.ts                   # DPS monthly compounding & return calculator
│   │   │   ├── forecast.ts              # Burn-rate & rest-of-month projection engine
│   │   │   ├── insights.ts              # Dynamic concrete Dhaka insight generator
│   │   │   ├── recurring.ts             # 2-month recurring expense auto-detector
│   │   │   └── whatIf.ts                # Category cut scenario simulator
│   │   │
│   │   ├── ocr/
│   │   │   ├── receiptParser.ts         # Bangladeshi receipt & bill parser with confidence
│   │   │   └── types.ts                 # OCR extraction interfaces & uncertainty flags
│   │   │
│   │   ├── dataset/
│   │   │   ├── loader.ts                # Competition case loader (PUB-01 to PUB-25)
│   │   │   └── validator.ts             # Dataset integrity checker
│   │   │
│   │   └── storage/
│   │       └── localStorage.ts          # State persistence adapter
│   │
│   ├── context/                         # Reactive State Management
│   │   └── LedgerContext.tsx            # Global ledger state provider & dispatchers
│   │
│   └── components/                      # Modular UI Components (Neo-Brutalism)
│       ├── ui/                          # Reusable Neo-Brutalist primitives
│       │   ├── Button.tsx               # High-contrast action button with crisp shadow
│       │   ├── Card.tsx                 # Solid-bordered container with box-shadow
│       │   ├── Input.tsx                # Styled inputs with bold outlines
│       │   ├── Modal.tsx                # Accessible backdrop dialog
│       │   ├── Slider.tsx               # Interactive range input with live tick labels
│       │   ├── Badge.tsx                # Category & status pills
│       │   └── ProgressBar.tsx          # High-visibility budget & goal progress bars
│       │
│       ├── dataset/                     # Official Benchmark Runner
│       │   └── CaseSelector.tsx         # Instant switcher for 25 competition test cases
│       │
│       ├── dashboard/                   # Primary Metric & Visual Overview
│       │   ├── SalaryOverview.tsx       # Salary setter, total spent, & remaining balance
│       │   ├── CategoryBreakdown.tsx    # Visual category distribution & percentage
│       │   ├── LargestExpenses.tsx      # Top ranked spending items with merchant info
│       │   └── MonthlyComparison.tsx    # Last month vs. this month delta breakdown
│       │
│       ├── ocr/                         # Receipt Upload & Intelligent OCR
│       │   ├── ReceiptUploadModal.tsx   # Drag-and-drop file upload & preview
│       │   └── OCRVerificationForm.tsx  # Editable review form highlighting uncertain fields
│       │
│       ├── expenses/                    # Expense Ledger & History
│       │   ├── ExpenseTable.tsx         # Searchable, filterable list with recurring badges
│       │   ├── AddExpenseModal.tsx      # Manual quick entry form
│       │   └── RecurringExpenses.tsx    # Auto-detected recurring subscriptions & bills
│       │
│       ├── forecast/                    # Projections & Written Insights
│       │   ├── ForecastCard.tsx         # Remaining days burn-rate & month-end projection
│       │   └── WrittenInsights.tsx      # Concrete, dynamic Dhaka-specific written insights
│       │
│       ├── pockets/                     # Goal Savings & DPS Engine
│       │   ├── PocketList.tsx           # Savings pocket cards with interactive sliders
│       │   ├── PocketCard.tsx           # Target progress, forecast completion date, DPS yield
│       │   ├── CreatePocketModal.tsx    # Add new savings target
│       │   └── DPSBreakdownModal.tsx    # Month-by-month compound interest breakdown
│       │
│       └── simulator/                   # Interactive Decision Tool
│           └── WhatIfSimulator.tsx      # Category cut simulator with reactive timeline shifts
```

---

## 🚀 Getting Started & Execution

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
# Navigate to http://localhost:3000
```

### Running Test Verification
To verify the financial calculation engine, DPS formula, forecasting, and recurring detection against all 25 competition cases:

```bash
npm test
```

---

## ⚖️ Competition Rules & Constraints Compliance Checklist

- [x] **Event Record:** `EVENT.md` created with Team ID `LSH26-T061`, Problem ID `P12`, Start Code `LSH26-8490-C900`.
- [x] **Frictionless Expense Entry & OCR:** Upload receipts/bills, detect amount/date/shop, clear uncertainty flagging, full pre-save editability.
- [x] **Monthly Dashboard:** Salary comparison, category breakdown, largest expenses, MoM change.
- [x] **Dynamic Forecast & Written Insights:** Expected rest-of-month spending, month-end surplus/deficit, 3+ non-generic concrete insights with exact numbers and categories.
- [x] **Savings Pockets & DPS Calculator:** Goal-oriented pockets, forecast-derived completion dates, compound monthly DPS interest with explicit stated rate.
- [x] **Bonus 1:** Real-time completion date shifts on pocket contribution change.
- [x] **Bonus 2:** Auto-detection of recurring expenses across consecutive months.
- [x] **Bonus 3:** What-If category cut slider showing reactive impact on all goals.
