# QA Automation Assessment

Playwright + TypeScript test automation framework for UI ([SauceDemo](https://www.saucedemo.com/)) and API ([Restful-Booker](https://restful-booker.herokuapp.com/)) testing.

## Project Structure

```
├── .github/workflows/ci.yml    # CI pipeline (GitHub Actions)
├── src/
│   ├── api/                     # API client abstraction
│   │   ├── ApiClient.ts         # Generic HTTP client with auth handling
│   │   └── BookingApi.ts        # Booking-specific API methods
│   ├── fixtures/
│   │   └── testFixture.ts       # Playwright fixtures (pages & API)
│   ├── pages/                   # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── schemas/
│   │   └── bookingSchema.ts     # Schema validation
│   ├── types/                   # TypeScript interfaces
│   │   ├── booking.ts
│   │   └── user.ts
│   └── utils/
│       └── testData.ts          # Reusable test data factories
├── tests/
│   ├── ui/                      # UI test specs
│   │   ├── auth.spec.ts
│   │   ├── products.spec.ts
│   │   ├── checkout.spec.ts
│   │   ├── network-interception.spec.ts
│   │   └── console-errors.spec.ts
│   └── api/                     # API test specs
│       ├── auth.spec.ts
│       └── booking.spec.ts
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Browser Installation

```bash
npx playwright install
```

This installs Chromium, Firefox, and WebKit browsers.

## How to Execute Tests

### Run all tests

```bash
npm test
```

### Run UI tests only

```bash
npm run test:ui
```

### Run API tests only

```bash
npm run test:api
```

### Run tests in a specific browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run tests with CI settings

```bash
CI=true npx playwright test
```

## Reports

### Generate and open HTML report

```bash
npm run report
```

The HTML report is generated in the `playwright-report/` directory after test execution.

## Test Artifacts

- **Screenshots**: Captured on test failure (`test-results/`)
- **Video**: Recorded on test failure (`test-results/`)
- **Trace**: Collected on first retry (`test-results/`)

## Environment Variables

| Variable | Description            | Default |
| -------- | ---------------------- | ------- |
| `CI`     | Enables CI mode        | `false` |

## Multi-Browser Support

Configured in `playwright.config.ts` for Chromium, Firefox, and WebKit.

## Advanced Features Implemented

### Category 1 (UI)
- **Network request interception** (`tests/ui/network-interception.spec.ts`)
- **Console error capturing** (`tests/ui/console-errors.spec.ts`)

### Category 2 (Framework)
- **GitHub Actions CI pipeline** (`.github/workflows/ci.yml`)
- **Schema validation** (`src/schemas/bookingSchema.ts`)

## API Coverage

- `POST /auth` - Authentication with valid/invalid credentials
- `GET /booking` - List all bookings
- `GET /booking/{id}` - Get booking by ID
- `POST /booking` - Create booking
- `PUT /booking/{id}` - Full update
- `PATCH /booking/{id}` - Partial update
- `DELETE /booking/{id}` - Delete booking
- Chained API calls (create → update → retrieve → delete)

## Known Limitations

- SauceDemo login errors return HTTP 200 with error messages on the page (no HTTP error codes).
- Restful-Booker auth endpoint returns HTTP 200 even for invalid credentials; error is detected by absence of `token` field in response.
- `DELETE` returns 201 (Created) instead of 200 or 204.
- `PUT`/`PATCH`/`DELETE` require prior authentication via `POST /auth` to obtain a token.
- No visual testing implemented.
- Performance testing is not included.
