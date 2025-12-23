# System Design & Engineering Decisions

## 1. Project Overview
ExpenseShare is a web-based expense splitting application designed to solve the "Roommate's Dilemma": accurately tracking shared costs and determining the most efficient way to settle debts.

**Goal**: To allow groups of users to share expenses and minimize the total number of transactions required to reach a zero-balance state.

---

## 2. Core Algorithmic Strategy: Debt Simplification

The most critical engineering challenge in this application is the **Debt Simplification**.

### The Problem
In a group of friends, debts often form a complex graph.
*   **A** owes **B** $10.
*   **B** owes **C** $10.
*   **C** owes **A** $10.
*   *Optimized Result*: Nobody owes anything (Circular dependency cancels out).

Without optimization, $30 changes hands. With optimization, $0 changes hands.

### The Solution: Greedy Minimization Strategy
We implemented a **Greedy Algorithm** to simplify debts. This is superior to a brute-force approach (`O(N!)`) or a simple Max-Flow algorithm for this specific use case because:

1.  **Net Balance Calculation**: We first calculate the *Net Balance* for every user.
    *   `Net = Total_Received - Total_Paid`
    *   If `Net > 0`, the user is a **Creditor** (Owed money).
    *   If `Net < 0`, the user is a **Debtor** (Owes money).
2.  **Two-Pointer / Heap Approach**:
    *   We sort Creditors (descending) and Debtors (ascending).
    *   We take the largest Debtor and the largest Creditor.
    *   We match them: The Debtor pays as much as they can to the Creditor.
    *   One of them reaches 0 and is removed. The remainder stays for the next iteration.
3.  **Complexity**: Sorting takes `O(N log N)`, and the matching loop takes `O(N)`. This is highly efficient for typical group sizes (< 50 members).

### Comparison
| Approach | Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **All-Edges Graph** | `O(T)` (Transactions) | Easy to code | Extremely confusing user experience (too many payments). |
| **Min-Cost Max-Flow** | Polynomial | Mathematically optimal | Overkill and hard to implement/debug for this scale. |
| **Greedy (Our Choice)** | `O(N log N)` | Fast, Understandable output | Does not always guarantee the *absolute* minimum transactions but guarantees simplified balances. |

---

## 3. Database Architecture (schema Design)

We used **MongoDB** for its flexibility and document-oriented structure, which fits the hierarchical nature of Expenses and Splits.

### Schema Choices (Normalization vs. Performance)

#### User Collection
*   **Fields**: `name`, `email`.
*   **Reasoning**: Kept lightweight. Authentication is simulated via email lookup for MVP simplicity.

#### Group Collection
*   **Fields**: `name`, `members` (Array of ObjectId).
*   **Decision**: We store references to Users, not embedded objects. This ensures that if a User updates their name, it reflects across all Groups (Single Source of Truth).

#### Expense Collection
*   **Fields**: `payer` (User Ref), `amount`, `splits` (Array of {user, amount}).
*   **Critical Decision**: **The Ledger Model**.
    *   We do **not** store "Current Balance" on the User object.
    *   Instead, we treat Expenses as an immutable **Ledger**.
    *   **Why?** Storing `currentBalance` is prone to drift and race conditions. Calculating balance on-the-fly (`getGroupBalance`) guarantees 100% data consistency. It trades read-performance for write-reliability, which is the correct trade-off for financial apps.

---

## 4. API Design & Security

### Consistency
We utilized **RESTful** principles.
*   `GET /groups/:id` - Idempotent read.
*   `POST /expenses` - Creation.

### Security Implementation (Role-Based Logic)
One subtle but important design choice was in the **Settlement Flow**.
*   **Vulnerability**: In a naive implementation, User A could say "I paid User B" and settle the debt unilaterally.
*   **Our Fix**: The UI logic strictly enforces that **only the Receiver** (or the Debtor confirming payment) can initiate the settlement status change.
    *   *Implementation*: `GroupDetails.jsx` checks `currentUser._id === debt.from.id` before showing the "Pay" button.

---

## 5. UI/UX Philosophy

The frontend is not just a display layer; it is an active state manager.

### Frame Motion & Perceived Performance
We used **Framer Motion** (`AnimatePresence`, `layoutId`) extensively.
*   **Why?**: Expenses lists don't just "jump"; they slide in. This creates a perception of higher quality and smooths out the milliseconds of latency during API calls.
*   **Staggered Loading**: Dashboard items load with a slight delay (`staggerChildren`), guiding the user's eye naturally from top-left (Stats) to center (Groups).

### Clean Slate Aesthetics
We moved away from "Bootstrap-style" crowded interfaces to a "Clean Slate" design:
*   **Whitespace**: Used to separate logical groups (Balances vs Expenses).
*   **Visual Hierarchy**: Currency amounts are always the boldest element, as they are the primary data point users care about.

---

## 6. Future Roadmap (Production Readiness)

If this were going to production with 1M users, we would add:

1.  **Authentication**: Replace email lookup with **JWT (JSON Web Tokens)** and `bcrypt` password hashing.
2.  **Caching**: The `getGroupBalance` aggregation is expensive. We would cache the result in **Redis** and invalidate the cache only when a new Expense is added to that Group.
3.  **Concurrency Control**: Implement **Optimistic Locking** (`version` field in Mongoose) to prevent two users from editing an expense at the exact same millisecond.
