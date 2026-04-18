# REM Waste — Skip Hire Booking Flow

A full-stack skip hire booking application built as a QA assessment for REM Waste. The project demonstrates a realistic multi-step booking flow with deterministic API fixtures, comprehensive test coverage, and production-grade automation.

**Live Demo:** https://rem-waste-booking.vercel.app  
**Source Code:** https://github.com/hagaryul/rem-waste-booking

---

## Tech Stack

- **Frontend & API:** Next.js 15 (TypeScript)
- **Styling:** Tailwind CSS + inline styles
- **E2E Automation:** Cypress 15
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js v20+
- npm v10+

### Installation

```bash
git clone https://github.com/hagaryul/rem-waste-booking.git
cd rem-waste-booking
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Production Build

```bash
npm run build
npm start
```

---

## Booking Flow

The application guides users through 4 steps:

1. **Postcode** — UK postcode validation, address lookup, address selection or manual entry
2. **Waste Type** — General waste, Heavy waste, Plasterboard (with 3 handling options)
3. **Skip Size** — 8 skip options with enabled/disabled states based on waste type
4. **Review** — Full summary, price breakdown with VAT, booking confirmation

---

## API Contract

All API routes are implemented as Next.js API routes with deterministic fixtures.

### POST /api/postcode/lookup
```json
Request:  { "postcode": "SW1A 1AA" }
Response: { "postcode": "SW1A 1AA", "addresses": [{ "id": "addr_1", "line1": "10 Downing Street", "city": "London" }] }
```

### POST /api/waste-types
```json
Request:  { "generalWaste": true, "heavyWaste": false, "plasterboard": false, "plasterboardOption": null }
Response: { "ok": true }
```

### GET /api/skips?postcode=SW1A1AA&heavyWaste=true
```json
Response: { "skips": [{ "size": "4-yard", "price": 120, "disabled": false }, { "size": "12-yard", "price": 260, "disabled": true }] }
```

### POST /api/booking/confirm
```json
Request:  { "postcode": "SW1A 1AA", "addressId": "addr_1", "heavyWaste": true, "plasterboard": false, "skipSize": "4-yard", "price": 120 }
Response: { "status": "success", "bookingId": "BK-12345" }
```

---

## Mocking & Test Data Strategy

All API routes act as deterministic mocks — no external services or databases are used. Each postcode returns a fixed, predictable response, making tests fully reproducible.

### Deterministic Fixtures

| Postcode | Behaviour |
|----------|-----------|
| `SW1A 1AA` | Returns 12 addresses |
| `EC1A 1BB` | Returns 0 addresses (empty state) |
| `M1 1AE` | Simulates 3 second network latency |
| `BS1 4DJ` | Returns 500 error on first call, success on retry |

### Shared State Store

A server-side `bookingStore` (`lib/store.ts`) manages:
- `usedBookings` — prevents duplicate bookings
- `bs14djCallCount` — tracks retry behaviour for BS1 4DJ

### Test Reset Endpoint

A dedicated `POST /api/test/reset` endpoint resets all server state between Cypress tests, ensuring full test isolation without restarting the server.

### Stable Selectors

All interactive elements use `data-cy` attributes (e.g. `data-cy="postcode-input"`, `data-cy="confirm-button"`) as stable test selectors. These are decoupled from CSS classes and UI changes, ensuring test reliability.

### Cypress Custom Commands

Reusable commands are defined in `cypress/support/commands.ts`:
- `cy.resetBookings()` — resets server state
- `cy.completeStep1(postcode, addressId)` — completes postcode step
- `cy.completeStep2General()` — selects general waste
- `cy.completeStep2Heavy()` — selects heavy waste
- `cy.completeStep2Plasterboard(option)` — selects plasterboard with handling option
- `cy.completeStep3(skipSize)` — selects skip size
- `cy.completeStep4()` — reviews and confirms booking

### Test Data Fixtures

All test data (postcodes, address IDs, skip sizes) is centralised in `cypress/fixtures/test-data.json`, avoiding hardcoded values in test files.

---

## Running Tests

### Cypress E2E (Interactive)

```bash
npx cypress open
```

Select **E2E Testing** → **Chrome** → run `general-flow.cy.ts` or `heavy-waste-flow.cy.ts`.

### Cypress E2E (Headless)

```bash
npx cypress run
```

> **Note:** The development server must be running on port 3000 before running Cypress tests.

---

## CI/CD Pipeline

GitHub Actions runs on every push and pull request to `main`.

**Pipeline steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Build application
5. Start server
6. Wait for server to be ready
7. Run Cypress E2E tests in Chrome (headless)
8. Upload screenshots on failure
9. Upload videos on every run

See `.github/workflows/ci.yml` for full configuration.

---

## AI Usage in This Project

As part of REM Waste's focus on real AI experience, AI tools were actively used throughout this assessment:

- **Test case generation** — AI assisted in brainstorming edge cases and boundary conditions to complement manual analysis
- **Bug discovery** — AI-assisted code review helped surface potential issues, which were then validated and documented manually
- **Test strategy** — AI helped organize and structure the manual test plan across the required categories
- **Automation** — AI provided code suggestions during Cypress test development, with all logic reviewed and refined manually

---

## Project Structure

```
rem-waste-booking/
├── app/
│   ├── api/
│   │   ├── postcode/lookup/route.ts
│   │   ├── waste-types/route.ts
│   │   ├── skips/route.ts
│   │   ├── booking/confirm/route.ts
│   │   └── test/reset/route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── StepPostcode.tsx
│   ├── StepWasteType.tsx
│   ├── StepSkipSelect.tsx
│   └── StepReview.tsx
├── lib/
│   ├── types.ts
│   ├── styles.ts
│   └── store.ts
├── cypress/
│   ├── e2e/
│   │   ├── general-flow.cy.ts
│   │   └── heavy-waste-flow.cy.ts
│   ├── fixtures/
│   │   └── test-data.json
│   └── support/
│       └── commands.ts
├── .github/workflows/ci.yml
├── ui/
│   ├── desktop-step1.png
│   ├── desktop-step2.png
│   ├── desktop-step3.png
│   ├── desktop-step4.png
│   ├── desktop-confirmation.png
│   ├── mobile-step1.png
│   ├── mobile-step2.png
│   ├── error-state.png
│   ├── disabled-skips.png
│   ├── price-breakdown.png
│   └── lighthouse-report.png
├── manual-tests.md
├── bug-reports.md
└── README.md
```

---

## Test Coverage Summary

| Category | Count |
|----------|-------|
| Manual test cases | 51 |
| Negative tests | 12 |
| Edge cases | 8 |
| API failure tests | 5 |
| State transition tests | 6 |
| Cypress E2E flows | 2 |
| Cypress test specs | 19 |
| Bugs reported | 3 |

---

## Lighthouse Scores (Production)

Tested on `https://rem-waste-booking.vercel.app` in Chrome incognito.

| Category | Score |
|----------|-------|
| Performance | 95 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

