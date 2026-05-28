# Sauce Labs Demo Shop – Playwright Test Automation

Automated test suite for the [Sauce Labs Demo Shop](https://www.saucedemo.com), built as part of the Greenbone Test Automation Engineer coding challenge.

**Stack:** Playwright · TypeScript · Page Object Model

---

## Project Structure

```
.
├── pages/                  # Page Object Model classes
│   ├── LoginPage.ts        # Login screen interactions
│   ├── InventoryPage.ts    # Product listing page interactions
│   ├── CartPage.ts         # Cart page interactions
│   └── CheckoutPage.ts     # Checkout flow (step 1, step 2, confirmation)
├── tests/                  # Test specs — one file per feature area
│   ├── login.spec.ts       # TC-01 – Login (Priority 1)
│   ├── cart.spec.ts        # TC-03 – Add to cart / cart management (Priority 3)
│   └── checkout.spec.ts    # TC-02 – End-to-end checkout flow (Priority 2)
├── test-cases/
│   └── test-cases.txt      # 10 identified test cases, TCMS detail, prioritisation, future plans
├── playwright.config.ts    # Playwright configuration
├── package.json
└── tsconfig.json
```

### Why this structure?

Each page in the application has a single corresponding Page Object. Page Objects expose typed, named methods that describe *what* the user does ("add item to cart") rather than *how* Playwright does it (locator chains). This keeps test specs readable and ensures that selector changes only need to be updated in one place.

Test specs are grouped by feature area, making it easy to run a targeted subset and locate failures quickly.

---

## Prerequisites

- **Node.js** 18 or higher ([nodejs.org](https://nodejs.org))
- **npm** 9 or higher (bundled with Node.js)

---

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd greenbone-saucedemo-tests

# Install npm dependencies
npm install

# Install Playwright browsers (Chromium is the primary browser for this suite)
npx playwright install chromium
```

---

## Running the Tests

```bash
# Run the full test suite (headless Chromium)
npm test

# Run with a visible browser window (useful for debugging locally)
npm run test:headed

# Open the interactive Playwright UI (test explorer + time-travel debugger)
npm run test:ui

# Run a specific test file
npx playwright test tests/checkout.spec.ts

# Run a specific test by title
npx playwright test --grep "TC-02"

# Open the HTML report after a run
npm run report
```

### Browser Choice

The suite targets **Chromium** as its primary browser. Chromium provides the fastest, most stable experience for CI use and is the most widely used browser worldwide. Firefox and WebKit projects are commented out in `playwright.config.ts` and can be enabled for cross-browser runs.

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value | Notes |
|---|---|---|
| `baseURL` | `https://www.saucedemo.com` | Override with `BASE_URL` env var if needed |
| `retries` | `2` on CI, `0` locally | Reduces false negatives from network variance |
| `trace` | `on-first-retry` | Trace files saved on retry for debugging |
| `screenshot` | `only-on-failure` | Screenshots saved alongside failed test results |

---

## Contribution Guide

### Adding a New Test

1. **Identify the page** the test interacts with. If a Page Object exists, use it. If the page isn't covered yet, create a new `pages/YourPage.ts`.
2. **Create or extend a spec file** in `tests/`. Group tests for the same feature in the same file.
3. **Follow the naming convention:**
   - Spec files: `feature-area.spec.ts`
   - Page Objects: `FeaturePage.ts`
   - Test titles: start with the TC ID if it maps to a documented test case (e.g. `'TC-04 locked_out_user sees error...'`)

### Writing Page Objects

- **Use `data-test` attributes** as the primary selector strategy. The Sauce Labs demo app provides these on all key elements (e.g. `page.getByTestId('login-button')`). They are stable — they don't change with styling or text copy updates.
- Fall back to `getByRole` or `getByLabel` for elements without `data-test` attributes.
- **Avoid CSS class selectors** and XPath — these are implementation details that break when the UI is restyled.
- Page Object methods should describe user intent: `addItemToCart(name)` not `clickButtonWithTestId(id)`.

### Test Isolation

- Each test must be fully independent. Use `test.beforeEach` to log in and navigate to a consistent starting state.
- Never rely on state left by a previous test. Playwright runs tests in parallel by default.
- If you need to reset app state, use the Sauce Labs "Reset App State" option from the burger menu or start from a fresh login.

### Assertions

- Prefer **Playwright's `expect` auto-retry assertions** (e.g. `await expect(locator).toBeVisible()`) over manual waits. These retry automatically until the condition is met or a timeout is reached, which eliminates flakiness from slow rendering.
- Assert on **meaningful outcomes**, not implementation details. Check that the user sees the confirmation header, not that a specific div exists.

### CI

Tests run in CI with `retries: 2` and `workers: 1`. If adding a test that calls an external service or has known timing variance, add a targeted `test.slow()` call to triple the timeout for that test only.

---

## Test Cases

See [`test-cases/test-cases.txt`](test-cases/test-cases.txt) for the full list of 10 identified test cases, detailed TCMS write-up for TC-02, prioritisation with reasoning, and future improvement plans.
