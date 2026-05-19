# PenguinPay

A single-page React app created as a take home tech test for Zepz.
Users enter a recipient's details into a single page form, the app then fetches live exchange rates and displays the converted local-currency amount before mocking the sending of funds.

Time constraint compromises will be documented in code comments as per the tech spec's recommendation.

## Stack

- **React 18** + **TypeScript**
- **Vite** (dev server + bundler)
- **Vitest** + **Testing Library** (unit tests)
- Exchange rates via [Open Exchange Rates](https://openexchangerates.org)

## How to run the project locally

```bash
npm install
npm run dev       # starts dev server at http://localhost:5173
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run unit tests with Vitest |

## Project tree

```
src/
├── api/                        # External API calls (exchange rates)
├── components/
│   ├── AmountToSendInput/      # USD amount field with $ prefix
│   ├── CountrySelect/          # Dropdown for destination country
│   ├── NameInput/              # Reusable first/last name field
│   ├── PhoneNumberInput/       # Phone field with country dial prefix
│   ├── ReceivedAmount/         # Displays converted local currency
│   ├── SendButton/             # Submit button with sending/sent states
│   └── TransactionBanner/      # Status banner shown after send
├── hooks/
│   └── useExchangeRates.ts     # Fetches live exchange rates from Open Exchange Rates
├── pages/
│   └── payment-page/
│       └── SendMoneyPage.tsx   # Main transation form
├── styles/
│   └── global.css              # Global styles and CSS variables
├── types/                      # Shared TypeScript types
├── unit-tests/                 # Holds unit tests for components & payment screen
├── utils/                      # Form validation and currency conversion
├── App.tsx
└── main.tsx
```

## Supported countries

| Country | Currency | Dial prefix |
|---|---|---|
| Kenya | KES | +254 |
| Nigeria | NGN | +234 |
| Tanzania | TZS | +255 |
| Uganda | UGX | +256 |
