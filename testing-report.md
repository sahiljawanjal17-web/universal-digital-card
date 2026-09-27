# Testing & Verification Report

## 1. Test Setup (`npm run test`)
- Runner: Node.js native test runner (`node:test` via `tsx`).
- File: `src/modules/real-estate/lib/math.test.ts`.
- Coverage:
  - **`filter.ts`**: Verifies property filtering criteria (8 facets), `expandBhkSelection`, and sort key validity (5 keys).
  - **`emi.ts`**: Verifies EMI calculations and amortization structure (`calculateEmi`, `emiSummary`, `buildAmortization`).
- Data Source: Dynamically imported from `src/data/roles/real-estate.json` (no hardcoded property mocks).
- Mandatory Assertions Passing:
  - `calculateEmi({principal: 10000000, annualRate: 8.5, tenureYears: 20})` evaluates to ~86,782.
  - `buildAmortization()` correctly asserts that the final year balance is `0` and the sum of all `principalPaid` matches the total loan principal.

## 2. Token Linter (`npm run lint:tokens`)
- Script: `scripts/lint-tokens.ts`.
- Behavior: Recursively scans `src/` (explicitly excluding the `src/ui/` directory) and fails (exit code 1) if it finds:
  - Raw Tailwind colors (e.g., `bg-blue-500`, `text-white`).
  - Hardcoded role conditionals (e.g., `role === 'real-estate'`).

## 3. CI/CD Verification Pipeline (`npm run verify`)
- Chained Pipeline: `tsc --noEmit && eslint . && npm run validate:config && npm run contrast && npm run lint:tokens && npm run test`.
- Status: **GREEN** (Passing). All type checks, ESLint rules, and tests successfully pass in the current state.

All changes have been successfully committed to the repository under the message `chore: add test and verify pipeline`.

