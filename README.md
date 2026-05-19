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


## Time Constraints - considerations & improvements:

In this section, I will list out the parts of the app I would do differently if i was not under the tech-test time constraints, explain why each approach is important, and how I would implement it differently.

1) App State

Currently, app state is stored locally in `SendMoneyPage.tsx` and only accessable from within it's own scope.
This was done for simplicity within a single-page app, speed of implementation, and no multi-page state needing to be tracked.
If this app was to be expanded into a multi-page app that had more complex state tracking needs, I would look towards a state management library (eg Redux) to control the app state & form validation.

Why this is important: 
This would prevent local state being difficult to track, allows state to be accessable across the entire application, prevents difficult debugging with multiple layers of local state to track the effects of.

2) API keys

Currently the `getCurrentExchangeRates()` API call has the `APP_ID` and `RATES_URL` hardcoded.
For a larger scale application, this is unsafe as the keys are exposed to the frontend, and direct 3rd party API calls reduce the control over logging, retries, rate limiting and request shaping.

In a live production app,  there are a few ways to handle API keys based on the sensitivity of the key and if you want more safety/control over the key, for example:

- The `APP_ID` key can be stored as a github secret/env var storage, able to be retrieved at build time, or
- Use a backend proxy with server-side secrets for more protection over the API key

3) Exchange rate fetching

Currently, the `getCurrentExchangeRates()` is called once on mount, and not again.
This would be an issue in a live production app as refresh rates could become stale by the time a user hits Send, leading to incorrect exchange rates displayed to the user.

If i had more time I would implement:
- Define a lifespan for the fetched exchange rates, implement retry logic for if the exchange rate call failed / lifespan expired
- Fetch the latest exchange rates before submission/after expiry

4) `SendMoneyPage.tsx` owns too many responsibilities

Currently, `SendMoneyPage.tsx` handles too many responsibilities.
I chose to engineer it this way due to the small scale of the project, however in a bigger project or with less time constraints, I would extract out as much business logic from the component as I could - for example, extracting out `receivedAmount()` into a helper function, and passing `SendMoneyPage.tsx` only the information it needs to know.

Why this is important:
If SendMoneyPage.tsx would continue to be built upon in it's current way, it can cause the component to become bloated, difficult to follow and debug.
