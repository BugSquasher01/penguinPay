import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SendMoneyForm from '../pages/payment-page/SendMoneyPage';
import { getCurrentExchangeRates, ExchangeRateError } from '../api/getCurrentExchangeRates';

// vi.mock is hoisted by Vitest so the mock is in place before useExchangeRates binds its import
vi.mock('../api/getCurrentExchangeRates', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/getCurrentExchangeRates')>();
  return {
    ...actual,
    getCurrentExchangeRates: vi.fn(),
  };
});


const mockGetRates = vi.mocked(getCurrentExchangeRates);


// Mock exchange rates response for successful API call
const MOCK_RATES = {
  rates: { KES: 130, NGN: 1500, TZS: 2500, UGX: 3700 },
  base: 'USD',
  timestamp: 1700000000,
};

// Mock successful response for exchange rates API call
function mockRatesSuccess() {
  mockGetRates.mockResolvedValue(MOCK_RATES);
}

// Mock failure response for exchange rates API call
function mockRatesFailure(message = 'The exchange rate service is temporarily unavailable. Please try again later.') {
  mockGetRates.mockRejectedValue(new ExchangeRateError(message));
}

function fillForm() {
  fireEvent.change(screen.getByLabelText('Recipient First Name'), { target: { value: 'Bobby' } });
  fireEvent.change(screen.getByLabelText('Recipient Last Name'), { target: { value: 'Smith' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'KE' } });
  fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '712345678' } });
  fireEvent.change(screen.getByLabelText('Amount to Send (USD)'), { target: { value: '100' } });
}

beforeEach(() => {
  vi.useFakeTimers();
  mockGetRates.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('SendMoneyPage: send button availability', () => {
  it('should disable the send button when exchange rates are loading', () => {
    mockGetRates.mockReturnValue(new Promise(() => {}));
    render(<SendMoneyForm />);
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('should enable the send button once rates load and all fields are filled', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled();
  });

  it('should show validation errors on each invalid field and not be able to send when form is empty on submit', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByText('Last name is required.')).toBeInTheDocument();
    expect(screen.getByText('Please select a country.')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
    expect(screen.getByText('Amount is required.')).toBeInTheDocument();
  });

  it('should show validation error on the first name field when first name is missing', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fireEvent.change(screen.getByLabelText('Recipient Last Name'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'KE' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '712345678' } });
    fireEvent.change(screen.getByLabelText('Amount to Send (USD)'), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('First name is required.')).toBeInTheDocument();
  });

  it('should show a validation error on the country dropdown when country is not selected', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fireEvent.change(screen.getByLabelText('Recipient First Name'), { target: { value: 'Bobby' } });
    fireEvent.change(screen.getByLabelText('Recipient Last Name'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText('Amount to Send (USD)'), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('Please select a country.')).toBeInTheDocument();
  });

  it('should show a validation error on the phone number field when phone number is missing', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fireEvent.change(screen.getByLabelText('Recipient First Name'), { target: { value: 'Bobby' } });
    fireEvent.change(screen.getByLabelText('Recipient Last Name'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'KE' } });
    fireEvent.change(screen.getByLabelText('Amount to Send (USD)'), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
  });

  it('should show a validation error on the amount field when amount is missing', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fireEvent.change(screen.getByLabelText('Recipient First Name'), { target: { value: 'Bobby' } });
    fireEvent.change(screen.getByLabelText('Recipient Last Name'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'KE' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '712345678' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('Amount is required.')).toBeInTheDocument();
  });
});

describe('SendMoneyPage: Receipient Receives display', () => {
  it('should show the converted amount in local currency when all fields are valid', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fillForm();
    // 100 USD * 130 KES/USD = 13000.00 KES
    expect(screen.getByText('13000.00 KES')).toBeInTheDocument();
  });

  it('should show a dash when no country or amount is entered yet', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

describe('SendMoneyPage exchange rate API errors', () => {
  it('should display an appropriate error message when the API returns an error', async () => {
    mockRatesFailure();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    expect(
      screen.getByText('The exchange rate service is temporarily unavailable. Please try again later.')
    ).toBeInTheDocument();
  });

  // simulating a network failure or other unexpected error that prevents fetching exchange rates
  it('should disable the send button when exchange rates fail to load', async () => {
    mockRatesFailure();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('should display a message to the user on network failure', async () => {
    mockGetRates.mockRejectedValue(
      new ExchangeRateError('Unable to reach the exchange rate service. Please check your connection.')
    );
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    expect(
      screen.getByText('Unable to reach the exchange rate service. Please check your connection.')
    ).toBeInTheDocument();
  });
});

describe('SendMoneyPage send flow', () => {
  it('should show a sending banner while the transaction is in progress', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText(/sending transaction to Bobby Smith/i)).toBeInTheDocument();
  });

  it('should show a success banner and "Sent" button after the transaction completes', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    act(() => { vi.runAllTimers(); });

    expect(screen.getByText(/transaction sent successfully to Bobby Smith/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sent/i })).toBeInTheDocument();
  });

  it('should disable all form fields after send is triggered', async () => {
    mockRatesSuccess();
    render(<SendMoneyForm />);
    await act(async () => { await Promise.resolve(); });

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    for (const input of screen.getAllByRole('textbox')) {
      expect(input).toBeDisabled();
    }
  });
});
